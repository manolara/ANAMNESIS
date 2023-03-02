import React from 'react';
import { useFX } from './useFX';
import * as Tone from 'tone';
import { Reverb } from '../FX/Reverb';
import { Lofi } from '../FX/Lofi';

export const UseReverbTests = () => {
  const reverb1 = useFX(Reverb);
  const reverb2 = useFX(Reverb);
  const lofi1 = useFX(Lofi);
  lofi1.output.toDestination();

  const synth1 = new Tone.Synth({ oscillator: { type: 'sine' } }).connect(
    reverb1.input
  );
  reverb1.output.toDestination();
  reverb2.output.toDestination();

  return (
    <>
      {/* button to trigger synth */}
      <button onClick={() => synth1.triggerAttackRelease('C4', '8n')} />

      <h1>useReverbTests</h1>
      {lofi1.component}
      {reverb1.component}
      {reverb2.component}
      <button
        onClick={() => {
          synth1.disconnect();
          synth1.connect(reverb2.input);
        }}
      />
    </>
  );
};
