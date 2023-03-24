import { Midi, Track } from '@tonejs/midi';
import * as Tone from 'tone';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { Box } from '@mui/material';
import p5 from 'p5';
import { getCurrentBeat } from '../../utils/utils';

interface MidiAnimationProps extends SketchProps {
  midi: Midi;
  durationTicks: number;
}

//midi grid for midi sequence

const drawBackground = (p: P5CanvasInstance<MidiAnimationProps>) => {
  let spacing = p.width / 16;

  p.background(255);
  for (let i = 0; i < 16; i++) {
    p.push();

    if (i % 4 === 0) {
      p.strokeWeight(0.5);
    } else {
      p.strokeWeight(0.1);
    }
    p.line(i * spacing, 0, i * spacing, p.height);
    p.pop();
  }
};

const drawNotes = (
  p: P5CanvasInstance<MidiAnimationProps>,
  track: Track,
  durationTicks: number,
  pg: p5.Graphics
) => {
  track.notes.forEach((note) => {
    const startPos = p.map(note.ticks, 0, durationTicks, 0, p.width);
    const endPos = p.map(
      note.ticks + note.durationTicks,
      0,
      durationTicks,
      0,
      p.width
    );
    const noteHeight = p.map(note.midi, 0, 127, p.height, 0);
    pg.fill(0);
    pg.noStroke();
    pg.rect(startPos, noteHeight, endPos - startPos, 10);
  });
};

const sketch = (p: P5CanvasInstance<MidiAnimationProps>) => {
  let resetLine = false;
  let numTicks = Tone.Transport.PPQ * 4;
  let midi: Midi | null = null;
  let pg: p5.Graphics;
  let pgLine: p5.Graphics;
  let linePos: number;
  let timeToCoverWidth: number;
  p.setup = () => {
    p.createCanvas(400, 400);
    pg = p.createGraphics(p.width, p.height);
    pgLine = p.createGraphics(p.width, p.height);
    pgLine.frameRate(30);
    drawBackground(p);
  };
  p.updateWithProps = (props) => {
    if (midi !== undefined) {
      midi = props.midi;
      timeToCoverWidth = Tone.Ticks(numTicks).toSeconds();
      console.log(midi.durationTicks, 'midi.durationTicks');

      const track = midi.tracks[0];
      const durationTicks = midi?.durationTicks;
      //map notes to grid and draw them
      // drawNotes(p, track, durationTicks, pg);
      linePos = 0;
    }

    //draw a grid for every 4th tick
  };
  p.draw = () => {
    if (getCurrentBeat() === 0 && !resetLine) {
      linePos = 0;
      resetLine = true;
    }
    pg.fill(0);
    //@ts-ignore
    pgLine.clear();
    drawBackground(p);
    if (midi) drawNotes(p, midi.tracks[0], numTicks, pg);

    pg.rect(19, 10, 100, 100);
    p.image(pg, 0, 0);
    let increment = p.width / (timeToCoverWidth * p.frameRate());
    linePos += increment;
    console.log(
      linePos,
      'linePos',
      timeToCoverWidth,
      'timeToCoverWidth',
      increment,
      'increment'
    );
    if (midi) {
      pgLine.stroke(0);
      pgLine.strokeWeight(0.5);
      pgLine.line(linePos, 0, linePos, p.height);
    }
    p.image(pgLine, 0, 0);
    if (linePos >= p.width) {
      resetLine = false;
    }
  };
};
export const MidiAnimation = ({ midi, durationTicks }: MidiAnimationProps) => {
  return (
    <Box p={'30px'}>
      <ReactP5Wrapper
        sketch={sketch}
        midi={midi}
        duratioTicks={durationTicks}
      />
    </Box>
  );
};
