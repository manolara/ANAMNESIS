import { Stack } from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import { useRef, useState } from 'react';
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
  const [synthOptions, setSynthOptions] = useState(defaultSynthOptions);
  const outLevel = outLevelRef.current;
  const poly = polyRef.current;
  poly.connect(outLevel);
  outLevel.set({ gain: level / 100 });
  poly.set(synthOptions);

  return (
    <>
      <AButton onClick={() => poly.triggerAttackRelease('C4', '8n')}></AButton>
      <Stack
        className="unselectable"
        sx={{
          backgroundColor: APalette.beige,
          width: 'fit-content',
          p: 1,
        }}
      >
        <Stack spacing={3} direction="row">
          <Knob title="LFO" />
          <Knob title="HPF" />
          <Knob
            title="Cut-off"
            defaultValue={301}
            min={20}
            max={20000}
            isExp
            onValueChange={(value) =>
              setSynthOptions({
                ...synthOptions,
                filterEnvelope: {
                  ...synthOptions.filterEnvelope,
                  baseFrequency: value,
                },
              })
            }
          />
          <Knob title="Level" onValueChange={(value) => setLevel(value)} />
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
