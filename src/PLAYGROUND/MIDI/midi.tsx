import * as Tone from 'tone';

import { Box, Stack, Typography } from '@mui/material';
import { AButton } from '../../theme';
import { useEffect } from 'react';

export const MIDI = () => {
  useEffect(() => {
    Tone.Transport.bpm.value = 90;
  }, []);

  return (
    <Box width={100}>
      <Stack
        height={100}
        sx={{
          backgroundColor: '#b4ddff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography>MIDI</Typography>
      </Stack>
      <Stack
        maxWidth={'100'}
        direction={'row'}
        justifyContent={'space-between'}
      >
        <AButton
          onClick={startMidiLoop}
          sx={{ maxWidth: '50px', fontSize: '13px' }}
        >
          START
        </AButton>
        <AButton
          onClick={stopMidiLoop}
          sx={{ width: '50px', fontSize: '13px' }}
        >
          STOP
        </AButton>
      </Stack>
    </Box>
  );
};

const startMidiLoop = () => {
  Tone.start();
  Tone.Transport.start();
  midiLoop.start();
};

const stopMidiLoop = () => {
  Tone.Transport.stop();
  midiLoop.stop();
  //mean of arr
  console.log(arr.reduce((a, b) => a + b, 0) / arr.length);
  //std of arr
  console.log(getStandardDeviation(arr));
};
const synth = new Tone.Synth().toDestination();

const arr: number[] = [];
let cur;
let prev: number | null = null;
const midiLoop = new Tone.Loop((time) => {
  cur = time;
  if (prev) arr.push(cur - prev);

  if (prev) console.log(cur - prev);
  prev = cur;
}, '1i');

// const timer = new Worker('src/PLAYGROUND/MIDI/timer.js');
// timer.onmessage = (e) => {
//   console.log(performance.now());
// };

function getStandardDeviation(array: number[]) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}
