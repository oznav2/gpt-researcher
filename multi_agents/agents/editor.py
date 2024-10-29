from datetime import datetime
import asyncio
from typing import Dict, List, Optional

from langgraph.graph import StateGraph, END

from .utils.views import print_agent_output
from .utils.llms import call_model
from ..memory.draft import DraftState
from . import ResearchAgent, ReviewerAgent, ReviserAgent


class EditorAgent:
    """Agent responsible for editing and managing code."""

    def __init__(self, websocket=None, stream_output=None, headers=None):
        self.websocket = websocket
        self.stream_output = stream_output
        self.headers = headers or {}

    async def plan_research(self, research_state: Dict[str, any]) -> Dict[str, any]:
        """
        Plan the research outline based on initial research and task parameters.
        """
        initial_research = research_state.get("initial_research")
        task = research_state.get("task")
        include_human_feedback = task.get("include_human_feedback")
        human_feedback = research_state.get("human_feedback")
        max_sections = task.get("max_sections")

        prompt = self._create_planning_prompt(
            initial_research, include_human_feedback, human_feedback, max_sections
        )

        print_agent_output(
            "Planning an outline layout based on initial research...", agent="EDITOR"
        )
        plan = await call_model(
            prompt=prompt,
            model=task.get("model"),
            response_format="json",
        )

        return {
            "title": plan.get("title"),
            "date": plan.get("date"),
            "sections": plan.get("sections"),
        }

    async def run_parallel_research(self, research_state: dict):
        """
        Run research tasks in parallel for each section.
        """
        workflow = self._create_workflow()
        chain = workflow.compile()
        
        queries = research_state.get("sections")
        title = research_state.get("title")

        self._log_parallel_research(queries)

        final_drafts = [
            chain.ainvoke(self._create_task_input(research_state, query, title))
            for query in queries
        ]

        results = await asyncio.gather(*final_drafts)

        research_results = []
        for result in results:
            if isinstance(result, dict) and 'draft' in result:
                research_results.append(result['draft'])
            else:
                print(f"Warning: Unexpected result format: {result}")
                # You might want to add a placeholder or skip this result
                research_results.append({"error": "Invalid result format"})

        return {"research_data": research_results}

    def _create_planning_prompt(
        self,
        initial_research: str,
        include_human_feedback: bool,
        human_feedback: Optional[str],
        max_sections: int
    ) -> List[Dict[str, str]]:
        """Create the prompt for research planning."""
        return [
            {
                "role": "system",
                "content": (
                    "You are a research editor. Your goal is to oversee the research project "
                    "from inception to completion. Your main task is to plan the article section "
                    "layout based on an initial research summary.\n"
                ),
            },
            {
                "role": "user",
                "content": self._format_planning_instructions(
                    initial_research, include_human_feedback, human_feedback, max_sections
                ),
            },
        ]

    def _format_planning_instructions(
        self,
        initial_research: str,
        include_human_feedback: bool,
        human_feedback: Optional[str],
        max_sections: int
    ) -> str:
        """Format the instructions for research planning."""
        today = datetime.now().strftime('%d/%m/%Y')
        feedback_instruction = (
            f"Human feedback: {human_feedback}. You must plan the sections based on the human feedback."
            if include_human_feedback and human_feedback and human_feedback.lower() != 'no'
            else ''
        )

        return (
            f"Today's date is {today}\n"
            f"Research summary report: '{initial_research}'\n"
            f"{feedback_instruction}\n"
            "Your task is to generate an outline of sections headers for the research project "
            "based on the research summary report above.\n"
            f"You must generate a maximum of {max_sections} section headers.\n"
            "You must focus ONLY on related research topics for subheaders and do NOT include introduction, conclusion, and references.\n"
            "You must return nothing but a JSON with the fields 'title' (str), 'date' (str), and "
            "'sections' (list of section headers) with the following structure:\n"
            "{\n"
            '    "title": "string research title",\n'
            '    "date": "today\'s date",\n'
            '    "sections": ["section header 1", "section header 2", "section header 3", ...]\n'
            "}"
        )

    def _initialize_agents(self) -> Dict[str, any]:
        """Initialize the research, reviewer, and reviser agents."""
        return {
            "research": ResearchAgent(self.websocket, self.stream_output, self.headers),
            "reviewer": ReviewerAgent(self.websocket, self.stream_output, self.headers),
            "reviser": ReviserAgent(self.websocket, self.stream_output, self.headers),
        }

    def _create_workflow(self) -> StateGraph:
        """Create the workflow for the research process."""
        agents = self._initialize_agents()
        workflow = StateGraph(DraftState)

        workflow.add_node("researcher", agents["research"].run_depth_research)
        workflow.add_node("reviewer", agents["reviewer"].run)
        workflow.add_node("reviser", agents["reviser"].run)

        workflow.set_entry_point("researcher")
        workflow.add_edge("researcher", "reviewer")
        workflow.add_edge("reviser", "reviewer")
        workflow.add_conditional_edges(
            "reviewer",
            lambda draft: "accept" if draft["review"] is None else "revise",
            {"accept": END, "revise": "reviser"},
        )

        return workflow

    def _log_parallel_research(self, queries: List[str]) -> None:
        """Log the start of parallel research tasks."""
        message = f"Running parallel research for the following queries: {queries}"
        if self.websocket and self.stream_output:
            asyncio.create_task(self.stream_output(
                "logs",
                "parallel_research",
                message,
                self.websocket,
            ))
        else:
            print_agent_output(message, agent="EDITOR")

    def _create_task_input(
        self, research_state: Dict[str, any], query: str, title: str
    ) -> Dict[str, any]:
        """Create the input for a single research task."""
        return {
            "task": research_state.get("task"),
            "topic": query,
            "title": title,
            "headers": self.headers,
        }
