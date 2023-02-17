import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  addEdge,
  useStore,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThereminNode } from '../Nodes/ThereminNode';
import { DoodlerPage } from '../pages/DoodlerPage';
import { DoodlerNode } from '../Nodes/DoodlerNode';
import { TextUpdaterNode } from '../PLAYGROUND/TextUpdaterNode';
import { SynthNode } from '../Nodes/SynthNode';
import { FlowContext } from '../PLAYGROUND/FlowContext';

// add component to the node

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'Node 1',
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'textUpdater',
    data: {
      label: 'Node 1',
    },
    position: { x: 500, y: 5 },
  },
  {
    id: '3',
    type: 'doodler',
    data: {
      label: 'Node 1',
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 500, y: 5 },
  },
  {
    id: '4',
    type: 'theremin',
    data: {
      label: 'Node 1',
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 500, y: 200 },
  },
  {
    id: '4',
    type: 'synth',
    data: {
      label: 'Node 1',
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 600, y: 200 },
  },
];
const initialEdges: Edge[] = [];

export const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [openContext, setOpenContext] = useState(false);
  const nodeTypes = useMemo(
    () => ({
      textUpdater: TextUpdaterNode,
      doodler: DoodlerNode,
      theremin: ThereminNode,
      synth: SynthNode,
    }),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onPaneContextMenu={(event) => {
          event.preventDefault();
          setOpenContext(true);
        }}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <FlowContext open={openContext} />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
