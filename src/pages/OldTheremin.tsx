/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-return-assign */
import { Icon, Stack } from '@mui/material';
import p5 from 'p5';
import { useState } from 'react';
import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';
import { AButton } from '../theme';
import {
  barVisualizerSpeed,
  getCurrentBar,
  loopLengthSeconds,
  startLoop,
} from '../utils/utils';
import { FiberManualRecord } from '@mui/icons-material';

const canvasHeight = 500;
const canvasWidth = 700;
let vol = 0.2;
let pitch: string;
let cellNum: number;
let prevCell;
let mouseIsPressing: boolean;

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
let loopBarStart: number;
let loopBarEnd: number;

let loopLengthBars = 1;
let barVisualizerPosition: number = 0;

/// TONE.js///////
const volKnob = new Tone.Gain(vol).toDestination();
const synth = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle',
  },
}).connect(volKnob);

export const OldTheremin = () => {
  const [oct, setOct] = useState(4);
  const [isRecording, setIsRecording] = useState(false);
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
    const song = () => {
      let loopLengthSecs = loopLengthSeconds(loopLengthBars);

      drawBackground();
      if (!isPlayback) {
        showOrb(p.mouseX, p.mouseY);
      }
      if (mouseIsPressing) {
        recordTheremin(p, playTheremin);
      }
      if (isPlayback) {
        playbackTheremin(playTheremin, showOrb, p);
      }
      sequenceCounter = (sequenceCounter + 1) % sequence.x.length;
    };
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
      p.frameRate(30);
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
    const showOrb = (x: number, y: number) => {
      glow2ndgrad = p.map(y, 0, p.height, 15, 3);
      const size = p.map(y, 0, p.height, 50, 20);
      if (stroke > 12 || stroke < 2) {
        glow = -glow;
      }
      stroke += glow * glow2ndgrad;

      p.push();
      p.stroke('#ffb8b8');
      p.strokeWeight(stroke);
      p.fill('#ffb8b8');
      p.circle(x, y, size);
      p.pop();
    };

    p.draw = () => {
      // let loopLengthSecs = loopLengthSeconds(loopLengthBars);
      // drawBackground();
      // if (!isPlayback) {
      //   showOrb(p.mouseX, p.mouseY);
      // }
      // if (mouseIsPressing) {
      //   sequence.x = [...sequence.x, p.mouseX];
      //   sequence.y = [...sequence.y, p.mouseY];
      //   playTheremin(p.mouseX, p.mouseY);
      // }
      // if (isPlayback) {
      //   playTheremin(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
      //   showOrb(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
      //   p.ellipse(barVisualizerPosition, p.height / 10, 40, 40);
      //   barVisualizerPosition =
      //     (barVisualizerPosition +
      //       barVisualizerSpeed(loopLengthBars, p.width)) %
      //     p.width;
      // }
      // sequenceCounter = (sequenceCounter + 1) % sequence.x.length;
    };

    const canvasDragged = (cnv: p5.Renderer) => {
      // record sequence coordinates
      if (p.mouseIsPressed) {
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
      playTheremin(p.mouseX, p.mouseY);
      startLoop(thereminLoop);
      mouseIsPressing = true;
      loopBarStart = getCurrentBar();
    };

    const releaseNote = () => {
      mouseIsPressing = false;
      isPlayback = true;
      sequenceCounter = 0;
      synth.triggerRelease();
      setTimeout(() => {
        synth.triggerAttack(pitch);
      }, 300);
      loopBarEnd = getCurrentBar();
      loopLengthBars = loopBarEnd - loopBarStart + 1;
      `z`;
    };
    const playTheremin = (x: number, y: number) => {
      // volume
      vol = p.map(y, 0, p.height, 1, 0.2);
      volKnob.gain.value = vol;
      // pitch
      prevCell = cellNum;
      cellNum = Math.floor((notes.length * x) / p.width);
      if (cellNum !== prevCell) {
        pitch = notes[cellNum];
        synth.frequency.rampTo(pitch, 0.3);
      }
      if (!prevCell) {
        pitch = notes[cellNum];
        synth.frequency.value = pitch;
      }
      // wow
      wowFreq = p.map(y, 0, p.height, 7, 3);
      wow.frequency.value = wowFreq;
    };
    const thereminLoop = new Tone.Loop(song, 1 / 30);
    startLoop(thereminLoop);
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
        <AButton
          onClick={() => {
            setIsRecording(true);
          }}
        >
          <Icon>
            <FiberManualRecord sx={{ fill: 'green' }} />
          </Icon>
        </AButton>
      </Stack>
    </>
  );
};
const recordTheremin = (
  p: p5,
  playTheremin: (x: number, y: number) => void
) => {
  sequence.x = [...sequence.x, p.mouseX];
  sequence.y = [...sequence.y, p.mouseY];
  playTheremin(p.mouseX, p.mouseY);
};

const playbackTheremin = (
  playTheremin: (x: number, y: number) => void,
  showOrb: (x: number, y: number) => void,
  p: p5
) => {
  playTheremin(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
  showOrb(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
  p.ellipse(barVisualizerPosition, p.height / 10, 40, 40);
  barVisualizerPosition =
    (barVisualizerPosition + barVisualizerSpeed(loopLengthBars, p.width)) %
    p.width;
};
