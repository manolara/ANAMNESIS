import { Stack } from '@mui/material';
import { Piano } from '@tonejs/piano';
import { useEffect } from 'react';
import * as Tone from 'tone';

interface APianoProps {
  piano: Piano;
  output: Tone.Signal;
}
export const APiano = ({ piano, output }: APianoProps) => {
  useEffect(() => {
    piano.load().then(() => {
      piano.keyDown({ note: 'C4', time: '+1' });
      piano.keyDown({ note: 'E4', time: '+2' });
    });

    piano.toDestination();
  }, []);

  return (
    <>
      <Stack
        className="unselectable"
        sx={{
          backgroundColor: '#FEEDD5',
          width: 'fit-content',
          height: 'fit-content',
          p: 1,
          border: `3px solid #a8aeec`,
        }}
      >
        <img
          src="assets/piano-brown.svg"
          style={{ display: 'block', width: '100px', height: '100px' }}
        />
      </Stack>
    </>
  );
};
