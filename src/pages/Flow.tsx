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
  useNodes,
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
import { v4 as uuidv4 } from 'uuid';
import { MasterNode } from '../Nodes/MasterNode';
import { Reverb } from '../FX/Reverb';

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

interface MasterNodeDataProps {
  input: Tone.Signal;
}

type InstrumentNodeType = Node<InstrumentDataProps, 'instrument'>;
type FXNodeType = Node<FXDataProps, 'FX'>;
type SoundSourceNodeType = Node<SoundSourceDataProps, 'soundSource'>;
type MasterNodeType = Node<MasterNodeDataProps, 'master'>;
export type ANode =
  | InstrumentNodeType
  | FXNodeType
  | SoundSourceNodeType
  | MasterNodeType;

const initialNodes: ANode[] = [
  {
    id: uuidv4(),
    type: 'instrument',
    data: {
      label: 'Doodler',
      component: DoodlerPage,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 2000, y: 5 },
  },
  {
    id: uuidv4(),
    type: 'instrument',
    data: {
      label: 'Theremin',
      component: Theremin,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 1000, y: 1000 },
  },
  {
    id: uuidv4(),
    type: 'FX',
    data: {
      label: 'Reverb',
      input: new Tone.Signal(),
      output: new Tone.Signal(),
      component: Reverb,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 650, y: 250 },
  },
  {
    id: uuidv4(),
    type: 'master',
    data: {
      input: new Tone.Signal(),
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 1000, y: 200 },
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
      master: MasterNode,
    }),
    []
  );
  const changeInput = (nodeToChange: ANode, newInput: Tone.Signal) => {
    if (nodeToChange.type !== 'FX' && nodeToChange.type !== 'master') return;
    // @ts-ignore
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeToChange.id) {
          return {
            ...node,
            data: {
              ...node.data,
              input: newInput,
            },
          };
        }
        return node;
      })
    );
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (
        sourceNode?.type === 'instrument' &&
        targetNode?.type === 'soundSource'
      ) {
        // @ts-ignore
        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === sourceNode.id) {
              debugger;
              return {
                ...node,
                data: {
                  ...node.data,
                  soundSource: targetNode.data.soundEngine,
                },
              };
            }
            return node;
          })
        );
      }
      if (sourceNode?.type === 'soundSource' && targetNode?.type === 'FX') {
        changeInput(targetNode, sourceNode.data.output);
      }
      if (sourceNode?.type === 'FX' && targetNode?.type === 'FX') {
        sourceNode.data.output.connect(targetNode.data.input);
      }
      if (sourceNode?.type === 'FX' && targetNode?.type === 'master') {
        sourceNode.data.output.connect(targetNode.data.input);
      }
      if (sourceNode?.type === 'soundSource' && targetNode?.type === 'master') {
        sourceNode.data.output.connect(targetNode.data.input);
      }
    },

    [setEdges, setNodes, nodes]
  );
  useEffect(() => {
    addNode({
      id: uuidv4(),
      type: 'soundSource',
      data: {
        label: 'synth',
        soundEngine: new Tone.PolySynth(),
        output: new Tone.Signal(),
      },
      dragHandle: '.custom-drag-handle',
      position: { x: 200, y: 200 },
    });
  }, []);

  console.log('nodes', nodes);

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
