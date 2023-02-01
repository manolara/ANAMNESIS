import { useCallback, useMemo } from 'react';
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
import { DoodlerNode } from './DoodlerNode';
import { TextUpdaterNode } from './TextUpdaterNode';

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
];
const initialEdges: Edge[] = [];

export const ReactFlowTester = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(
    () => ({
      textUpdater: TextUpdaterNode,
      doodler: DoodlerNode,
      theremin: ThereminNode,
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
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
