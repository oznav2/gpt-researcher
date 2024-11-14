from dotenv import load_dotenv
import sys
import os
import uuid
import asyncio
import json

# Adjust the import path if necessary
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from multi_agents.agents.editor import EditorAgent
from gpt_researcher.utils.enum import Tone  # Import Tone if needed

# Run with LangSmith if API key is set
if os.environ.get("LANGCHAIN_API_KEY"):
    os.environ["LANGCHAIN_TRACING_V2"] = "true"

# Load environment variables
load_dotenv()

def open_task():
    # Get the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the absolute path to task.json
    task_json_path = os.path.join(current_dir, 'task.json')
    
    with open(task_json_path, 'r') as f:
        task = json.load(f)

    if not task:
        raise Exception("No task found. Please ensure a valid task.json file is present in the multi_agents directory and contains the necessary task information.")

    return task

async def run_research_task(query, websocket=None, stream_output=None, tone=Tone.Objective, headers=None):
    task = open_task()
    task["query"] = query

    # Instantiate the EditorAgent with optional parameters
    editor_agent = EditorAgent(websocket=websocket, stream_output=stream_output, headers=headers)
    
    # Initialize the research state
    research_state = {"task": task, "tone": tone.value}

    # Step 1: Plan the research
    plan = await editor_agent.plan_research(research_state)
    research_state.update(plan)

    # Step 2: Run parallel research
    research_results = await editor_agent.run_parallel_research(research_state)
    research_state.update(research_results)

    if websocket and stream_output:
        await stream_output("logs", "research_report", research_state.get("research_data"), websocket)

    return research_state.get("research_data")

async def main():
    # Open the task configuration
    task = open_task()
    task_id = str(uuid.uuid4())
    query = task.get("query", "Default Query")  # Use a default query if not provided

    # Instantiate the EditorAgent
    editor_agent = EditorAgent()

    # Initialize the research state with task, task_id, and tone
    research_state = {
        "task": task,
        "task_id": task_id,
        "tone": Tone.Objective.value,  # Adjust the tone as needed
    }

    # Add the query to the task
    task["query"] = query

    # Step 1: Plan the research
    plan = await editor_agent.plan_research(research_state)
    research_state.update(plan)

    # Step 2: Run parallel research
    research_results = await editor_agent.run_parallel_research(research_state)
    research_state.update(research_results)

    # Output the research report
    print("Research Report:", research_state.get("research_data"))

if __name__ == "__main__":
    asyncio.run(main())
