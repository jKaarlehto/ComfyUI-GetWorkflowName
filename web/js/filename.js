import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

app.registerExtension({
    name: "workflow.getname",
    
    async nodeCreated(node) {
        console.log(app.extensionManager.workflow.activeWorkflow);
        let filename = app.extensionManager.workflow.activeWorkflow.fullFilename;
        let widget = node.widgets?.find(w => w.name === "workflow_name");
        if (widget) {
            widget.value = filename;
        }

        api.addEventListener('promptQueued', () => {
            filename = app.extensionManager.workflow.activeWorkflow.fullFilename;
            widget.value = filename;
        });
    },

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass == "GetWorkflowName") {
            let filename = app.extensionManager.workflow.activeWorkflow.fullFilename;
            let widget = node.widgets?.find(w => w.name === "workflow_name");
            if (widget) {
                widget.value = filename;
            }
        }
    }
    
});