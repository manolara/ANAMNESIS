import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  addEdge,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowContext } from '../PLAYGROUND/FlowContext';
import { FXNode } from '../Nodes/FXNode';
import * as Tone from 'tone';
import { InstrumentNode } from '../Nodes/InstrumentNode';
import { DoodlerPage } from './DoodlerPage';
import { SynthNode } from '../Nodes/SynthNode';
import { Theremin } from '../Instruments/Theremin';
import { InstrumentProps } from '../types/componentProps';

// Define custom type strings for your custom nodes

export interface InstrumentDataProps {
  label: 'Doodler' | 'Theremin';
  component: ({ soundSource }: InstrumentProps) => JSX.Element;
  soundSource?: Tone.PolySynth | undefined;
}
export interface FXDataProps {
  label: string;
  input: Tone.Signal;
  output: Tone.Signal;
  component: ({
    input,
    output,
  }: {
    input: Tone.Signal;
    output: Tone.Signal;
  }) => JSX.Element;
}

export interface SoundSourceDataProps {
  label: string;
  soundEngine: Tone.MonoSynth | Tone.PolySynth | undefined;
  output: Tone.Signal;
}

type InstrumentNodeType = Node<InstrumentDataProps, 'instrument'>;
type FXNodeType = Node<FXDataProps, 'FX'>;
type SoundSourceNodeType = Node<SoundSourceDataProps, 'soundSource'>;
export type ANode = InstrumentNodeType | FXNodeType | SoundSourceNodeType;

const initialNodes: ANode[] = [
  {
    id: '1',
    type: 'instrument',
    data: {
      label: 'Doodler',
      component: DoodlerPage,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 500, y: 5 },
  },
  {
    id: '2',
    type: 'instrument',
    data: {
      label: 'Theremin',
      component: Theremin,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 500, y: 400 },
  },
];
const initialEdges: Edge[] = [];

export const Flow = () => {
  const addNode = (node: ANode) => {
    setNodes((nodes) => [...nodes, node]);
  };

  const [nodes, setNodes] = useState<ANode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [openContext, setOpenContext] = useState(false);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      //@ts-ignore
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
      instrument: InstrumentNode,
      FX: FXNode,
      soundSource: SynthNode,
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
      type: 'soundSource',
      data: {
        label: 'synth',
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
