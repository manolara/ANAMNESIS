import { Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { APalette } from '../theme';

import * as Tone from 'tone';
import { Knob } from './Knob';
import { FXProps } from '../types/componentProps';

const thresholdDefault = -24;
const ratioDefault = 4;

export const Compressor = ({ input, output }: FXProps) => {
  const CompressorFX = useMemo(
    () =>
      new Tone.Compressor({
        threshold: thresholdDefault,
        ratio: ratioDefault,
        attack: 0.3,
        release: 0.1,
      }),
    []
  );
  useEffect(() => {
    input.chain(CompressorFX, output);

    return () => {
      input.dispose();
      output.dispose();
      CompressorFX.disconnect(output);
      CompressorFX.dispose();
    };
  }, []);

  CompressorFX.set({ threshold: thresholdDefault, ratio: ratioDefault });
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
            title={'Threshold'}
            defaultValue={thresholdDefault}
            onValueChange={(value) => CompressorFX.set({ threshold: value })}
            min={-60}
            max={0}
          />
          <Knob
            min={2}
            max={20}
            hasDecimals={false}
            title={'Ratio'}
            defaultValue={ratioDefault}
            onValueChange={(value) => CompressorFX.set({ ratio: value })}
          />
          <Knob title={'Out'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
