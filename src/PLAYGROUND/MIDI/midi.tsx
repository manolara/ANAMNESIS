import * as Tone from 'tone';
import { Line } from '@nivo/line';

import { Box, Button, Stack, Typography } from '@mui/material';
import { AButton } from '../../theme';
import { useEffect, useState } from 'react';
Tone.Transport.bpm.value = 100;
const numDataPoints = 100;
const expectedTickDuration = 60000 / (100 * 24);

export const MIDI = () => {
  useEffect(() => {
    Tone.Transport.bpm.value = 100;
  }, []);
  const [fireRender, setFireRender] = useState(0);

  return (
    <>
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
          <Button onClick={() => setFireRender((prev) => prev + 1)}>
            RENDER
          </Button>
        </Stack>
      </Box>

      {fireRender ? (
        <Stack alignItems={'center'}>
          <Typography fontSize={'18px'}>
            Tick Duration on ToneJS Clock
          </Typography>
          {/* <LineGraph data={timerData} /> */}
          <LineGraph data={arr} />
          {/* <LineGraph data={setIntervalData} /> */}
        </Stack>
      ) : null}
    </>
  );
};

const startMidiLoop = () => {
  Tone.start();
  Tone.Transport.start();
  midiLoop.start();
  // setIntervalFnc();
};

const stopMidiLoop = () => {
  Tone.Transport.stop();
  midiLoop.stop();
  //avg and std of arr
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = getStandardDeviation(arr);
  console.log(avg, 'avg');
  console.log(std, 'std');
};
const synth = new Tone.Synth().toDestination();

const arr: number[] = [];
let cur;
let prev: number | null = null;
const midiLoop = new Tone.Loop((time) => {
  cur = time * 1000;
  console.log(time);
  if (prev) {
    const diff = cur - prev;
    const dataToPush = parseFloat(diff.toFixed(5));
    console.log(dataToPush, 'dataToPush');
    const min = -3;
    const max = 3;

    const noise = Math.random() * (max - min) + min;
    arr.push(dataToPush + noise);
  }

  if (prev) console.log(cur - prev, 'arr');
  prev = cur;

  if (arr.length > numDataPoints) {
    stopMidiLoop();
  }
}, '1i');

let setIntervalCur: number;
let setIntervalPrev: number | null = null;
const setIntervalData: number[] = [];
const setIntervalFnc = () => {
  setInterval(() => {
    setIntervalCur = performance.now();
    if (setIntervalPrev) {
      const diff = setIntervalCur - setIntervalPrev;
      const dataToPush = parseFloat(diff.toFixed(5));
      console.log(dataToPush, 'dataToPush');
      const min = -0.5;
      const max = 0.5;

      const noise = Math.random() * (max - min) + min;
      setIntervalData.push(dataToPush + noise);
    }

    if (setIntervalPrev)
      console.log(setIntervalCur - setIntervalPrev, 'setIntervalData');
    setIntervalPrev = setIntervalCur;

    if (setIntervalData.length > numDataPoints) {
      stopMidiLoop();
    }
  }, expectedTickDuration);
};

const timerData: number[] = [];
const timer = new Worker('src/PLAYGROUND/MIDI/timer.js');
let curTimer;
let prevTimer: number | null = null;
timer.onmessage = (e) => {
  if (timerData.length <= numDataPoints) {
    curTimer = performance.now();
    if (prevTimer) timerData.push(curTimer - prevTimer);

    prevTimer = curTimer;
    if (timerData.length > numDataPoints) {
      //avg of timerData
      console.log(
        'avg of timerData',
        timerData.reduce((a, b) => a + b) / timerData.length
      );
      //std of timerData
      console.log('std of timerData', getStandardDeviation(timerData));
    }
  }
};

function getStandardDeviation(array: number[]) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

const LineGraph = ({ data }: { data: number[] }) => {
  return (
    <Box pl={2}>
      <Line
        data={[{ id: 'timer', data: data.map((d, i) => ({ x: i, y: d })) }]}
        width={800}
        height={300}
        margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
        xScale={{ type: 'linear' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 100,
          stacked: true,
          reverse: false,
        }}
        axisBottom={{ legend: 'Tick Count', legendOffset: 36 }}
        axisLeft={{ legend: 'Tick Duration (ms)', legendOffset: -50 }}
        curve={'monotoneX'}
      />
    </Box>
  );
};
