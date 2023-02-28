import { Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import * as Tone from 'tone';
import { APalette } from '../theme';
import { Knob } from './Knob';

interface ReverbProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

export const Reverb = ({ input, output }: ReverbProps) => {
  const decayDefault = 0.2;
  const mixDefault = 50;
  const reverbEngine = useMemo(
    () => new Tone.Reverb({ decay: decayDefault, wet: mixDefault / 100 }),
    []
  );
  console.log('rerendering reverb');

  useEffect(() => {
    input.chain(reverbEngine, output);
    return () => {
      input.disconnect(reverbEngine);
      reverbEngine.disconnect(output);
      reverbEngine.dispose();
      input.dispose();
      output.dispose();
    };
  }, []);

  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: APalette.reverb, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Reverb
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            min={0.2}
            max={60}
            title={'Decay'}
            isExp={true}
            hasDecimals={true}
            defaultValue={decayDefault}
            onValueChange={(value) => reverbEngine.set({ decay: value })}
          />
          <Knob
            title={'Mix'}
            isExp={false}
            defaultValue={mixDefault}
            onValueChange={(value) => reverbEngine.set({ wet: value / 100 })}
          />
          <Knob title={'HPF'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
