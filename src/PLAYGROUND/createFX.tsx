import * as Tone from 'tone';
import { createElement, ReactElement, useEffect, useMemo } from 'react';
import { Reverb } from '../FX/Reverb';

interface createFXFn {
  component: ReactElement;
  input: Tone.Signal;
  output: Tone.Signal;
}

export const createFX = (
  FXComponent: React.FC<{ input: Tone.Signal; output: Tone.Signal }>
): createFXFn => {
  const FXInput = new Tone.Signal();
  const FXOutput = new Tone.Signal();

  const reverbComponent = createElement(FXComponent, {
    input: FXInput,
    output: FXOutput,
  });

  return {
    component: reverbComponent,
    input: FXInput,
    output: FXOutput,
  };
};
