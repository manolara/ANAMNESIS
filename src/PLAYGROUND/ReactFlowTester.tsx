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
  useEdges,
  useNodes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThereminNode } from '../Nodes/ThereminNode';
import { DoodlerPage } from '../pages/DoodlerPage';
import { DoodlerNode } from '../Nodes/DoodlerNode';
import { TextUpdaterNode } from './TextUpdaterNode';
import { ContextMenu, IconMenuItem } from 'mui-nested-menu';
import { Divider } from '@mui/material';
import { SynthNode } from '../Nodes/SynthNode';
import * as Tone from 'tone';
// add component to the node

interface ANode extends Node {
  audioNodeType?: 'instrument' | 'soundSource' | 'FX';
}
const synth1 = new Tone.PolySynth();
const initialNodes: ANode[] = [
  {
    id: '1',
    data: {
      label: 'Node 1',
    },
    position: { x: 250, y: 5 },
  },
  // {
  //   id: '2',
  //   type: 'synth',
  //   data: {
  //     label: 'Node 1',
  //     soundEngine: synth1,
  //   },
  //   dragHandle: '.custom-drag-handle',
  //   position: { x: 5, y: 5 },
  // },
  {
    id: '3',
    type: 'doodler',
    data: {
      label: 'Node 1',
      soundSource: undefined,
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
    position: { x: 1000, y: 200 },
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
      synth: SynthNode,
    }),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));

      const sourceEngine = nodes.find((node) => node.id === connection.source)
        ?.data.soundEngine;

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === connection.target) {
            return {
              ...node,
              data: {
                ...node.data,
                soundSource: sourceEngine,
              },
            };
          }
          return node;
        })
      );
    },
    [setEdges]
  );
  console.log(useNodes());

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onPaneContextMenu={(e) => e.preventDefault()}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
