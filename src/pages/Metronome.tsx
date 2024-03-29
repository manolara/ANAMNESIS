import * as Tone from 'tone';
import p5 from 'p5';
import { ReactP5Wrapper, Sketch } from 'react-p5-wrapper';
import { getCurrentBeat, startLoop } from '../utils/utils';
import { Box } from '@mui/material';
let cnv: p5.Renderer;

let metronomeColor = {
  on: '#DCB8FF',
  off: '#CAB8DB',
};
let curColor = metronomeColor.off;

const sketch: Sketch = (p) => {
  const metronome = new Tone.MetalSynth().toDestination();
  metronome.envelope.decay = 0.1;
  const metronomeLoop = new Tone.Loop((time) => {
    let curBeat = getCurrentBeat();
    if (+curBeat === 0) {
      metronome.triggerAttackRelease('G2', '8n', time, 0.15);
    } else metronome.triggerAttackRelease('c2', '16n', time, 0.08);
  }, '4n').start(0);
  metronomeLoop.stop();
  p.setup = () => {
    cnv = p.createCanvas(60, 40);
    cnv.mouseClicked(metronomeClicked);
    cnv.mouseOver(() => p.cursor(p.HAND));
    p.background(curColor);
    cnv.class('metronome');

    p.noStroke();
    p.circle(p.width / 3 - 3, p.height / 2, 10);
    p.circle((2 * p.width) / 3 + 3, p.height / 2, 10);
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        handleAnimation(p);
      }, time);
    }, '4n');
  };

  p.draw = () => {};
  const metronomeClicked = () => {
    if (metronomeLoop.state === 'stopped') {
      Tone.start();
      startLoop(metronomeLoop, '+n');
      curColor = metronomeColor.on;
    } else {
      metronomeLoop.stop();
      curColor = metronomeColor.off;
    }
  };
};

export const Metronome = () => {
  return (
    <Box maxHeight="35px">
      <ReactP5Wrapper sketch={sketch} />
    </Box>
  );
};
const handleAnimation = (p: p5) => {
  p.background(curColor);
  let currentBeat = getCurrentBeat();
  if (currentBeat % 2 === 0) {
    p.circle((2 * p.width) / 3 + 3, p.height / 2, 10);
  } else {
    p.circle(p.width / 3 - 3, p.height / 2, 10);
  }
};
