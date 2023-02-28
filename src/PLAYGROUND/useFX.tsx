import * as Tone from 'tone';
import { createElement, ReactElement, useEffect, useMemo } from 'react';
import { Reverb } from '../FX/Reverb';

interface ReverbHook {
  component: ReactElement;
  input: Tone.Signal;
  output: Tone.Signal;
}

export const useFX = (
  FXComponent: React.FC<{ input: Tone.Signal; output: Tone.Signal }>
): ReverbHook => {
  const FXInput = useMemo(() => new Tone.Signal(), []);
  const FXOutput = useMemo(() => new Tone.Signal(), []);

  const reverbComponent = createElement(FXComponent, {
    input: FXInput,
    output: FXOutput,
  });

  useEffect(() => {
    return () => {
      FXInput.dispose();
      FXOutput.dispose();
    };
  }, [FXInput, FXOutput]);
  return {
    component: reverbComponent,
    input: FXInput,
    output: FXOutput,
  };
};
