import * as Tone from 'tone';
import { disconnect } from 'tone';
import { map_range } from '../utils/utils';

const ASSIGNED_TO = {
  LPF: 'LPF',
  LEVEL: 'LEVEL',
  HPF: 'HPF',
  NONE: 'NONE',
} as const;

export class synthLFO {
  value: number;
  lfo: Tone.LFO;
  assignedTo: Tone.InputNode | 'NONE';
  LPFEnvelope: Tone.FrequencyEnvelope | null;

  constructor() {
    this.value = 0;
    this.assignedTo = 'NONE';
    this.lfo = new Tone.LFO(3, 0, 1);
    this.LPFEnvelope = null;
  }

  updateLFO = (value?: number) => {
    this.value = value ?? this.value;
    console.log('LFO assigned to: ', this.assignedTo);
    ///LPF
    if (
      this.assignedTo instanceof Tone.Filter &&
      this.assignedTo.type === 'lowpass' &&
      this.LPFEnvelope
    ) {
      const knobToOctave = map_range(this.value, 0, 100, 0, 4);
      const center = +this.LPFEnvelope.baseFrequency;
      const min = center * Math.pow(2, -knobToOctave);
      const max = center * Math.pow(2, knobToOctave);
      this.lfo.set({
        min: min < 20 ? 20 : min,
        max: max > 20000 ? 200000 : max,
      });
      ///HPF
    } else if (
      this.assignedTo instanceof Tone.Filter &&
      this.assignedTo.type === 'highpass'
    ) {
      const knobToOctave = map_range(this.value, 0, 100, 0, 4);
      const center = +this.assignedTo.frequency.value;
      const min = center * Math.pow(2, -knobToOctave);
      const max = center * Math.pow(2, knobToOctave);
      this.lfo.set({
        min: min,
        max: max,
      });
      ///LEVEL
    } else if (this.assignedTo instanceof Tone.Gain) {
      const range = this.value / 2;
      const gainMin = this.assignedTo.gain.value - range / 100;
      const gainMax = this.assignedTo.gain.value + range / 100;
      this.lfo.set({
        min: gainMin < 0 ? 0 : gainMin,
        max: gainMax > 1 ? 1 : gainMax,
      });
      console.log(this.assignedTo.gain.value, 'min', gainMin, 'max', gainMax);
    }
    if (this.lfo.state !== 'started' && this.assignedTo !== 'NONE') {
      this.lfo.start();
    }
  };

  assignTo = (node: Tone.InputNode, envelope?: Tone.FrequencyEnvelope) => {
    this.assignedTo = node;

    this.lfo.disconnect();
    if (node instanceof Tone.Filter) {
      const incomingValue = node.gain.value;
      this.lfo.connect(node.frequency);
      node.frequency.value = incomingValue;
    } else if (node instanceof Tone.Gain) {
      const incomingValue = node.gain.value;
      this.lfo.connect(node.gain);
      node.gain.value = incomingValue;
    }
    if (envelope) {
      this.LPFEnvelope = envelope;
    }
    this.updateLFO();
  };

  disconnect = () => {
    this.updateLFO(0);
    this.lfo.disconnect();
    if (this.assignedTo instanceof Tone.Filter) {
      this.assignedTo.gain.cancelScheduledValues(0);
    } else if (this.assignedTo instanceof Tone.Gain) {
      this.assignedTo.gain.cancelScheduledValues(0);
    }
    console.log('LFO disconnected from: ', this.assignedTo);
    this.assignedTo = 'NONE';
  };
}
