import { Stack, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { AButton } from '../theme';
import { DragHandle } from './DragHandle';
import * as Tone from 'tone';

export const MasterNode = ({ data }: any) => {
  const mixer = new Tone.Channel();
  data?.input?.toDestination();

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
        {/* Button to add new handle */}
        <AButton
          sx={{
            fontSize: '15px',
            height: '20px',
            width: '100%',
            position: 'absolute',
            bottom: '0',
            borderRadius: '0',
          }}
          onClick={() => console.log('add handle')}
        >
          +
        </AButton>
      </Stack>
    </>
  );
};
