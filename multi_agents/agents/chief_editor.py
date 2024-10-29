from typing import Dict, Any

from langgraph.graph import StateGraph, END
from langgraph.types import DraftState

from .editor import EditorAgent
from .human import HumanAgent
from .utils.views import print_agent_output
from .utils.llms import call_model
from gpt_researcher.utils.enum import Tone


class ChiefEditorAgent:
    """Agent that orchestrates the entire research process."""

    def __init__(self, task, task_id=None, websocket=None, stream_output=None, tone=Tone.Objective, headers=None):
        self.task = task
        self.task_id = task_id
        self.websocket = websocket
        self.stream_output = stream_output
        self.tone = tone
        self.headers = headers or {}
        self.editor_agent = EditorAgent(self.websocket, self.stream_output, self.headers)

    async def run_research_task(self):
        """
        Orchestrate the entire research task.
        """
        state = {"task": self.task, "task_id": self.task_id}

        # Step 1: Plan Research
        plan = await self.editor_agent.plan_research(state)
        state.update(plan)

        # Step 2: Run Parallel Research
        research_results = await self.editor_agent.run_parallel_research(state)
        state.update(research_results)

        # Additional steps can be added here if necessary

        return state

    async def initial_research(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform initial research based on the task.
        """
        task = state.get("task")

        prompt = self._create_initial_research_prompt(task)
        print_agent_output("Performing initial research...", agent="CHIEF_EDITOR")

        initial_research = await call_model(
            prompt=prompt,
            model=task.get("model"),
            response_format="text",
        )

        state["initial_research"] = initial_research
        return state

    def _create_initial_research_prompt(self, task: Dict[str, Any]) -> str:
        """Create the prompt for initial research."""
        topic = task.get("topic")
        today = task.get("date") or "today"

        return (
            f"You are a chief editor conducting initial research on the topic '{topic}'.\n"
            f"Today's date is {today}.\n"
            "Provide a comprehensive summary of the current state of knowledge on this topic."
        )
