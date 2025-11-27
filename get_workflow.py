from comfy_api.latest import io, ComfyExtension

class GetWorkflowName(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="GetWorkflowName",
            display_name="Get Workflow Name",
            category="utils",
            description="Returns the workflow's name as a string",
            inputs=[
                io.String.Input("workflow_name",
                    default="untitled",
                    multiline=False
                ),
                io.String.Input("discard_after_this_delimiter",
                    default="_v",
                ),
                io.Boolean.Input("also_remove_delimiter",
                    default=True)
            ],
            outputs=[
                io.String.Output(display_name="filename.extension"),
                io.String.Output(display_name="delimiter_removed"),
                io.String.Output(display_name="filename/filename")
            ]
        )
    @classmethod
    def execute(cls, **kwargs ) -> io.NodeOutput:
        workflow_name = kwargs.get("workflow_name", "")
        sub = kwargs.get("discard_after_this_delimiter", "_v")
        inclusive = kwargs.get("also_remove_delimiter", True)

        parsed_name = str(workflow_name)
        doubled_name = str(workflow_name)
        if sub:
            i = parsed_name.rfind(sub)
            if i != -1:
                n = 0 if inclusive else len(sub)
                parsed_name = parsed_name[:i + n]
                doubled_name = f"{parsed_name}/{parsed_name}"
        return io.NodeOutput(workflow_name, parsed_name, doubled_name)

class GetWorkflowNameExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [GetWorkflowName]

