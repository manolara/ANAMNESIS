import p5 from 'p5';
import React from 'react';
import { P5Instance, ReactP5Wrapper, SketchProps } from 'react-p5-wrapper';

import * as Tone from 'tone';
// eslint-disable-next-line import/no-cycle
import {
  bassNoteToColor,
  converHeightToLeadNotes,
  findTranPoints,
  firstCell,
  flutterAndWow,
  lastCell,
  setBackground,
  setupBassSynth,
  setupLeadSynth,
} from '../utils/Doodler_utils';

export interface DoodlerProps extends SketchProps {
  bassNoteProp: string;
}

const bpm = 80;
const leadSynth = new Tone.MonoSynth();
setupLeadSynth(leadSynth);
const bassSynth = new Tone.MonoSynth().toDestination();
setupBassSynth(bassSynth);
const gridOn = false;
let mouseoff = false;
let songCounter = 0;
let xCoordinatesLine: number[] = [];
let y: number[] = [];
let bassNote: string;
const doodlerHeight = 400;
let tranPoints: number[] = [];
let noteTriggered: number;
let newLine = false;
let counter = 0;
let bcounter = 0;
let j = 0;
let bj = 0;
let rightMostX: number;
let curColor: string;
let stepArray: number[] = [];
let cnv: p5.Renderer;
function redLine(p: P5Instance<DoodlerProps>) {
  p.strokeWeight(3);
  p.stroke(175, 154, 250);

  while (xCoordinatesLine[j] < xCoordinatesLine[tranPoints[counter + 1]]) {
    p.line(xCoordinatesLine[j + 1], y[j + 1], xCoordinatesLine[j], y[j]);
    j++;
  }
}

const blackLine = (p: P5Instance<DoodlerProps>) => {
  p.strokeWeight(3);
  p.stroke(0);

  if (counter === 1) {
    bcounter = 0;
    bj = 0;
  }
  while (xCoordinatesLine[bj] < xCoordinatesLine[tranPoints[bcounter + 1]]) {
    p.line(xCoordinatesLine[bj + 1], y[bj + 1], xCoordinatesLine[bj], y[bj]);
    bj++;
  }
};
const doodlerPalette = {
  lightBlue: '#bde0fe',
  darkBlue: '#3297b6',
  green: '#bee1e6',
  orange: '#FEC89A',
  purple: '#d5c6e0',
};

const cellToPitch = (beat: number) => {
  let cellHeight = 1;
  let cellNumber = 0;

  while (cellHeight <= y[tranPoints[beat]]) {
    cellHeight += doodlerHeight / 12;
    cellNumber++;
  }

  return converHeightToLeadNotes(cellNumber);
};

function sketch(p: P5Instance<DoodlerProps>) {
  function song(time: number) {
    if (mouseoff) {
      if (songCounter === firstCell(xCoordinatesLine)) {
        bassSynth.triggerAttackRelease(bassNote, '6');
      }
    }
    if (mouseoff) {
      if (
        songCounter >= firstCell(xCoordinatesLine) &&
        songCounter <= lastCell(xCoordinatesLine)
      ) {
        leadSynth.triggerAttackRelease(
          cellToPitch(noteTriggered + 1) ?? 'C3',
          '6n',
          time
        );

        // }

        noteTriggered += 1;
        if (songCounter === lastCell(xCoordinatesLine)) {
          noteTriggered = 0;
        }
      }

      blackLine(p);
      redLine(p);

      counter = (counter + 1) % 8;
      if (newLine === false) {
        bcounter = (bcounter + 1) % 8;
      }
      songCounter = (songCounter + 1) % 8;
      // j++;
      if (counter % 8 === 0) {
        j = 0;
      }
    }
    newLine = false;
  }
  p.setup = () => {
    curColor = doodlerPalette.lightBlue;
    const gainLead = new Tone.Gain(0.85).toDestination();
    const postFilter = new Tone.Filter(2200, 'lowpass').connect(gainLead);
    const drive = new Tone.Distortion(0.3).connect(postFilter);
    leadSynth.connect(drive);
    cnv = p.createCanvas(600, 400);
    // cnv.position(p.windowWidth / 1.9, p.windowHeight / 4);
    cnv.style('border: 3px solid #8bb6da;;');

    setBackground(p, gridOn, curColor);
    p.strokeWeight(2);

    const loopBeat = new Tone.Loop(song, '4n');
    // loopBeat= new Tone.Loop(visuals, '4n');
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
    loopBeat.start(0);

    flutterAndWow(leadSynth, 9, 6, 1.6, 20);
  };
  p.updateWithProps = (props) => {
    if (bassNote !== undefined) {
      bassNote = props.bassNoteProp;
      setBackground(p, gridOn, doodlerPalette[bassNoteToColor(bassNote)]);
    } else bassNote = 'C3';
  };
  p.draw = () => {};

  p.mousePressed = () => {
    if (
      p.mouseX > 0 &&
      p.mouseX < p.width &&
      p.mouseY > 0 &&
      p.mouseY < p.height
    ) {
      xCoordinatesLine = [];
      y = [];
      stepArray = [];
      tranPoints = [];
      j = 0;
      bj = 0;
      counter = 0;
      noteTriggered = 0;

      mouseoff = false;

      rightMostX = p.mouseX;
      bcounter = 0;

      setBackground(p, gridOn, doodlerPalette[bassNoteToColor(bassNote)]);
    }
  };
  p.mouseDragged = () => {
    if (
      p.pmouseX > 0 &&
      p.mouseX < p.width &&
      p.mouseY > 0 &&
      p.mouseY < p.height
    ) {
      p.stroke(0);
      if (p.mouseX >= rightMostX) {
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        rightMostX = p.mouseX;
        xCoordinatesLine.push(p.mouseX);
        y.push(p.mouseY);
        if (p.mouseX % 75 === 0) {
          stepArray.push(p.mouseX);
        }
      }
    }
  };
  p.mouseReleased = () => {
    if (p.mouseX > 0 && p.mouseY > 0 && p.mouseY < p.height) {
      mouseoff = true;

      tranPoints = findTranPoints(xCoordinatesLine);

      songCounter = firstCell(xCoordinatesLine);
      newLine = true;
    }
  };
}

/* eslint-disable-next-line react/display-name */
export const Doodler = React.memo(({ bassNoteProp }: DoodlerProps) => {
  return <ReactP5Wrapper sketch={sketch} bassNoteProp={bassNoteProp} />;
});
