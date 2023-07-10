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
  track: Track;
  durationTicks: number;
  gridOn?: boolean;
  children?: React.ReactNode;
}

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
        p.strokeWeight(0.4);
      } else {
        p.strokeWeight(0.2);
      }
      p.line(i * spacing + 0.5, 0, i * spacing + 0.5, p.height);
      p.pop();
    }
  }
};

const drawNotes = (
  p: P5CanvasInstance<MidiAnimationProps>,
  track: Track,
  totalTicks: number,
  pg: p5.Graphics
) => {
  track.notes.forEach((note) => {
    const startPos = p.map(note.ticks, 0, totalTicks, 0, p.width);
    const endPos = p.map(
      note.ticks + note.durationTicks,
      0,
      totalTicks,
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
  let track: Track | null = null;
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
    if (props.track !== undefined) {
      track = props.track;
      console.log(track);
      //@ts-ignore
      pg?.clear();
      timeToCoverWidth = Tone.Ticks(numTicks).toSeconds();
    }
    if (props.gridOn !== undefined) {
      gridOn = props.gridOn;
    }
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
    if (track) drawNotes(p, track, numTicks, pg);
    p.image(pg, 0, 0);
    let increment = p.width / (timeToCoverWidth * p.frameRate());
    linePos += increment;
    if (track) {
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
  track,
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
          track={track}
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
