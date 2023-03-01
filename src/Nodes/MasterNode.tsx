import { Stack, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { DragHandle } from './DragHandle';

export const MasterNode = ({ data }: any) => {
  data?.input?.toDestination();
  console.log(data.input);
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <DragHandle />
      <Stack width={'70px'} height={'200px'} bgcolor={'#D3A9C9'}>
        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            writingMode: 'vertical-rl',
            textAlign: 'center',
            mt: 'auto',
            mb: 'auto',
            textOrientation: 'upright',
          }}
        >
          MASTER
        </Typography>
      </Stack>
    </>
  );
};
