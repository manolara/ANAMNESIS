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
import { useMemo, useRef, memo, useEffect } from 'react';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';
import { Icon } from '@iconify/react';
import waveSine from '@iconify/icons-ph/wave-sine';
import waveSquare from '@iconify/icons-ph/wave-square';
import waveTriangle from '@iconify/icons-ph/wave-triangle';
import waveSawtooth from '@iconify/icons-ph/wave-sawtooth';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { synthLFO } from './SynthLFO';
import { SoundSourceProps } from '../types/componentProps';

interface synthProps {
  synth: Tone.MonoSynth;
}

const defaultSynthOptions: RecursivePartial<Tone.MonoSynthOptions> = {
  oscillator: {
    type: 'sawtooth',
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
    octaves: 4,
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

export const MonoSynth = ({
  soundEngine,
  output,
}: SoundSourceProps<Tone.MonoSynth>) => {
  //setup audio nodes, refs are used to avoid re-rendering
  const outLevel = useMemo(() => new Tone.Gain(), []);
  const HPF = useMemo(() => new Tone.Filter(20, 'highpass'), []);
  const HPFEnvelope = useMemo(
    () => new Tone.FrequencyEnvelope(HPF_ENVELOPE),
    []
  ).connect(HPF.frequency);

  const mono = useMemo(() => soundEngine.set(defaultSynthOptions), []);

  //setup stuff
  const LFO = useRef(new synthLFO()).current;
  useEffect(() => {
    mono.chain(HPF, outLevel, output);

    return () => {
      mono.dispose();
      outLevel.dispose();
      HPFEnvelope.dispose();
      HPF.dispose();
    };
  }, []);

  return (
    <>
      <AButton
        onClick={() => {
          mono.triggerAttackRelease('C4', '4n');
        }}
      ></AButton>
      <Stack
        className="unselectable"
        sx={{
          backgroundColor: APalette.purple,
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
              mono.filterEnvelope.baseFrequency = value;
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
              mono.set({
                envelope: { attack: value },
              });
              mono.filterEnvelope.attack = value;
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
              mono.set({
                envelope: { decay: value },
              });
              mono.filterEnvelope.decay = value;
            }}
          />
          <Knob
            title="Sustain"
            onValueChange={(value) => {
              mono.set({
                envelope: { sustain: value / 100 },
              });
              mono.filterEnvelope.set({ sustain: value / 100 });
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
              mono.set({
                envelope: { release: value },
              });
              mono.filterEnvelope.release = value;
              console.log(mono.filterEnvelope.release, 'release');
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
                mono.set({
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
                  LFO.assignTo(mono.filter, mono.filterEnvelope);
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
};