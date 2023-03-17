import * as Tone from 'tone';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';

export type MonoSynthPresetsType = {
  [key: string]: RecursivePartial<Tone.MonoSynthOptions>;
};

export const MonoSynthPresets: MonoSynthPresetsType = {
  Default: {
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.001,
      decay: 0.401,
      sustain: 0.5,
      release: 1.0001,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.401,
      sustain: 0.5,
      release: 1.0001,
      baseFrequency: 301,
      octaves: 4,
    },
  },

  'Moog Bass': {
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.2,
      release: 1.2001,
    },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.2,
      release: 1.2001,
      baseFrequency: 200.5,
    },
  },
  'Simple Sine': {
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 1,
      release: 0.5001,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 1,
      release: 0.5001,
      baseFrequency: 501,
    },
  },
};
