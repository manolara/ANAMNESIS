import { Midi, Track } from '@tonejs/midi';
import * as Tone from 'tone';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { Box, darken } from '@mui/material';
import p5 from 'p5';
import { getCurrentBeat } from '../../utils/utils';
import { useState } from 'react';
import { AButton } from '../../theme';
import { Stack } from '@mui/system';

interface MidiAnimationProps extends SketchProps {
  midi: Midi;
  durationTicks: number;
  gridOn?: boolean;
  children?: React.ReactNode;
}

//midi grid for midi sequence

const drawBackground = (
  p: P5CanvasInstance<MidiAnimationProps>,
  gridOn: boolean
) => {
  let spacing = p.width / 16;

  p.background(pallette.background);
  if (gridOn) {
    for (let i = 0; i < 16; i++) {
      p.push();
      p.stroke(100);

      if (i % 4 === 0) {
        p.strokeWeight(0.1);
      } else {
        p.strokeWeight(0.1);
      }
      p.line(i * spacing + 0.5, 0, i * spacing + 0.5, p.height);
      p.pop();
    }
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
    pg.fill(pallette.notes);
    pg.noStroke();
    pg.rect(startPos, noteHeight, endPos - startPos, 10);
  });
};

const sketch = (p: P5CanvasInstance<MidiAnimationProps>) => {
  let gridOn = false;
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
    drawBackground(p, gridOn);
  };
  p.updateWithProps = (props) => {
    if (props.midi !== undefined) {
      midi = props.midi;
      timeToCoverWidth = Tone.Ticks(numTicks).toSeconds();
      console.log(midi.durationTicks, 'midi.durationTicks');
    }
    if (props.gridOn !== undefined) {
      gridOn = props.gridOn;
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
    drawBackground(p, gridOn);
    if (midi) drawNotes(p, midi.tracks[0], numTicks, pg);

    p.image(pg, 0, 0);
    let increment = p.width / (timeToCoverWidth * p.frameRate());
    linePos += increment;
    if (midi) {
      pgLine.stroke(pallette.line);
      pgLine.strokeWeight(1);
      pgLine.line(linePos, 0, linePos, p.height);
    }
    p.image(pgLine, 0, 0);
    if (linePos >= p.width) {
      resetLine = false;
    }
  };
};
export const MidiAnimation = ({
  midi,
  durationTicks,
  children,
}: MidiAnimationProps) => {
  const [gridOn, setGridOn] = useState(false);
  return (
    <Stack m={1} width={'403px'}>
      <Box
        sx={{
          border: `2px solid ${pallette.line}`,
          width: '400px',
          height: '400px',
        }}
      >
        <ReactP5Wrapper
          sketch={sketch}
          midi={midi}
          duratioTicks={durationTicks}
          gridOn={gridOn}
        />
      </Box>
      <Stack direction={'row'} alignItems={'center'} pt={1}>
        {children}
        <AButton
          sx={{
            ml: 'auto',
            width: 'fit-content',
            fontSize: 10,

            backgroundColor: pallette.button,
            '&:hover': {
              boxShadow: `inset 100rem 0 0 0 ${darken(pallette.button, 0.1)}`,
            },
          }}
          onClick={() => setGridOn((prev) => !prev)}
        >
          {gridOn ? 'Grid Off' : 'Grid On'}
        </AButton>
      </Stack>
    </Stack>
  );
};

const pallette = {
  notes: '#CCD5AE',
  lightGreen: '#E9EDC9',
  background: '#F5F1E0',
  between: '#FAEDCD',
  line: darken('#FAEDCD', 0.2),
  button: '#CCD5AE',
};
