import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  addEdge,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThereminNode } from '../Nodes/ThereminNode';
import { DoodlerNode } from '../Nodes/DoodlerNode';
import { TextUpdaterNode } from '../PLAYGROUND/TextUpdaterNode';
import { SynthNode } from '../Nodes/SynthNode';
import { FlowContext } from '../PLAYGROUND/FlowContext';
import { FXNode } from '../Nodes/FXNode';
import * as Tone from 'tone';

// Define custom type strings for your custom nodes

interface InstrumentData {
  label: string;
  soundSource?: Tone.PolySynth | undefined;
}
interface FXData {
  label: string;
  input: Tone.Signal;
  output: Tone.Signal;
  component: ReactElement;
}

interface SoundSourceData {
  label: string;
  soundEngine: Tone.MonoSynth | Tone.PolySynth;
}

type InstrumentNode = Node<InstrumentData>;
type FXNode = Node<FXData>;
type SoundSourceNode = Node<SoundSourceData>;
type ANode = InstrumentNode | FXNode | SoundSourceNode;

const initialNodes: ANode[] = [
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
  // {
  //   id: '4',
  //   type: 'theremin',
  //   data: {
  //     label: 'Node 1',
  //   },
  //   dragHandle: '.custom-drag-handle',
  //   position: { x: 500, y: 200 },
  // },
  // {
  //   id: '4',
  //   type: 'synth',
  //   data: {
  //     label: 'Node 1',
  //   },
  //   dragHandle: '.custom-drag-handle',
  //   position: { x: 600, y: 200 },
  // },
];
const initialEdges: Edge[] = [];

export const Flow = () => {
  const addNode = (node: InstrumentNode | FXNode | SoundSourceNode) => {
    setNodes((nodes) => [...nodes, node]);
  };

  const [nodes, setNodes] = useState<ANode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [openContext, setOpenContext] = useState(false);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      textUpdater: TextUpdaterNode,
      doodler: DoodlerNode,
      theremin: ThereminNode,
      synth: SynthNode,
      FX: FXNode,
    }),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  useEffect(() => {
    addNode({
      id: '1000',
      type: 'synth',
      data: {
        label: 'Node 1',
        soundEngine: new Tone.PolySynth(),
        output: new Tone.Signal().toDestination(),
      },
      dragHandle: '.custom-drag-handle',
      position: { x: 600, y: 200 },
    });
  }, []);

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
        onContextMenu={(e) => {
          e.preventDefault();
          console.log('context menu', e);
        }}
      >
        <FlowContext addNode={addNode} open={openContext} />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
