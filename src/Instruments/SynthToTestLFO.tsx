import * as Tone from 'tone';
import { Stack } from '@mui/system';
import { Knob } from '../FX/Knob';
import { AButton } from '../theme';
import { useEffect, useRef } from 'react';
import { synthLFO } from './SynthLFO';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const SynthToTestLFO = () => {
  const synth = useRef(
    new Tone.Synth({
      oscillator: {
        type: 'sawtooth',
      },
    })
  ).current;
  const level = useRef(new Tone.Gain(0.5)).current;
  const LPF = useRef(new Tone.Filter(3000, 'lowpass')).current;
  const LPFEnvelope = useRef(
    new Tone.FrequencyEnvelope({
      attack: 0.3,
      decay: 0.7,
      sustain: 0.5,
      release: 1,
      octaves: 4,
    }).connect(LPF.frequency)
  ).current;
  const LFO = useRef(new synthLFO()).current;
  //LFO.lfo.start();
  synth.chain(LPF, level, Tone.Destination);

  return (
    <Stack pl={3} alignItems="start" className="unselectable">
      <Knob
        isExp
        min={20}
        max={20000}
        title="LPF"
        onValueChange={(value) => {
          LPFEnvelope.baseFrequency = value;
          LFO.updateLFO();
          console.log(LFO.lfo.min, LFO.lfo.max);
        }}
      />
      <Knob
        title="Level"
        onValueChange={(value) => {
          level.gain.value = value / 100;
          LFO.updateLFO();
          console.log(level.gain.value, 'level level');
        }}
      />
      <Knob
        title="LFO"
        onValueChange={(value) => {
          LFO.updateLFO(value);
        }}
      />
      <AButton
        onClick={() => {
          synth.triggerAttackRelease('C4', '4n');
          LPFEnvelope.triggerAttackRelease('4n');
        }}
      >
        Test Sound
      </AButton>
      <FormControl sx={{ mt: '1rem' }} size="small">
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
              LFO.assignTo(level);
            }
            if (e.target.value === 'LPF') {
              LFO.assignTo(LPF, LPFEnvelope);
            }
            if (e.target.value === 'none') {
              LFO.disconnect();
            }
          }}
        >
          <MenuItem sx={{ fontSize: '0.8rem' }} value={'pitch'}>
            Cut-Off
          </MenuItem>
          <MenuItem sx={{ fontSize: '0.8rem' }} value={'level'}>
            Level
          </MenuItem>
          <MenuItem sx={{ fontSize: '0.8rem' }} value={'LPF'}>
            LPF
          </MenuItem>
          <MenuItem sx={{ fontSize: '0.8rem' }} value={'square'}>
            HPF
          </MenuItem>
          <MenuItem sx={{ fontSize: '0.8rem' }} value={'none'}>
            None
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};
