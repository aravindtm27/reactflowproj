import { useState,useEffect } from "react";

export const UpdateNode = ({
    selectedNode,
    setNodeSelected,
    setNodes
}) =>{
    const [nodeName, setNodeName] = useState(selectedNode.data['label']);
    let id = selectedNode.id;

    useEffect(() => {
        setNodeName(selectedNode.data['label']);
      }, [id]);

      // update the node on click of the save changes button
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [selectedNode, nodeName, setNodes]);

  return(
    <div>
        <p>Text</p>
        <textarea
          rows="4"
          cols="25"
          value={nodeName}
          onChange={(evt) => {
            setNodeName(evt.target.value);
            // setNewNodeLabel(evt.target.value);
          }}
          style={{ marginBottom: 15, borderRadius: 5 }}
        />
    </div>
  )
}