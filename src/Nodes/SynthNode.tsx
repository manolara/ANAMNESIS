/// react-flow node for synthesizer instrument
import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import { Synthesizer } from '../Instruments/Synthesizer';
import { DoodlerPage } from '../pages/DoodlerPage';
import { APalette } from '../theme';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const SynthNode = () => {
  const zoom = useStore(zoomSelector);
  console.log({ zoom });
  return (
    <>
      <Handle type="target" position={Position.Right} />
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

      <Synthesizer />

      <Handle type="source" position={Position.Left} id="a" />
    </>
  );
};