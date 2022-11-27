/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-return-assign */
import { Stack } from '@mui/material';
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

let wowFreq = 3;
let wow: Tone.LFO;
const wowRange = 20;
let cnv: p5.Renderer;
let glow2ndgrad = 1;
let glow = 0.2 * glow2ndgrad;
let stroke = 2.2;
interface SequenceType {
  x: number[];
  y: number[];
}
let sequence: SequenceType = {
  x: [],
  y: [],
};
let isPlayback = false;
let sequenceCounter: number;

/// TONE.js///////
const volKnob = new Tone.Gain(vol).toDestination();
const synth = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle',
  },
}).connect(volKnob);

export const Theremin = () => {
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
    const song = () => {};
    p.setup = () => {
      cnv = p.createCanvas(canvasWidth, canvasHeight);
      cnv.mousePressed(canvasPressed);
      cnv.mouseMoved(canvasDragged);

      cnv.mouseOut(() => {
        if (p.mouseIsPressed) {
          releaseNote();
        }
      });

      cnv.mouseReleased(releaseNote);
      wow = new Tone.LFO(wowFreq, -wowRange, wowRange);
      wow.connect(synth.detune).start();
      drawBackground();
    };

    const drawBackground = () => {
      p.background('#bdd0c4');
      notes.forEach((note, i) => {
        p.line(
          ((i + 1) * p.width) / notes.length,
          0,
          ((i + 1) * p.width) / notes.length,
          p.height
        );
      });
    };
    const showOrb = () => {
      glow2ndgrad = p.map(p.mouseY, 0, p.height, 15, 3);
      const size = p.map(p.mouseY, 0, p.height, 50, 20);
      if (stroke > 12 || stroke < 2) {
        glow = -glow;
      }

      stroke += glow * glow2ndgrad;

      p.push();

      p.stroke('#ffb8b8');
      p.strokeWeight(stroke);
      p.fill('#ffb8b8');
      p.circle(p.mouseX, p.mouseY, size);
      p.pop();
    };
    p.draw = () => {
      console.log(isPlayback);
      drawBackground();
      showOrb();
      if (isPlayback) {
        playTheremin(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
      }
      sequenceCounter = (sequenceCounter + 1) % sequence.x.length;
    };

    const canvasDragged = () => {
      // record sequence coordinates
      if (p.mouseIsPressed) {
        sequence.x = [...sequence.x, p.mouseX];
        sequence.y = [...sequence.y, p.mouseY];
        playTheremin(p.mouseX, p.mouseY);
      }
    };
    const canvasPressed = () => {
      if (isPlayback) {
        synth.triggerRelease();
        sequence.x = [];
        sequence.y = [];
      }
      isPlayback = false;
      synth.triggerAttack(pitch);
      console.log({ pitch });
      playTheremin(p.mouseX, p.mouseY);
    };
    const releaseNote = () => {
      isPlayback = true;
      sequenceCounter = 0;
      synth.triggerRelease();
      setTimeout(() => {
        synth.triggerAttack(pitch);
      }, 300);
    };
    const playTheremin = (x: number, y: number) => {
      // volume
      vol = p.map(y, 0, p.height, 1, 0.2);
      volKnob.gain.value = vol;
      // pitch
      prevCell = cellNum ?? 0;
      cellNum = Math.floor((notes.length * x) / p.width);
      if (cellNum !== prevCell) {
        pitch = notes[cellNum];
        synth.frequency.rampTo(pitch, 0.3);
      }
      // wow
      wowFreq = p.map(y, 0, p.height, 7, 3);
      wow.frequency.value = wowFreq;
      console.log({ cellNum });
    };
    const ThereminLoop = new Tone.Loop(song, '4n');
  };

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
};
