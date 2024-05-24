import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
 
const handleStyle = { top: 20 };
 
export function TextUpdaterNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle isConnectableStart type="target" style={handleStyle} position={Position.Left} id='a'/>
      <div className='rounded-sm'>
        <p className='bg-green-300 rounded-sm shadow-sm text-sm font-light px-2' htmlFor="text">{data.heading}</p>
        {/* <input placeholder='Text Message' className='p-1 nodrag' id="text" name="text" onChange={onChange}  /> */}
        <div className='text-xs p-2 rounded-sm shadow-md shadow-slate-600 bg-slate-50'>
          {data.label}
        </div>
      </div>
      <Handle type="source" style={handleStyle} position={Position.Right} id="a" /> 
    </>
  );
}