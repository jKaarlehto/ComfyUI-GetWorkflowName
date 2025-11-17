import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

const workflowNameNodes = new Set();

app.registerExtension({
    name: "workflow.getname",
    
    async setup() {
        patchWorkflowRename(app);
    },
    
    async afterConfigureGraph() {
        workflowNameNodes.clear();
        app.graph._nodes
            ?.filter(n => n.comfyClass === "GetWorkflowName")
            .forEach(n => workflowNameNodes.add(n));
        
        patchWorkflowRename(app);
    },
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "GetWorkflowName") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function() {
                onNodeCreated?.apply(this, arguments);
                
                workflowNameNodes.add(this);
                
                patchWorkflowRename(app);
                
                const activeWorkflow = app.extensionManager?.workflow?.activeWorkflow;
                let filename = activeWorkflow?.fullFilename?.replace(/\//g, '_') || "untitled";
                let widget = this.widgets?.find(w => w.name === "workflow_name");
                if (widget) {
                    widget.value = filename;
                }
                
                api.addEventListener('promptQueued', () => {
                    filename = app.extensionManager.workflow.activeWorkflow?.fullFilename?.replace(/\//g, '_') || "untitled";
                    widget.value = filename;
                });
            };
            
            const onRemoved = nodeType.prototype.onRemoved;
            nodeType.prototype.onRemoved = function() {
                onRemoved?.apply(this, arguments);
                workflowNameNodes.delete(this);
            };
        }
    }
});

function patchWorkflowRename(app) {
    const activeWorkflow = app.extensionManager?.workflow?.activeWorkflow;
    
    if (activeWorkflow && !activeWorkflow._renamePatched) {
        const originalRename = activeWorkflow.rename.bind(activeWorkflow);
        
        activeWorkflow.rename = async function(newPath) {
            const result = await originalRename(newPath);
            
            const newFilename = newPath.replace(/\//g, '_');
            
            workflowNameNodes.forEach(node => {
                const w = node.widgets?.find(w => w.name === "workflow_name");
                if (w) {
                    w.value = newFilename;
                }
            });
            
            return result;
        };
        
        activeWorkflow._renamePatched = true;
    }
}