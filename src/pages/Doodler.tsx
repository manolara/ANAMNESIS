import p5 from 'p5';
import { ReactP5Wrapper, P5Instance } from 'react-p5-wrapper';

import * as Tone from 'tone';
import {
  findTranPoints,
  firstCell,
  flutterAndWow,
  lastCell,
  rootNotes,
  setBackground,
} from '../utils/Doodler';

const bpm = 80;
const leadSynth = new Tone.MonoSynth();
const bassSynth = new Tone.MonoSynth().toDestination();
const gridOn = false;
let mouseoff = false;
let songCounter = 0;
let xCoordinatesLine: number[] = [];
let y: number[] = [];
const bassNote = 1;
const doodlerWidth = 600;
const doodlerHeight = 400;
let tranPoints: number[] = [];
let noteTriggered: number;
let releaseNo = 0;
let newLine = false;
let counter = 0;
let bcounter = 0;
let j = 0;
let bj = 0;
let loopCounter = 1;
let rightMostX: number;
let curColor: p5.Color;
let stepArray: number[] = [];

function redLine(p: P5Instance) {
  p.strokeWeight(3);
  p.stroke(175, 154, 250);

  while (xCoordinatesLine[j] < xCoordinatesLine[tranPoints[counter + 1]]) {
    p.line(xCoordinatesLine[j + 1], y[j + 1], xCoordinatesLine[j], y[j]);
    j++;
  }
}

const blackLine = (p: P5Instance) => {
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
  let index1 = 1;

  while (cellHeight <= y[tranPoints[beat]]) {
    cellHeight += doodlerHeight / 12;
    cellNumber++;
    index1++;
  }

  if (cellNumber === 12) {
    return 'C4';
  }
  if (cellNumber === 11) {
    return 'D4';
  }
  if (cellNumber === 10) {
    return 'E4';
  }
  if (cellNumber === 9) {
    return 'G4';
  }
  if (cellNumber === 8) {
    return 'A4';
  }
  if (cellNumber === 7) {
    return 'B4';
  }
  if (cellNumber === 6) {
    return 'C5';
  }
  if (cellNumber === 5) {
    return 'D5';
  }
  if (cellNumber === 4) {
    return 'E5';
  }
  if (cellNumber === 3) {
    return 'G5';
  }
  if (cellNumber === 2) {
    return 'A5';
  }

  return 'B5';
};

function sketch(p: P5Instance) {
  function song(time: number) {
    if (mouseoff) {
      if (songCounter === firstCell(xCoordinatesLine)) {
        bassSynth.triggerAttackRelease(rootNotes[bassNote], '6');
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
        loopCounter++;
        console.log(loopCounter);
      }
    }
    newLine = false;
  }
  p.setup = () => {
    const startButton = p.createButton('  startTHESHITS  ');
    startButton.mousePressed(() => {
      Tone.start();
    });
    const doodlerPalette = {
      lightBlue: p.color('#bde0fe'),
      darkBlue: p.color('#3297b6'),
      green: p.color('#bee1e6'),
      orange: p.color(254, 200, 154),
      purple: p.color('#d5c6e0'),
    };
    curColor = doodlerPalette.lightBlue;
    const gainLead = new Tone.Gain(0.85).toDestination();
    const postFilter = new Tone.Filter(2200, 'lowpass').connect(gainLead);
    const drive = new Tone.Distortion(0.3).connect(postFilter);
    leadSynth.connect(drive);
    const cnv = p.createCanvas(600, 400);
    cnv.position(p.windowWidth / 1.9, p.windowHeight / 4);
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
  p.draw = () => {
    p.normalMaterial();
    p.push();
    p.rotateZ(p.frameCount * 0.01);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.plane(100);
    p.pop();
  };

  p.mousePressed = () => {
    xCoordinatesLine = [];
    y = [];
    if (
      p.mouseX > 0 &&
      p.mouseX < p.width &&
      p.mouseY > 0 &&
      p.mouseY < p.height
    ) {
      stepArray = [];
      tranPoints = [];
      j = 0;
      bj = 0;
      counter = 0;
      noteTriggered = 0;

      mouseoff = false;

      rightMostX = p.mouseX;
      bcounter = 0;
      loopCounter = 1;

      setBackground(p, gridOn, curColor);
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
      if (p.mouseX >= rightMostX && p.pmouseX >= rightMostX) {
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        rightMostX = p.mouseX;
        xCoordinatesLine.push(p.mouseX);
        y.push(p.mouseY);
        if (p.mouseX % 75 === 0) {
          stepArray.push(p.mouseX);
        }
      }
    }
    console.log('yo', p.pmouseX);
  };

  p.mouseReleased = () => {
    if (releaseNo >= 1) {
      if (p.mouseX > 0 && p.mouseY > 0 && p.mouseY < p.height) {
        mouseoff = true;

        tranPoints = findTranPoints(xCoordinatesLine);

        songCounter = firstCell(xCoordinatesLine);

        newLine = true;
      }
    }
    releaseNo += 1;
  };
}

export function Doodler() {
  return <ReactP5Wrapper sketch={sketch} />;
}
