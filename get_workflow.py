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
            ],
            outputs=[
                io.String.Output()
            ]
        )

    @classmethod
    def execute(cls, **kwargs ) -> io.NodeOutput:
        workflow_name = kwargs.get("workflow_name", "")
        return io.NodeOutput(workflow_name)

class GetWorkflowNameExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [GetWorkflowName]

