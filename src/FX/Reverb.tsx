import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import * as Tone from 'tone';
import { Knob } from './Knob';

interface ReverbProps {
  color: string;
  input: Tone.ToneAudioNode;
  // output: Tone.OutputNode;
}

export const ReverbOut = new Tone.Signal();
const ReverbFX = new Tone.Reverb();

export const Reverb = ({ color, input }: ReverbProps) => {
  input.chain(ReverbFX, ReverbOut);
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
        sx={{ p: 1, backgroundColor: color, minWidth: 'fit-content' }}
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
