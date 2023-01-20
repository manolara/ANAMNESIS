import ReactFlow, { Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';

// add component to the node
const nodes: Node[] = [
  {
    id: 'node1',
    data: {
      title: 'Node 1',
      description: 'This is the first node',
    },
    position: { x: 250, y: 5 },
    btn: <button>Click Me</button>,
  },
];

export const ReactFlowTester = () => {
  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={nodes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
