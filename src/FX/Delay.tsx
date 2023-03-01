import { Stack, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APalette } from '../theme';

import * as Tone from 'tone';
import { Knob } from './Knob';
import { FXProps } from '../types/componentProps';

export const Delay = ({ input, output }: FXProps) => {
  const DelayFX = useMemo(() => new Tone.FeedbackDelay(), []);
  const feedbackDefault = 20;
  const mixDefault = 50;

  useEffect(() => {
    input.chain(DelayFX, output);
    return () => {
      input.dispose();
      output.dispose();
      DelayFX.disconnect(output);
      DelayFX.dispose();
    };
  }, []);

  DelayFX.set({ feedback: feedbackDefault / 100, wet: mixDefault / 100 });
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: APalette.delay, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Delay
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            title={'Feedback'}
            defaultValue={feedbackDefault}
            onValueChange={(value) => DelayFX.set({ feedback: value / 100 })}
          />
          <Knob
            title={'Mix'}
            isExp={false}
            defaultValue={mixDefault}
            onValueChange={(value) => DelayFX.set({ wet: value / 100 })}
          />
          <Knob title={'Filter'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
