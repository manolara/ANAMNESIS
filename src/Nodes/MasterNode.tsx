import { Stack, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { AButton } from '../theme';
import { DragHandle } from './DragHandle';
import * as Tone from 'tone';
import { useEffect, useLayoutEffect, useState } from 'react';

export const MasterNode = ({ data }: any) => {
  useEffect(() => {
    const mixer = new Tone.Channel();
    data?.input?.toDestination();
    return () => {
      mixer.dispose();
    };
  }, []);
  let center = 115;
  const offset = 20;
  const [numHandles, setNumHandles] = useState(1);
  const [handlePositions, setHandlePosition] = useState([center]);
  useLayoutEffect(() => {
    //make sure the handles are centered around the center, if there are an odd number of handles then the center handle will be the one that is centered, if there are an even number of handles then the center will be between the two center handles
    let firstHandle;
    if (numHandles % 2 === 0) {
      center = center - offset / 2;
      firstHandle = center - (numHandles / 2 - 1) * offset;
    } else {
      firstHandle = center - Math.floor(numHandles / 2) * offset;
    }
    const newPositions = [];
    for (let i = 0; i < numHandles; i++) {
      newPositions.push(firstHandle + i * offset);
    }
    setHandlePosition(newPositions);
  }, [numHandles]);
  const handleComponents = handlePositions.map((position, i) => {
    return (
      <Handle
        key={i}
        type="target"
        position={Position.Left}
        style={{ top: position }}
      />
    );
  });

  const addHandle = () => {
    numHandles < 5
      ? setNumHandles((prev) => prev + 1)
      : alert('Master Inputs Cannot Exceed 5');
  };

  const removeHandle = () => {
    numHandles > 1
      ? setNumHandles((prev) => prev - 1)
      : alert('Master Should Have at Least 1 Input Track');
  };

  const addRemoveButtons = () => {
    if (numHandles === 1 || numHandles === 5) {
      return (
        <AButton
          sx={{
            fontSize: '15px',
            height: '20px',
            width: '100%',
            position: 'absolute',
            bottom: '0',
            borderRadius: '0',
          }}
          onClick={numHandles === 1 ? addHandle : removeHandle}
        >
          {numHandles === 1 ? '+' : '-'}
        </AButton>
      );
    } else {
      return (
        <Stack direction="row" position="absolute" bottom="0">
          <AButton
            sx={{
              fontSize: '15px',
              height: '20px',
              width: '35px',
              bottom: '0',
              borderRadius: '0',
              borderRight: '0.5px  solid',
            }}
            onClick={addHandle}
          >
            +
          </AButton>
          <AButton
            sx={{
              bottom: '0',
              fontSize: '15px',
              height: '20px',
              width: '35px',
              borderRadius: '0',
            }}
            onClick={removeHandle}
          >
            -
          </AButton>
        </Stack>
      );
    }
  };

  return (
    <>
      {handleComponents}
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
        {addRemoveButtons()}
      </Stack>
    </>
  );
};
