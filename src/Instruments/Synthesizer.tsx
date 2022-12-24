import { Stack } from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import { useRef, useState } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { useImmer } from 'use-immer';

interface SynthesizerProps {}
type OmitMonophonicOptions<T> = Omit<T, 'context' | 'onsilence'>;

const defaultSynthOptions: RecursivePartial<
  OmitMonophonicOptions<Tone.MonoSynthOptions>
> = {
  oscillator: {
    type: 'square',
  },
  envelope: {
    attack: 0.001,
    decay: 1,
    sustain: 0.5,
    release: 1,
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.7,
    sustain: 0.5,
    release: 1,
    baseFrequency: 300,
    octaves: 4,
  },
};

export const Synthesizer = () => {
  const outLevelRef = useRef(new Tone.Gain().toDestination());
  const HPFRef = useRef(new Tone.Filter(20, 'highpass'));
  const polyRef = useRef(
    new Tone.PolySynth(Tone.MonoSynth, defaultSynthOptions)
  );
  const [level, setLevel] = useState(50);
  const [HPFLevel, setHPFLevel] = useState(20);
  const [synthOptions, setSynthOptions] = useImmer(defaultSynthOptions);
  const outLevel = outLevelRef.current;
  const poly = polyRef.current;
  const HPF = HPFRef.current;
  outLevel.set({ gain: level / 100 });
  HPF.set({ frequency: HPFLevel });
  poly.set(synthOptions);
  poly.chain(HPF, outLevel);

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
          <Knob
            title="HPF"
            min={20}
            max={20000}
            defaultValue={20}
            isExp
            onValueChange={(value) => setHPFLevel(value)}
          />
          <Knob
            title="Cut-off"
            defaultValue={301}
            min={20}
            max={20000}
            isExp
            onValueChange={(value) =>
              setSynthOptions((draft) => {
                draft.filterEnvelope!.baseFrequency = value;
              })
            }
          />
          <Knob title="Level" onValueChange={(value) => setLevel(value)} />
        </Stack>
        <Stack spacing={3} direction="row">
          <Knob
            title="Attack"
            isExp
            hasDecimals={3}
            min={0.001}
            defaultValue={0.001}
            max={10}
            onValueChange={(value) =>
              setSynthOptions((draft) => {
                draft.filterEnvelope!.attack = value;
                draft.envelope!.attack = value;
              })
            }
          />
          <Knob
            title="Decay"
            isExp
            hasDecimals={3}
            min={0.1}
            defaultValue={0.401}
            max={10}
            onValueChange={(value) =>
              setSynthOptions((draft) => {
                draft.filterEnvelope!.decay = value;
                draft.envelope!.decay = value;
              })
            }
          />
          <Knob
            title="Sustain"
            onValueChange={(value) =>
              setSynthOptions((draft) => {
                draft.filterEnvelope!.sustain = value / 100;
                draft.envelope!.sustain = value / 100;
              })
            }
          />
          <Knob
            title="Release"
            isExp
            hasDecimals={3}
            min={0.1}
            defaultValue={1.0001}
            max={20}
            onValueChange={(value) => {
              setSynthOptions((draft) => {
                draft.filterEnvelope!.release = value;
                draft.envelope!.release = value;
              });
              console.log(value);
            }}
          />
        </Stack>
      </Stack>
    </>
  );
};
