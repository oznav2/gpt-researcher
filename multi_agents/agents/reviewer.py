from .utils.views import print_agent_output
from .utils.llms import call_model

TEMPLATE = """You are an expert research article reviewer. \
Your goal is to review research drafts and provide feedback to the reviser only based on specific guidelines. \
"""


class ReviewerAgent:
    def __init__(self, websocket=None, stream_output=None, headers=None):
        self.websocket = websocket
        self.stream_output = stream_output
        self.headers = headers or {}

    async def review_draft(self, draft_state: dict):
        task = draft_state.get("task")
        guidelines = "- ".join(guideline for guideline in task.get("guidelines", []))
        revision_notes = draft_state.get("revision_notes")
        draft = draft_state.get("draft")

        revise_prompt = f"""The reviser has already revised the draft based on your previous review notes with the following feedback:
{revision_notes}\n
Please provide additional feedback ONLY if critical since the reviser has already made changes based on your previous feedback.
If you think the article is sufficient or that non critical revisions are required, please aim to return None.
"""

        review_prompt = f"""You have been tasked with reviewing the draft which was written by a non-expert based on specific guidelines.
Please accept the draft if it is good enough to publish, or send it for revision, along with your notes to guide the revision.
If not all of the guideline criteria are met, you should send appropriate revision notes.
If the draft meets all the guidelines, please return None.
{revise_prompt if revision_notes else ""}

Guidelines: {guidelines}\nDraft: {draft}\n
"""
        prompt = [
            {"role": "system", "content": TEMPLATE},
            {"role": "user", "content": review_prompt},
        ]

        response = await call_model(prompt, model=task.get("model"))

        if task.get("verbose"):
            await self.log_review_feedback(response)

        return None if "None" in response else response

    async def log_review_feedback(self, response):
        message = f"Review feedback is: {response}..."
        if self.websocket and self.stream_output:
            await self.stream_output("logs", "review_feedback", message, self.websocket)
        else:
            print_agent_output(message, agent="REVIEWER")

    async def run(self, draft_state: dict):
        task = draft_state.get("task")
        to_follow_guidelines = task.get("follow_guidelines")
        review = None

        if to_follow_guidelines:
            print_agent_output("Reviewing draft...", agent="REVIEWER")
            if task.get("verbose"):
                print_agent_output(f"Following guidelines {task.get('guidelines')}...", agent="REVIEWER")
            review = await self.review_draft(draft_state)
        else:
            print_agent_output("Ignoring guidelines...", agent="REVIEWER")

        return {"review": review}
