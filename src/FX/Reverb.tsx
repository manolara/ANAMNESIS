import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { APalette } from '../theme';

import { KnobSVG } from './KnobSVG';
import * as Tone from 'tone';
import { KnobTest } from './KnobTest';
import { Knob } from './Knob';
import { DelayFX } from './Delay';

export const ReverbFX = new Tone.Reverb().connect(DelayFX);

export const Reverb = () => {
  const theme = useTheme();
  const decayDefault = 0.2;
  const mixDefault = 50;
  const [mix, setMix] = React.useState(mixDefault);
  const [decay, setDecay] = React.useState(decayDefault);
  ReverbFX.set({ decay: decay, wet: mix / 100 });
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: '#b8b9ff', minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Reverb
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            min={0.2}
            max={60}
            color={APalette.reverb}
            title={'Decay'}
            isExp={true}
            hasDecimals={true}
            defaultValue={decayDefault}
            setParentValue={setDecay}
          />
          <Knob
            color={APalette.reverb}
            title={'Mix'}
            isExp={false}
            defaultValue={mixDefault}
            setParentValue={setMix}
          />
          <Knob
            color={APalette.reverb}
            title={'HPF'}
            isExp
            min={20}
            max={2000}
          />
        </Stack>
      </Stack>
    </>
  );
};
