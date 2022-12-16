import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { APalette } from '../theme';
import { Knob } from './Knob';
import { KnobSVG } from './KnobSVG';
import * as Tone from 'tone';

export const ReverbFX = new Tone.Reverb({ decay: 5, wet: 1 }).toDestination();

export const Reverb = () => {
  const theme = useTheme();
  const [decay, setDecay] = React.useState(5);
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
          <Knob defaultValue={decay} color={APalette.reverb} title={'Decay'} />
          <Knob color={APalette.reverb} title={'Mix'} />
          <Knob color={APalette.reverb} title={'HPF'} />
        </Stack>
      </Stack>
    </>
  );
};
