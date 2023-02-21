import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import * as Tone from 'tone';
import { APalette } from '../theme';
import { Knob } from './Knob';

interface CompressorProps {
  input: Tone.ToneAudioNode;
}

export const EQOut = new Tone.Signal();

const EQ = new Tone.EQ3({
  low: 0,
  mid: 0,
  high: 0,
  lowFrequency: 400,
  highFrequency: 2000,
});

export const EQ3 = ({ input }: CompressorProps) => {
  input.chain(EQ, EQOut);

  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: APalette.pink, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Compressor
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            title={'Low'}
            defaultValue={0}
            onValueChange={(value) => {
              EQ.set({ low: value });
              console.log(EQ.get());
            }}
            min={-60}
            max={6}
          />
          <Knob
            min={-60}
            max={6}
            hasDecimals={false}
            title={'Mid'}
            defaultValue={0}
            onValueChange={(value) => EQ.set({ mid: value })}
          />
          <Knob
            min={-60}
            max={6}
            hasDecimals={false}
            title={'High'}
            defaultValue={0}
            onValueChange={(value) => EQ.set({ high: value })}
          />
        </Stack>
      </Stack>
    </>
  );
};
