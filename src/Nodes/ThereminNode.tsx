import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import { Theremin } from '../Instruments/Theremin';
import { DoodlerPage } from '../pages/DoodlerPage';
import { APalette } from '../theme';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export function ThereminNode() {
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

      <Theremin zoomFactor={zoom} />

      <Handle type="source" position={Position.Left} id="a" />
    </>
  );
}
