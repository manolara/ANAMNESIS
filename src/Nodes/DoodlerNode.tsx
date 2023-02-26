import { Stack } from '@mui/material';
import { Handle, Position, useStore } from 'reactflow';

import { DoodlerPage } from '../pages/DoodlerPage';
import { APalette } from '../theme';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const DoodlerNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);
  console.log({ zoom });
  console.log({ data });

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

      <DoodlerPage soundSource={data.soundSource} zoomFactor={zoom} />
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
