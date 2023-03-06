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
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowContext } from '../PLAYGROUND/FlowContext';
import { FXNode } from '../Nodes/FXNode';
import * as Tone from 'tone';
import { InstrumentNode } from '../Nodes/InstrumentNode';
import { InstrumentProps, SoundSourceProps } from '../types/componentProps';
import { v4 as uuidv4 } from 'uuid';
import { MasterNode } from '../Nodes/MasterNode';
import { Piano } from '@tonejs/piano';
import { SoundSourceNode } from '../Nodes/SoundSourceNode';
import { Synthesizer } from '../Instruments/Synthesizer';
import { initialNodes } from '../Nodes/defaultNodes';
import { Metronome } from './Metronome';
import { StopButton } from '../playbackCtrl/StopButton';
import { PlayButton } from '../playbackCtrl/PlayButton';
import { Divider, Stack } from '@mui/material';
import { useTheme } from '@emotion/react';
import { PauseButton } from '../playbackCtrl/PauseButton';

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

type soundEngine = Tone.PolySynth | Tone.MonoSynth | Piano;
export interface SoundSourceBase<L extends string, SE extends soundEngine> {
  label: L;
  component: ({ soundEngine, output }: SoundSourceProps<SE>) => JSX.Element;
  soundEngine: SE;
  output: Tone.Signal;
}
type MonoSynthNode = SoundSourceBase<'MonoSynth', Tone.MonoSynth>;
type PolySynthNode = SoundSourceBase<'PolySynth', Tone.PolySynth>;
type PianoNode = SoundSourceBase<'Piano', Piano>;
export type SoundSourceDataProps = MonoSynthNode | PolySynthNode | PianoNode;

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

const initialEdges: Edge[] = [];

export const Flow = () => {
  const theme = useTheme();
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
    (changes: EdgeChange[]) => {
      for (let change of changes) {
        if (change.type === 'remove') {
          // @ts-expect-error
          const edgeChanged = edges.find((edge) => edge.id === change.id);
          const edgeSourceNode = nodes.find(
            (node) => node.id === edgeChanged?.source
          );

          if (
            edgeSourceNode?.type === 'FX' ||
            edgeSourceNode?.type === 'soundSource'
          ) {
            edgeSourceNode.data.output.disconnect();
          } else if (edgeSourceNode?.type === 'instrument') {
            debugger;
            changeSoundSource(edgeSourceNode, undefined);
          }
        }

        setEdges((eds) => applyEdgeChanges(changes, eds));
      }
    },
    [setEdges, edges]
  );

  const nodeTypes = useMemo(
    () => ({
      instrument: InstrumentNode,
      FX: FXNode,
      soundSource: SoundSourceNode,
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

  const changeSoundSource = (
    nodeToChange: InstrumentNodeType,
    newSoundSource: Tone.PolySynth | undefined
  ) => {
    // @ts-ignore
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeToChange.id) {
          return {
            ...node,
            data: {
              ...node.data,
              soundSource: newSoundSource,
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
        changeSoundSource(
          sourceNode,
          targetNode.data.soundEngine as Tone.PolySynth
        );
      }
      if (sourceNode?.type === 'soundSource' && targetNode?.type === 'FX') {
        sourceNode.data.output.connect(targetNode.data.input);
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
        label: 'PolySynth',
        component: Synthesizer,
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
        <Panel position="top-left">
          <Metronome />
        </Panel>
        <Panel position="top-center">
          <Stack
            divider={<Divider orientation="vertical" flexItem />}
            p={0.5}
            border="1px "
            borderColor="#E0E0E0"
            borderRadius={1}
            direction="row"
            spacing={1}
          >
            <PlayButton />
            <PauseButton />
            <StopButton />
          </Stack>
        </Panel>
        <FlowContext addNode={addNode} open={openContext} />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
