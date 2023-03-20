/// react-flow node for synthesizer instrument
import { useMemo } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import * as Tone from 'tone';
import { Synthesizer } from '../Instruments/Synthesizer';
import { DragHandle } from './DragHandle';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const SynthNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);

  const synth = useMemo(() => new Tone.PolySynth(), []);

  return (
    <>
      <Handle type="target" position={Position.Left} id="a" />
      <DragHandle />
      <Synthesizer
        soundEngine={data.soundEngine ?? synth}
        output={data.output}
      />
      <Handle type="source" position={Position.Right} />
    </>
  );
};
