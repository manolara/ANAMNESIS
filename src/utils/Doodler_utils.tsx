import p5 from 'p5';
import { P5Instance } from 'react-p5-wrapper';

import * as Tone from 'tone';

export const setBackground = (
  p: P5Instance,
  gridOn: boolean,
  curColor: p5.Color
) => {
  p.background(curColor);
  if (gridOn === true) {
    p.push();
    p.stroke(120);
    p.strokeWeight(1);

    for (let i = 0; i <= 8; i++) {
      p.line((i * p.width) / 8, 0, (i * p.width) / 8, p.height);
    }
    for (let i = 0; i <= 12; i++) {
      p.line(0, (i * p.height) / 12, p.width, (i * p.height) / 12);
    }
    p.pop();
  }
};

export const flutterAndWow = (
  Synth: Tone.MonoSynth,
  flutFreq: number,
  flutRange: number,
  wowFreq: number,
  wowRange: number
) => {
  const flutter = new Tone.LFO(flutFreq, -flutRange, flutRange);

  const wow = new Tone.LFO(wowFreq, -wowRange, wowRange);
  // changing lfo setting
  flutter.connect(Synth.detune);
  wow.connect(Synth.detune);
  flutter.start();
  wow.start();
};

export const setupLeadSynth = (leadSynth: Tone.MonoSynth) => {
  leadSynth.set({
    oscillator: {
      type: 'sawtooth', //
    },

    envelope: {
      attack: 0.0098,
      decay: 60,
      sustain: 0.9,
      release: 4,
    },

    filter: {
      Q: 3,
      // frequency : 10,
      type: 'lowpass',
      rolloff: -12,
    },

    filterEnvelope: {
      attack: 0.0098,
      decay: 0.8,
      sustain: 0.8,
      release: 3,
      baseFrequency: 100,
      octaves: 1,
      exponent: 2,
    },
  });
};

export const setupBassSynth = (bassSynth: Tone.MonoSynth) => {
  bassSynth.set({
    oscillator: {
      type: 'sawtooth', //
    },
    envelope: {
      attack: 0.0098,
      decay: 10,
      sustain: 0.1,
      release: 2.49,
    },
    filter: {
      Q: 3,
      // frequency : 10,
      type: 'lowpass',
      rolloff: -12,
    },
    filterEnvelope: {
      attack: 0.0098,
      decay: 0.8,
      sustain: 0.9,
      release: 2,
      baseFrequency: 100,
      octaves: 1,
      exponent: 2,
    },
  });
};

export const firstCell = (xCoordinatesLine: number[]) => {
  if (xCoordinatesLine.length !== 0) {
    // console.log(x[0]);

    let index = 1;
    while (index * 75 < xCoordinatesLine[0]) {
      index++;
    }
    return index - 1;
  }
  return -1;
};
export const lastCell = (xCoordinatesLine: number[]) => {
  if (xCoordinatesLine.length !== 0) {
    //  console.log(x[x.length - 1]);

    let index = 1;
    while (index * 75 < xCoordinatesLine[xCoordinatesLine.length - 1]) {
      index++;
    }
    return index - 1;
  }
  return -1;
};

export const rootNotes = {
  1: 'C3',
  2: 'D3',
  4: 'F3',
  5: 'G3',
  6: 'A3',
};

export const findTranPoints = (xCoordinatesLine: number[]) => {
  const newTranPoints: number[] = [];
  for (let i = 1; i < 9; i++) {
    for (let j = 0; j < xCoordinatesLine.length; j++) {
      if (xCoordinatesLine[j + 1] > i * 75 && xCoordinatesLine[j] <= i * 75) {
        if (xCoordinatesLine[j] === i * 75) {
          newTranPoints.push(j);
        } else {
          newTranPoints.push(j + 1);
        }
      }
    }
  }
  newTranPoints.unshift(0);
  newTranPoints.push(xCoordinatesLine.length - 1);
  return newTranPoints;
};
