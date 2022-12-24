import { Button, Stack } from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import React, { useEffect, useRef, useState } from 'react';
import { connect, gainToDb, ToneOscillatorType } from 'tone';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';

interface SynthesizerProps {}
type OmitMonophonicOptions<T> = Omit<T, 'context' | 'onsilence'>;

const defaultSynthOptions: RecursivePartial<
  OmitMonophonicOptions<Tone.MonoSynthOptions>
> = {
  oscillator: {
    type: 'square',
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.7,
    baseFrequency: 300,
    octaves: 4,
    sustain: 0.1,
  },
};

export const Synthesizer = () => {
  const outLevelRef = useRef(new Tone.Gain().toDestination());
  const polyRef = useRef(
    new Tone.PolySynth(Tone.MonoSynth, defaultSynthOptions)
  );

  const [level, setLevel] = useState(50);
  const [oscType, setOscType] = useState<NonCustomOscillatorType>('sine');
  const outLevel = outLevelRef.current;
  const poly = polyRef.current;
  poly.connect(outLevel);
  outLevel.set({ gain: level / 100 });

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
          <Knob title="Level" setParentValue={setLevel} />
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
