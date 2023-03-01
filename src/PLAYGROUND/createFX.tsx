import * as Tone from 'tone';
import { createElement, ReactElement, useEffect, useMemo } from 'react';
import { Reverb } from '../FX/Reverb';

interface createFXFn {
  component: ReactElement;
  input: Tone.Signal;
  output: Tone.Signal;
}

export const createFX = (
  effectComponent: React.FC<{ input: Tone.Signal; output: Tone.Signal }>
): createFXFn => {
  const FXInput = new Tone.Signal();
  const FXOutput = new Tone.Signal();

  const FXComponent = createElement(effectComponent, {
    input: FXInput,
    output: FXOutput,
  });

  return {
    component: FXComponent,
    input: FXInput,
    output: FXOutput,
  };
};
