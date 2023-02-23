import p5 from 'p5';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';

import * as Tone from 'tone';
import { Loop } from 'tone';
// eslint-disable-next-line import/no-cycle
import {
  bassNoteToColor,
  convertHeightToLeadNotes,
  findTranPoints,
  firstCell,
  flutterAndWow,
  lastCell,
  setBackground,
  setupBassSynth,
  setupLeadSynth,
} from '../utils/Doodler_utils';
import { getCurrentBeat, startLoop } from '../utils/utils';

export interface InputDoodlerProps extends SketchProps {
  bassNoteProp: string;
  zoomFactor: number;
  soundSource?: Tone.PolySynth;
  test?: object;
}
export interface DoodlerProps extends SketchProps {
  bassNoteProp: string;
  zoomFactor: number;
  soundSource?: () => Tone.PolySynth;
  test?: object;
}

const doodlerPalette = {
  lightBlue: '#bde0fe',
  darkBlue: '#3297b6',
  green: '#bee1e6',
  orange: '#FEC89A',
  purple: '#d5c6e0',
};
function sketch(p: P5CanvasInstance<DoodlerProps>) {
  let leadSynth: Tone.PolySynth | Tone.MonoSynth = new Tone.MonoSynth();
  let loopLengthBars = 2;
  setupLeadSynth(leadSynth as Tone.MonoSynth);
  const bassSynth = new Tone.MonoSynth({ volume: -3 }).toDestination();
  setupBassSynth(bassSynth);
  const gridOn = false;
  let mouseoff = true;
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
  let currentBar: number;
  let zoomFactor: number;
  let sc_mouseX: number;
  let sc_mouseY: number;
  let sc_pmouseX: number;
  let sc_pmouseY: number;
  const loopBeat = new Tone.Loop(song, '4n');
  function redLine(p: P5CanvasInstance<DoodlerProps>) {
    p.strokeWeight(3);
    p.stroke(175, 154, 250);

    while (xCoordinatesLine[j] < xCoordinatesLine[tranPoints[counter + 1]]) {
      p.line(xCoordinatesLine[j + 1], y[j + 1], xCoordinatesLine[j], y[j]);
      j++;
    }
  }

  const blackLine = (p: P5CanvasInstance<DoodlerProps>) => {
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
  const cellToPitch = (beat: number) => {
    let cellHeight = 1;
    let cellNumber = 0;

    while (cellHeight <= y[tranPoints[beat]]) {
      cellHeight += doodlerHeight / 12;
      cellNumber++;
    }

    return convertHeightToLeadNotes(cellNumber);
  };

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

        noteTriggered += 1;
        if (songCounter === lastCell(xCoordinatesLine)) {
          noteTriggered = 0;
        }
      }

      blackLine(p);
      redLine(p);

      currentBar = Math.floor(songCounter / 4);
      counter = (counter + 1) % (4 * loopLengthBars);
      if (newLine === false) {
        bcounter = (bcounter + 1) % (4 * loopLengthBars);
      }
      songCounter = (songCounter + 1) % (4 * loopLengthBars);
      if (counter % 8 === 0) {
        j = 0;
      }
    }
    newLine = false;

    console.log(currentBar);
  }
  p.setup = () => {
    curColor = doodlerPalette.lightBlue;
    const gainLead = new Tone.Gain(0.6).toDestination();
    const postFilter = new Tone.Filter(2200, 'lowpass').connect(gainLead);
    const drive = new Tone.Distortion(0.3).connect(postFilter);
    leadSynth.connect(drive);
    cnv = p.createCanvas(600, 400);
    // cnv.position(p.windowWidth / 1.9, p.windowHeight / 4);
    cnv.style('border: 3px solid #8bb6da;;');
    console.log('setup');
    setBackground(p, gridOn, curColor);
    p.strokeWeight(2);
    cnv.mousePressed(doodlerPressed);

    leadSynth instanceof Tone.MonoSynth
      ? flutterAndWow(leadSynth, 9, 6, 1.6, 20)
      : null;
  };
  p.updateWithProps = (props: any) => {
    if (bassNote !== undefined) {
      bassNote = props.bassNoteProp;
      setBackground(p, gridOn, doodlerPalette[bassNoteToColor(bassNote)]);
    } else bassNote = 'C3';

    if (props.zoomFactor !== undefined) {
      zoomFactor = props.zoomFactor;
    }
    if (props.soundSource() !== undefined) {
      leadSynth = props.soundSource();
    }
  };
  p.draw = () => {
    sc_mouseX = p.mouseX / zoomFactor;
    sc_mouseY = p.mouseY / zoomFactor;
    sc_pmouseX = p.pmouseX / zoomFactor;
    sc_pmouseY = p.pmouseY / zoomFactor;
  };

  const doodlerPressed = () => {
    Tone.start();

    xCoordinatesLine = [];
    y = [];
    stepArray = [];
    tranPoints = [];
    j = 0;
    bj = 0;
    counter = 0;
    noteTriggered = 0;

    mouseoff = false;

    rightMostX = sc_mouseX;
    bcounter = 0;

    setBackground(p, gridOn, doodlerPalette[bassNoteToColor(bassNote)]);
  };

  p.mouseReleased = () => {
    if (
      sc_mouseX > 0 &&
      sc_mouseY > 0 &&
      sc_mouseY < p.height &&
      mouseoff === false
    ) {
      mouseoff = true;

      tranPoints = findTranPoints(xCoordinatesLine);

      songCounter = firstCell(xCoordinatesLine);
      newLine = true;
      console.log(loopBeat.state, 'loopBeat.state');
      startLoop(loopBeat, '1m');
    }
  };

  p.mouseDragged = () => {
    if (
      sc_pmouseX > 0 &&
      sc_mouseX < p.width &&
      sc_mouseY > 0 &&
      sc_mouseY < p.height
    ) {
      p.stroke(0);
      if (sc_mouseX >= rightMostX) {
        p.line(sc_pmouseX, sc_pmouseY, sc_mouseX, sc_mouseY);
        rightMostX = sc_mouseX;
        xCoordinatesLine.push(sc_mouseX);
        y.push(sc_mouseY);
        if (sc_mouseX % 75 === 0) {
          stepArray.push(sc_mouseX);
        }
      }
    }
  };
}

export const PGDoodler = ({
  bassNoteProp,
  zoomFactor,
  soundSource,
}: DoodlerProps) => {
  const soundSourceFn = useCallback(() => soundSource, [soundSource]);

  return (
    <ReactP5Wrapper
      sketch={sketch}
      bassNoteProp={bassNoteProp}
      zoomFactor={zoomFactor}
      soundSource={soundSourceFn}
    />
  );
};
