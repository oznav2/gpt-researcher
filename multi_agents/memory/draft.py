from typing import TypedDict, Optional
import operator


class DraftState(TypedDict):
    task: dict
    topic: str
    draft: Optional[dict]
    review: Optional[str]
    revision_notes: Optional[str]
