import { Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { APalette } from '../theme';

import * as Tone from 'tone';
import { Knob } from './Knob';

const thresholdDefault = -24;
const ratioDefault = 4;

export const CompressorFX = new Tone.Compressor({
  threshold: thresholdDefault,
  ratio: ratioDefault,
  attack: 0.3,
  release: 0.1,
}).toDestination();

export const Compressor = () => {
  const theme = useTheme();

  const [threshold, setThreshold] = useState(thresholdDefault);
  const [ratio, setRatio] = useState(ratioDefault);
  CompressorFX.set({ threshold: threshold, ratio: ratio });
  console.log('wetness', CompressorFX.get().ratio);
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: APalette.orange, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Compressor
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            color={APalette.orange}
            title={'Threshold'}
            defaultValue={thresholdDefault}
            setParentValue={setThreshold}
            min={-60}
            max={-10}
          />
          <Knob
            color={APalette.orange}
            min={2}
            max={20}
            hasDecimals={false}
            title={'Ratio'}
            defaultValue={ratioDefault}
            setParentValue={setRatio}
          />
          <Knob
            color={APalette.orange}
            title={'Out'}
            isExp
            min={20}
            max={2000}
          />
        </Stack>
      </Stack>
    </>
  );
};
