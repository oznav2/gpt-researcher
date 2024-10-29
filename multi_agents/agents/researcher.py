from gpt_researcher import GPTResearcher
from colorama import Fore, Style
from .utils.views import print_agent_output
import asyncio
import aiohttp
from typing import Dict, Any


class ResearchAgent:
    def __init__(self, websocket=None, stream_output=None, tone=None, headers=None):
        self.websocket = websocket
        self.stream_output = stream_output
        self.headers = headers or {}
        self.tone = tone

    async def research(self, query: str, research_report: str = "research_report",
                       parent_query: str = "", verbose=True, source="web", tone=None, headers=None):
        # Initialize the researcher
        researcher = GPTResearcher(query=query, report_type=research_report, parent_query=parent_query,
                                   verbose=verbose, report_source=source, tone=tone, websocket=self.websocket, headers=self.headers)
        # Conduct research on the given query
        await researcher.conduct_research()
        # Write the report
        report = await researcher.write_report()

        return report

    async def run_subtopic_research(self, parent_query: str, subtopic: str, verbose: bool = True, source="web", headers=None):
        try:
            report = await self.research(parent_query=parent_query, query=subtopic,
                                         research_report="subtopic_report", verbose=verbose, source=source, tone=self.tone, headers=None)
        except Exception as e:
            print(f"{Fore.RED}Error in researching topic {subtopic}: {e}{Style.RESET_ALL}")
            report = None
        return {subtopic: report}

    async def run_initial_research(self, research_state: dict):
        task = research_state.get("task")
        query = task.get("query")
        source = task.get("source", "web")

        if self.websocket and self.stream_output:
            await self.stream_output("logs", "initial_research", f"מריץ מחקר רקע עבור שאילתה: {query}", self.websocket)
        else:
            print_agent_output(f"Running initial research on the following query: {query}", agent="RESEARCHER")
        return {"task": task, "initial_research": await self.research(query=query, verbose=task.get("verbose"),
                                                                      source=source, tone=self.tone, headers=self.headers)}

    async def run_depth_research(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Conduct in-depth research on the given topic.
        """
        topic = state.get("topic")
        print_agent_output(f"RESEARCHER: Running in-depth research on the following topic: {topic}")

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"https://api.example.com/search?q={topic}",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        state["research_data"] = data
                    else:
                        print_agent_output(f"Warning: Received status code {response.status} for topic: {topic}")
                        state["research_data"] = None
        except asyncio.TimeoutError:
            print_agent_output(f"Warning: Timeout occurred while researching topic: {topic}")
            state["research_data"] = None
        except Exception as e:
            print_agent_output(f"Error while researching topic '{topic}': {e}")
            state["research_data"] = None

        return state
