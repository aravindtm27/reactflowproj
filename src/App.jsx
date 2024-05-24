import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { UpdateNode } from './components/UpdateNode';

import {TextUpdaterNode} from './components/Node';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes = [
  { id: 'node-1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { heading: 'Send Message', label:'Test Message' } },
];

const flowKey = 'flowkey'
let id = 1
// we define the nodeTypes outside of the component to prevent re-renderings
const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeSelected, setNodeSelected] = useState(false)
  const [changeNode, setChangeNode] = useState(null)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  //Moving message node box for making new nodes
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  //Stop
  const onDrop =
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      console.log(position);

      // creating a new node
      const newerNode = {
        id: `${id}`,
        type: 'textUpdater',
        position,
        data: { heading: 'Send Message', label: `text message ${id}` },
      }

      // console.log(id, newNode)
      id++
      setNodes((nds) => nds.concat(newerNode))
    }

    // Check for empty target handles
    const checkEmptyTargetHandles = () => {
      let emptyTargetHandles = 0;
      edges.forEach((edge) => {
        if (!edge.targetHandle) {
          emptyTargetHandles++;
        }
      });
      return emptyTargetHandles;
    };
  
    // Check if any node is unconnected
    const isNodeUnconnected = useCallback(() => {
      let unconnectedNodes = nodes.filter(
        (node) =>
          !edges.find(
            (edge) => edge.source === node.id || edge.target === node.id
          )
      );
  
      return unconnectedNodes.length > 0;
    }, [nodes, edges]);
  
    // Save flow to local storage
    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        const emptyTargetHandles = checkEmptyTargetHandles();
  
        if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
          alert(
            "Error: More than one node has an empty target handle or there are unconnected nodes."
          );
        } else {
          const flow = reactFlowInstance.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
          alert("Save successful!"); // Provide feedback when save is successful
        }
      }
    }, [reactFlowInstance, nodes, isNodeUnconnected]);


    const update = (event, node) => {
      console.log(event, node);
      setChangeNode(node)
      if(nodeSelected){
        setNodeSelected(false)
      }else{
        setNodeSelected(true)
      }
    }

    const nodeUpdate =() =>{
      setNodeSelected(false);
    }

  return (
    <ReactFlowProvider>
    <div style={{ width: '100vw', height: '100vh' }} className='reactflow-wrapper' ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={update}
        nodeTypes={nodeTypes}
        fitView
        className='bg-slate-200'
      />


      <div className='bg-slate-400 w-1/5 h-screen absolute z-10 right-0 top-0 justify-center flex'>
        <div>
        <div onClick={onSave} className='cursor-pointer text-center w-full mt-4 p-4 border-2 border-slate-800 rounded-md text-slate-800 bg-slate-200 h-fit hover:bg-slate-800 hover:text-slate-200 ease-in duration-200'>
          Save
        </div>
        {nodeSelected ? (
          <UpdateNode
          selectedNode={changeNode}
          setNodeSelected={setNodeSelected}
          setNodes={setNodes}
        />
        ):(
        <div draggable onDragStart={(event) => onDragStart(event, 'default')}
         className='mt-4 cursor-move p-4 border-2 border-slate-800 rounded-md text-slate-800 bg-slate-200 w-fit h-fit hover:bg-slate-800 hover:text-slate-200 ease-in duration-200'>
          New Message
        </div>
        )}
        <div onClick={nodeUpdate}>Back</div>

        </div>
        </div>


      <MiniMap position='bottom-center' pannable zoomable/>
      <Controls />
    </div>
    </ReactFlowProvider>
  );
}

export default Flow;