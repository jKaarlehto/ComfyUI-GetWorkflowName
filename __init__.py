from .get_workflow import GetWorkflowNameExtension
from comfy_api.latest import ComfyExtension


async def comfy_entrypoint() -> ComfyExtension:
    print("Hi from entrypoint")
    return GetWorkflowNameExtension()

WEB_DIRECTORY = "./web/js"
__all__ = ["WEB_DIRECTORY"]