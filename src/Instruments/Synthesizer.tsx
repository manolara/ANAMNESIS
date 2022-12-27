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
import { useEffect, useMemo, useRef, useState } from 'react';
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

type OmitMonophonicOptions<T> = Omit<T, 'context' | 'onsilence'>;

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
    octaves: 3,
  };

// const handleLFOChange = (value: number) => {

export const Synthesizer = () => {
  //setup audio nodes, refs are used to avoid re-rendering
  const outLevel = useRef(new Tone.Gain().toDestination()).current;
  const HPF = useRef(new Tone.Filter(20, 'highpass')).current;
  const LPF = useRef(new Tone.Filter(3000, 'lowpass')).current;
  const LPFEnvelope = useRef(
    new Tone.FrequencyEnvelope(defaultFrequencyEnvelopeOptions)
  ).current.connect(LPF.frequency);
  const poly = useRef(
    new Tone.PolySynth(Tone.Synth, defaultSynthOptions)
  ).current;

  let lfoVal = 0;

  //setup stuff
  poly.maxPolyphony = 8;
  const LFO = useRef(
    new Tone.LFO(
      3,
      +LPFEnvelope.baseFrequency,
      +LPFEnvelope.baseFrequency * Math.pow(2, 0)
    )
  ).current;
  LFO.start();
  LFO.connect(LPF.frequency);
  poly.chain(HPF, LPF, outLevel);

  return (
    <>
      <AButton
        onClick={() => {
          poly.triggerAttackRelease('C4', '8n');
          LPFEnvelope.triggerAttackRelease('8n');
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
              lfoVal = value;
              console.log('lfoVal', lfoVal);
            }}
          />
          <Knob
            title="HPF"
            min={20}
            max={20000}
            defaultValue={20}
            isExp
            onValueChange={(value) => HPF.set({ frequency: value })}
          />
          <Knob
            title="Cut-off"
            defaultValue={301}
            min={20}
            max={20000}
            isExp
            onValueChange={(value) => {
              LPFEnvelope.baseFrequency = value;
              const cutoffLFO = map_range(lfoVal, 0, 100, 0, 6);
              console.log('cutoffLFO', cutoffLFO, 'lfoVal', lfoVal);
              LFO.set({
                min: value,
                max: Math.pow(2, cutoffLFO) * value,
              });
            }}
          />
          <Knob
            title="Level"
            onValueChange={(value) => outLevel.set({ gain: value / 100 })}
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
            {/* make input label smaller when not on focus */}
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
              // onChange={(e) => {
              //   if (e.target.value === 'level') {
              //
              //     console.log('happened');
              //   }
              // }}
            >
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'pitch'}>
                Cut-Off
              </MenuItem>

              <MenuItem sx={{ fontSize: '0.8rem' }} value={'level'}>
                Level
              </MenuItem>
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'sawtooth'}>
                Pitch
              </MenuItem>
              <MenuItem sx={{ fontSize: '0.8rem' }} value={'square'}>
                HPF
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
};
