import { Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { APalette } from '../theme';

import * as Tone from 'tone';
import { Knob } from './Knob';

interface CompressorProps {
  input: Tone.ToneAudioNode;
  color: string;
}
const thresholdDefault = -24;
const ratioDefault = 4;

export const CompressorOut = new Tone.Signal();

const CompressorFX = new Tone.Compressor({
  threshold: thresholdDefault,
  ratio: ratioDefault,
  attack: 0.3,
  release: 0.1,
});

export const Compressor = ({ color, input }: CompressorProps) => {
  input.chain(CompressorFX, CompressorOut);

  const [threshold, setThreshold] = useState(thresholdDefault);
  const [ratio, setRatio] = useState(ratioDefault);
  CompressorFX.set({ threshold: threshold, ratio: ratio });
  console.log('wetness', CompressorFX.get().ratio);
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: color, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Compressor
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            title={'Threshold'}
            defaultValue={thresholdDefault}
            onValueChange={(value) => setThreshold(value)}
            min={-60}
            max={0}
          />
          <Knob
            min={2}
            max={20}
            hasDecimals={false}
            title={'Ratio'}
            defaultValue={ratioDefault}
            onValueChange={(value) => setRatio(value)}
          />
          <Knob title={'Out'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
