/// react-flow node for synthesizer instrument
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import * as Tone from 'tone';
import { Synthesizer } from '../Instruments/Synthesizer';
import { APalette } from '../theme';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const SynthNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);
  console.log({ zoom });
  const synth = useMemo(() => new Tone.PolySynth(), []);
  console.log(data.soundEngine);

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <Stack
        height={18}
        width={18}
        className="custom-drag-handle"
        bgcolor={APalette.beige}
        borderRadius="100%"
        style={{
          transform: ' translate(-100%, 0)',
        }}
      ></Stack>

      <Synthesizer synth={data.soundEngine ?? synth} output={data.output} />

      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
