import { Button, Stack } from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import React, { useState } from 'react';
import { connect } from 'tone';

export const Synthesizer = () => {
  const [level, setLevel] = useState(1);
  const outLevel = new Tone.Gain(level).toDestination();
  const poly = new Tone.PolySynth({
    volume: -10,
  }).connect(outLevel);

  return (
    <>
      <AButton onClick={() => poly.triggerAttackRelease('C4', '8n')}></AButton>
      <Stack
        sx={{
          backgroundColor: APalette.beige,
          width: 'fit-content',
          p: 1,
        }}
      >
        <Stack spacing={3} direction="row">
          <Knob title="LFO" />
          <Knob title="HPF" />
          <Knob title="Cut-off" />
          <Knob title="Level" />
        </Stack>
        <Stack spacing={3} direction="row">
          <Knob title="Attack" />
          <Knob title="Decay" />
          <Knob title="Sustain" />
          <Knob title="Release" />
        </Stack>
      </Stack>
    </>
  );
};
