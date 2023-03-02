import { useMemo } from 'react';
import * as Tone from 'tone';
import { Lofi } from '../FX/Lofi';
import { Reverb } from '../FX/Reverb';
import { AButton } from '../theme';
export const PGFXChainTest = () => {
  const lofiInput = useMemo(() => new Tone.Signal(), []);
  const lofiOutput = useMemo(() => new Tone.Signal().toDestination(), []);
  const reverbInput = useMemo(() => new Tone.Signal(), []);
  const reverbOutput = useMemo(() => new Tone.Signal().connect(lofiInput), []);
  const synth1 = useMemo(() => new Tone.Synth().connect(reverbInput), []);
  const synth2 = useMemo(
    () => new Tone.Synth({ oscillator: { type: 'sine' } }),
    []
  );

  return (
    <>
      <AButton onClick={() => synth1.triggerAttackRelease('C4', '8n')} />
      <AButton onClick={() => synth2.triggerAttackRelease('C4', '8n')} />
      <Reverb input={reverbInput} output={reverbOutput} />
      <Lofi input={lofiInput} output={lofiOutput} />
      {/* Button to switch the reverb synth input */}
      <AButton
        onClick={() => {
          synth1.disconnect().toDestination();
          synth2.connect(reverbInput);
        }}
      />
    </>
  );
};
