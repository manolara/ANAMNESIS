/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-return-assign */
import { FiberManualRecord } from '@mui/icons-material';
import { Autocomplete, Icon, Stack, TextField } from '@mui/material';
import p5 from 'p5';
import { useState } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import * as Tone from 'tone';
import { AButton, APalette } from '../theme';
import { barVisualizerSpeed, getCurrentBar } from '../utils/utils';

const canvasHeight = 500;
const canvasWidth = 700;
let outVol = 0.5;
let vol = -60;
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
  mouseOn: boolean[];
}
let sequence: SequenceType = {
  x: [],
  y: [],
  mouseOn: [],
};
let sequenceCounter: number;

let loopLengthBars = 1;
let barVisualizerPosition: number = 0;

/// TONE.js///////
const volKnob = new Tone.Gain();
const synth = new Tone.MonoSynth({
  oscillator: {
    type: 'triangle',
  },
}).connect(volKnob);

const thereminOut = new Tone.Gain(outVol).toDestination();

volKnob.connect(thereminOut);

let notes: string[] = [];

const setNotes = (oct: number) => {
  notes = [
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
};

interface ThereminProps extends SketchProps {
  octave?: number;
  thereminState?: string;
  recordingLength?: number;
}

const sketch = (p: P5CanvasInstance<ThereminProps>) => {
  let oct = 4;
  let recordingLength = 1;
  let thereminState = 'idle';

  let mainLoop = new Tone.Loop((time) => {
    drawBackground();

    if (thereminState === 'recording') {
      drawBackground();
      recordTheremin(p, playTheremin);
    }
    if (thereminState === 'playback') {
      playbackTheremin(playTheremin, showOrb, p);
      sequenceCounter = (sequenceCounter + 1) % sequence.x.length;
    }
  }, 1 / 30);
  const song = () => {
    console.log('started');
    sequenceCounter = 0;
    mainLoop.stop();
    mainLoop.start();
  };

  const playbackTheremin = (
    playTheremin: (x: number, y: number) => void,
    showOrb: (x: number, y: number) => void,
    p: p5
  ) => {
    playTheremin(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
    showOrb(sequence.x[sequenceCounter], sequence.y[sequenceCounter]);
    let prev =
      sequenceCounter !== 0 ? sequenceCounter - 1 : sequence.mouseOn.length - 1;
    if (sequence.mouseOn[sequenceCounter] && !sequence.mouseOn[prev]) {
      synth.triggerAttack(pitch);
    }
    if (!sequence.mouseOn[sequenceCounter] && sequence.mouseOn[prev]) {
      synth.triggerRelease();
    }
    p.ellipse(barVisualizerPosition, p.height / 10, 40, 40);
    barVisualizerPosition =
      (barVisualizerPosition + barVisualizerSpeed(loopLengthBars, p.width)) %
      p.width;
  };
  const recordTheremin = (
    p: p5,
    playTheremin: (x: number, y: number) => void
  ) => {
    sequence.x = [...sequence.x, p.mouseX];
    sequence.y = [...sequence.y, p.mouseY];
    sequence.mouseOn = [...sequence.mouseOn, p.mouseIsPressed];
    playTheremin(p.mouseX, p.mouseY);
    showOrb(p.mouseX, p.mouseY);
  };

  p.setup = () => {
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    cnv.mousePressed(canvasPressed);

    setNotes(oct);
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
    // const mouseOnPrint = p.createButton('Check MouseON');
    // mouseOnPrint.mouseClicked(() => console.log(sequence.mouseOn));
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
    stroke += glow * glow2ndgrad * 1.7;

    p.push();
    p.stroke('#ffb8b8');
    p.strokeWeight(stroke);
    p.fill('#ffb8b8');
    p.circle(x, y, size);
    p.pop();
  };

  p.draw = () => {
    if (thereminState === 'idle') {
      drawBackground();
      showOrb(p.mouseX, p.mouseY);
      playTheremin(p.mouseX, p.mouseY);
    }
  };
  p.updateWithProps = (props: ThereminProps) => {
    if (props.octave) {
      oct = props.octave;
    }
    if (props.recordingLength) {
      recordingLength = props.recordingLength;
    }
    if (props.thereminState) {
      thereminState = props.thereminState;
      thereminLoop.interval = `${recordingLength}m`;
    }
    if (thereminState === 'recording') {
      thereminLoop.start();
    }
    if (thereminState === 'playback' && !(props.thereminState === 'playback')) {
      sequenceCounter = 0;
    }
    if (thereminState === 'idle') {
      thereminLoop.stop();
      mainLoop.stop();
      synth.triggerRelease();
      sequence.x = [];
      sequence.y = [];
      sequence.mouseOn = [];
    }
  };

  const canvasPressed = () => {
    synth.triggerAttack(pitch);
    playTheremin(p.mouseX, p.mouseY);
  };

  const releaseNote = () => {
    if (thereminState !== 'playback') synth.triggerRelease();
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
  const thereminLoop = new Tone.Loop(song, `${recordingLength}m`);
};

export const ThereminWithoutState = () => {
  const [thereminState, setThereminState] = useState('idle');
  const [octave, setOctave] = useState(4);
  const [recordingLength, setRecordingLength] = useState(1);
  const barLenghts = [1, 2, 4, 8];
  return (
    <Stack width={`${canvasWidth}px`}>
      <ReactP5Wrapper
        sketch={sketch}
        thereminState={thereminState}
        octave={octave}
        recordingLength={recordingLength}
      />
      <Stack direction="row" width="100%" pt={0.5}>
        <Stack direction="row" spacing={2}>
          <AButton
            onClick={() => {
              setOctave(octave - 1);
              setNotes(octave);
            }}
          >
            oct --1
          </AButton>
          <AButton
            onClick={() => {
              setOctave(octave + 1);
              setNotes(octave);
            }}
          >
            oct +1
          </AButton>
          <Autocomplete
            disablePortal
            defaultValue={'1'}
            id="bar-length"
            options={barLenghts.map(String)}
            onChange={(e, value) => {
              if (value) {
                setRecordingLength(+value);
              }
            }}
            sx={{
              px: 3,
              pb: 1.5,
              pt: 0.5,
              width: 130,
              backgroundColor: APalette.pink,
            }}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                InputProps={{ ...params.InputProps, style: { fontSize: 12 } }}
                label="Bar Length"
              />
            )}
          />
          <AButton
            onClick={() => {
              setThereminState('idle');
            }}
            sx={{ fontSize: 15, backgroundColor: '#b8b9ff' }}
          >
            clear
          </AButton>
        </Stack>

        <AButton
          sx={{ ml: 'auto' }}
          onClick={() => {
            if (Tone.Transport.state === 'stopped') {
              Tone.Transport.start();
            }

            let start = getCurrentBar() + 1;
            let end = start + recordingLength;

            Tone.Transport.schedule(() => {
              setThereminState('recording');
            }, `${start}:0:0`);

            Tone.Transport.schedule(() => {
              setThereminState('playback');
            }, `${end}:0:0`);
          }}
        >
          <Icon>
            <FiberManualRecord
              sx={{
                fill: thereminState === 'recording' ? 'red' : '',
              }}
            />
          </Icon>
        </AButton>
      </Stack>
    </Stack>
  );
};

/*
1. idle fuck around attack and release based on click
2. record: record mouse state @end-> if still pressed dont do anything, if released -> dont do anything (already released and will trigger when the mouseOn array says so)
2.5 try to check wether syncing to the tick instead of 1/30 would be better.
3. make a synth class to that both triggers the attack and holds the state of the attack.
*/
