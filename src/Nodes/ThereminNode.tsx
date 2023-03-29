import { Stack } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { Theremin } from '../Instruments/Theremin';
import { APalette } from '../theme';

const handleStyle = { left: 10 };

export function ThereminNode() {
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
      <Theremin />
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
}
