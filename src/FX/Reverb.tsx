import { Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';

import * as Tone from 'tone';
import { APalette } from '../theme';
import { Knob } from './Knob';

interface ReverbProps {
  reverbEngine: Tone.Reverb;
  reverbOutput: Tone.Signal;
}

export const Reverb = ({ reverbEngine, reverbOutput }: ReverbProps) => {
  const decayDefault = 0.2;
  const mixDefault = 50;
  const [mix, setMix] = useState(mixDefault);
  const [decay, setDecay] = useState(decayDefault);
  reverbEngine.set({ decay: decay, wet: mix / 100 });
  reverbEngine.connect(reverbOutput);

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
            onValueChange={(value) => setDecay(value)}
          />
          <Knob
            title={'Mix'}
            isExp={false}
            defaultValue={mixDefault}
            onValueChange={(value) => setMix(value)}
          />
          <Knob title={'HPF'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
