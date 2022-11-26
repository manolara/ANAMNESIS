/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-return-assign */
import { Stack } from '@mui/system';
import p5 from 'p5';
import { useState } from 'react';
import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';
import { AButton } from '../theme';

const canvasHeight = 500;
const canvasWidth = 700;
let vol = 0.2;
let pitch: string;
let cellNum: number;
let prevCell;
const volKnob = new Tone.Gain(vol).toDestination();
const synth = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle',
  },
}).connect(volKnob);

let wowFreq = 3;
let wow: Tone.LFO;
const wowRange = 20;
let cnv: p5.Renderer;

export function Theremin() {
  const [oct, setOct] = useState(4);
  const notes = [
    `G${oct - 1}`,
    `A${oct - 1}`,
    `B${oct - 1}`,
    `C${oct}`,
    `D${oct}`,
    `E${oct}`,
    `F${oct}`,
    `G${oct}`,
    `A${oct}`,
    `B${oct}`,
    `C${oct + 1}`,
  ];

  const sketch = (p: P5CanvasInstance) => {
    p.setup = () => {
      cnv = p.createCanvas(canvasWidth, canvasHeight);
      cnv.mousePressed(canvasPressed);
      cnv.mouseOut(releaseNote);
      cnv.mouseReleased(releaseNote);
      p.background('#bdd0c4');
      wow = new Tone.LFO(wowFreq, -wowRange, wowRange);
      wow.connect(synth.detune).start();
      notes.forEach((note, i) => {
        p.line(
          ((i + 1) * p.width) / notes.length,
          0,
          ((i + 1) * p.width) / notes.length,
          p.height
        );
      });
    };

    p.draw = () => {
      // volume
      vol = p.map(p.mouseY, 0, p.height, 1, 0.2);
      if (p.mouseY > p.height) {
        vol = 0;
      }
      volKnob.gain.value = vol;

      // pitch

      prevCell = cellNum ?? 0;
      cellNum = Math.floor((notes.length * p.mouseX) / p.width);
      if (cellNum !== prevCell && cellNum >= 0 && cellNum < notes.length) {
        pitch = notes[cellNum];

        synth.frequency.rampTo(pitch, 0.3);
      }

      // wow
      wowFreq = p.map(p.mouseY, 0, p.height, 7, 3);
      wow.frequency.value = wowFreq;
    };

    const canvasPressed = () => {
      synth.triggerAttack(pitch);
    };
    const releaseNote = () => {
      console.log('mouseout');
      synth.triggerRelease();
    };
  };

  // const myp5 = new p5(sketch);

  return (
    <>
      <ReactP5Wrapper sketch={sketch} />
      <Stack direction="row" spacing={2}>
        <AButton
          onClick={() => {
            setOct((prev) => prev - 1);
          }}
        >
          oct --1
        </AButton>
        <AButton
          onClick={() => {
            setOct((prev) => prev + 1);
          }}
        >
          oct +1
        </AButton>
      </Stack>
    </>
  );
}
