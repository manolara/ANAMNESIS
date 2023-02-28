import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import * as Tone from 'tone';
import { APalette } from '../theme';
import { Knob } from './Knob';

interface LofiProps {
  input: Tone.Signal;
  output: Tone.Signal;
}
const noiseLevelDefault = 0;
const wowDepthDefault = 0;
const brokenDefault = 16;

export const Lofi = ({ input, output }: LofiProps) => {
  const BitCrushFX = useMemo(
    () => new Tone.BitCrusher({ bits: brokenDefault }),
    []
  );

  const LofiFX = useMemo(
    () =>
      new Tone.Vibrato({
        frequency: 1.6,
        depth: wowDepthDefault / 100,
        type: 'triangle',
      }),
    []
  );

  const NoiseOut = useMemo(
    () => new Tone.Gain(noiseLevelDefault).connect(LofiFX),
    []
  );
  const Noise = useMemo(
    () =>
      new Tone.Player({
        url: 'assets/Tape_Noise_05.mp3',
        loop: true,
        volume: -10,
      }),
    []
  );

  useEffect(() => {
    input.chain(LofiFX, BitCrushFX, output);
    Noise.chain(NoiseOut, output);
    return () => {
      input.disconnect(LofiFX);
      LofiFX.disconnect(BitCrushFX);
      BitCrushFX.disconnect(output);
      Noise.disconnect(NoiseOut);
      NoiseOut.disconnect(output);
      LofiFX.dispose();
      BitCrushFX.dispose();
      Noise.dispose();
      NoiseOut.dispose();
    };
  }, []);

  const [noiseLevel, setNoiseLevel] = useState(noiseLevelDefault);
  useEffect(() => {
    if (noiseLevel === 0 && Noise.state === 'started') {
      Noise.stop();
    }
    if (Noise.state === 'stopped' && noiseLevel > 0) {
      Noise.start();
      console.log('noise started');
    }
  }, [noiseLevel]);
  return (
    <>
      <Stack
        height="fit-content"
        sx={{ p: 1, backgroundColor: APalette.lofi, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Lofi
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            title={'Noise'}
            defaultValue={noiseLevelDefault}
            onValueChange={(value) => {
              NoiseOut.set({ gain: value / 100 });
              setNoiseLevel(value);
            }}
            min={0}
            max={100}
          />
          <Knob
            min={0}
            max={100}
            title={'Balance'}
            defaultValue={wowDepthDefault}
            onValueChange={(value) => LofiFX.set({ depth: value / 100 })}
          />
          <Knob
            min={1}
            max={16}
            title={'Broken'}
            defaultValue={brokenDefault}
            onValueChange={(value) => BitCrushFX.set({ bits: value })}
          />
        </Stack>
      </Stack>
    </>
  );
};
