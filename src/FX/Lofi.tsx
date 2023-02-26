import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

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

const BitCrushFX = new Tone.BitCrusher({ bits: 16 });

export const LofiFX = new Tone.Vibrato({
  frequency: 1.6,
  depth: wowDepthDefault / 100,
  type: 'triangle',
});

const NoiseOut = new Tone.Gain().connect(LofiFX);
const Noise = new Tone.Player({
  url: 'assets/Tape_Noise_05.mp3',
  loop: true,
  volume: -10,
});

export const Lofi = ({ input, output }: LofiProps) => {
  useEffect(() => {
    input.chain(LofiFX, BitCrushFX, output);
    Noise.chain(NoiseOut, output);
  }, [input]);

  const [noiseLevel, setNoiseLevel] = useState(noiseLevelDefault);
  NoiseOut.set({ gain: noiseLevel / 100 });

  const [wowDepth, setWowDepth] = useState(wowDepthDefault);
  LofiFX.set({ depth: wowDepth / 100 });

  const [broken, setBroken] = useState(brokenDefault);
  BitCrushFX.set({ bits: broken });

  useEffect(() => {
    if (noiseLevel === 0 && Noise.state === 'started') {
      Noise.stop();
    }
    if (Noise.state === 'stopped' && noiseLevel > 0) {
      Noise.start();
      console.log(Noise.state);
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
            onValueChange={(value) => setNoiseLevel(value)}
            min={0}
            max={100}
          />
          <Knob
            min={0}
            max={100}
            title={'Balance'}
            defaultValue={wowDepthDefault}
            onValueChange={(value) => setWowDepth(value)}
          />
          <Knob
            min={1}
            max={16}
            title={'Broken'}
            defaultValue={brokenDefault}
            onValueChange={(value) => setBroken(value)}
          />
        </Stack>
      </Stack>
    </>
  );
};
