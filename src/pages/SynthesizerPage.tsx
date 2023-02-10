import React from 'react';
import { Synthesizer } from '../Instruments/Synthesizer';
import * as Tone from 'tone';

export const SynthesizerPage = () => {
  return (
    <>
      <Synthesizer synth={new Tone.PolySynth()} />
      <Synthesizer synth={new Tone.PolySynth()} />
    </>
  );
};
