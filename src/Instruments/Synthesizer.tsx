import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';
import { useEffect, useMemo, useRef, useState, memo } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { Icon } from '@iconify/react';
import waveSine from '@iconify/icons-ph/wave-sine';
import waveSquare from '@iconify/icons-ph/wave-square';
import waveTriangle from '@iconify/icons-ph/wave-triangle';
import waveSawtooth from '@iconify/icons-ph/wave-sawtooth';
import { ToneOscillatorType } from 'tone';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { fontSize } from '@mui/system';
import { mapLog, map_range } from '../utils/utils';
import { synthLFO } from './SynthLFO';

type OmitMonophonicOptions<T> = Omit<T, 'context' | 'onsilence'>;

interface synthProps {
  synth: Tone.PolySynth;
}

const defaultSynthOptions: RecursivePartial<
  OmitMonophonicOptions<Tone.SynthOptions>
> = {
  oscillator: {
    type: 'sawtooth',
  },
  envelope: {
    attack: 0.001,
    decay: 1,
    sustain: 0.5,
    release: 1,
  },
};

const defaultFrequencyEnvelopeOptions: Partial<Tone.FrequencyEnvelopeOptions> =
  {
    attack: 0.001,
    decay: 0.7,
    sustain: 0.5,
    release: 1,
    octaves: 4,
  };

const HPF_ENVELOPE: Partial<Tone.FrequencyEnvelopeOptions> = {
  attack: 0.001,
  decay: 1,
  sustain: 0,
  release: 0,
  octaves: 3,
};

export const Synthesizer = memo(({ synth }: synthProps) => {
  //setup audio nodes, refs are used to avoid re-rendering
  const outLevel = useMemo(() => new Tone.Gain().toDestination(), []);
  const HPF = useMemo(() => new Tone.Filter(20, 'highpass'), []);
  const LPF = useMemo(() => new Tone.Filter(3000, 'lowpass'), []);
  const LPFEnvelope = useMemo(
    () => new Tone.FrequencyEnvelope(defaultFrequencyEnvelopeOptions),
    []
  ).connect(LPF.frequency);
  const HPFEnvelope = useMemo(
    () => new Tone.FrequencyEnvelope(HPF_ENVELOPE),
    []
  ).connect(HPF.frequency);
  // const poly = useMemo(
  //   () => new Tone.PolySynth(Tone.Synth, defaultSynthOptions),
  //   []
  // );
  const poly = synth.set(defaultSynthOptions);

  //setup stuff
  poly.maxPolyphony = 8;
  const LFO = useRef(new synthLFO()).current;
  poly.chain(HPF, LPF, outLevel);
  console.log(HPF.frequency.value, 'HPF');

  return (
    <>
      <AButton
        onClick={() => {
          poly.triggerAttackRelease('C4', '4n');
          LPFEnvelope.triggerAttackRelease('4n');
        }}
      ></AButton>
      <Stack
        className="unselectable"
        sx={{
          backgroundColor: APalette.beige,
          width: 'fit-content',
          p: 1,
        }}
      >
        <Stack spacing={3} direction="row">
          <Knob
            title="LFO"
            onValueChange={(value) => {
              LFO.updateLFO(value);
            }}
          />
          <Knob
            title="HPF"
            min={20}
            max={20000}
            defaultValue={20}
            isExp
            onValueChange={(value) => {
              HPFEnvelope.baseFrequency = value;
              console.log(HPF.frequency.value, 'HPF cutoff');
              LFO.updateLFO();
            }}
          />
          <Knob
            title="Cut-off"
            defaultValue={301}
            min={20}
            max={20000}
            isExp
            onValueChange={(value) => {
              LPFEnvelope.baseFrequency = value;
              console.log(LPF.frequency.value, 'LPF cutoff');
              LFO.updateLFO();
            }}
          />
          <Knob
            title="Level"
            onValueChange={(value) => {
              outLevel.gain.value = value / 100;
              LFO.updateLFO();
            }}
          />
        </Stack>
        <Stack spacing={3} direction="row">
          <Knob
            title="Attack"
            isExp
            hasDecimals={3}
            min={0.001}
            defaultValue={0.001}
            max={10}
            onValueChange={(value) => {
              poly.set({
                envelope: { attack: value },
              });
              LPFEnvelope.attack = value;
            }}
          />
          <Knob
            title="Decay"
            isExp
            hasDecimals={3}
            min={0.1}
            defaultValue={0.401}
            max={10}
            onValueChange={(value) => {
              poly.set({
                envelope: { decay: value },
              });
              LPFEnvelope.decay = value;
            }}
          />
          <Knob
            title="Sustain"
            onValueChange={(value) => {
              poly.set({
                envelope: { sustain: value / 100 },
              });
              LPFEnvelope.set({ sustain: value / 100 });
            }}
          />
          <Knob
            title="Release"
            isExp
            hasDecimals={3}
            min={0.1}
            defaultValue={1.0001}
            max={20}
            onValueChange={(value) => {
              poly.set({
                envelope: { release: value },
              });
              LPFEnvelope.release = value;
            }}
          />
        </Stack>
        <Stack
          pt={1.5}
          justifyContent="space-between"
          alignItems="center"
          direction={'row'}
        >
          <FormControl size="small">
            <InputLabel sx={{ fontSize: '0.8rem' }}>OSC</InputLabel>
            <Select
              sx={{ maxHeight: '2rem' }}
              label="OSC"
              defaultValue={'sawtooth'}
              onChange={(e) =>
                poly.set({
                  oscillator: {
                    type: e.target.value as NonCustomOscillatorType,
                  },
                })
              }
            >
              <MenuItem value={'sine'}>
                <Icon icon={waveSine} />
              </MenuItem>

              <MenuItem value={'triangle'}>
                <Icon icon={waveTriangle} />
              </MenuItem>
              <MenuItem value={'sawtooth'}>
                <Icon icon={waveSawtooth} />
              </MenuItem>
              <MenuItem value={'square'}>
                <Icon icon={waveSquare} />
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel
              sx={{
                fontSize: '0.7rem',
              }}
            >
              LFO
            </InputLabel>
            <Select
              sx={{
                minWidth: 80,
                fontSize: '0.7rem',
                maxHeight: '2rem',
                '& .MuiSelect-input': { fontSize: '0.7rem' },
              }}
              autoWidth
              label="LFO"
              defaultValue={'none'}
              onChange={(e) => {
                if (e.target.value === 'level') {
                  LFO.assignTo(outLevel);
                }
                if (e.target.value === 'Cut-Off') {
                  LFO.assignTo(LPF, LPFEnvelope);
                }
                if (e.target.value === 'HPF') {
                  LFO.assignTo(HPF, HPFEnvelope);
                }
                if (e.target.value === 'none') {
                  LFO.disconnect();
                }
              }}
            >
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'level'}>
                Level
              </MenuItem>
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'Cut-Off'}>
                Cut-Off
              </MenuItem>
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'HPF'}>
                HPF
              </MenuItem>
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'none'}>
                None
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
});
