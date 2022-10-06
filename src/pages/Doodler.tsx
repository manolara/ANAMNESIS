import p5Types from 'p5';

import * as Tone from 'tone';

let mySynth: Tone.MonoSynth;
let x = [];
let y = [];
let stepArray = [];
const bpm = 80;
let loopBeat;
let mouseoff = false;
let counter = 0;
let bcounter = 0;
let newLine = false;
let tranPoints = [];
let j = 0;
let bj = 0;
songCounter = 0;
let noteTriggered;
let loopCounter = 1;
let bassNote = 1;

let curColor;
let gridOn = false;

let xPos = 1;
let releaseNo = 0;

function flutterAndWow(
  flutFreq: number,
  flutRange: number,
  wowFreq: number,
  wowRange: number
) {
  const flutter = new Tone.LFO(flutFreq, -flutRange, flutRange);

  const wow = new Tone.LFO(wowFreq, -wowRange, wowRange);
  // changing lfo setting
  flutter.connect(mySynth.detune);
  wow.connect(mySynth.detune);
  flutter.start();
  wow.start();
}

export const Doodler = (p) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    // color assignment
    const lightBlue = p5.color('#bde0fe');
    const darkBlue = color('#3297b6');
    const green = color('#bee1e6');
    // const green = color("#bcdee4");
    const orange = color(254, 200, 154);
    const purple = color('#d5c6e0');
    curColor = lightBlue;

    const I = createButton('  I  ');
    I.position(windowWidth / 1.9, windowHeight / 4 + 425);
    I.class('buttons');
    I.mousePressed(() => {
      bassNote = 1;
      curColor = lightBlue;
      setMatrix(p5);
    });
    const II = createButton('  II  ');
    II.position(windowWidth / 1.9 + 22, windowHeight / 4 + 425);
    II.class('buttons');
    II.mousePressed(() => {
      bassNote = 2;
      curColor = darkBlue;
      setMatrix();
    });

    const IV = createButton('  IV  ');
    IV.position(windowWidth / 1.9 + 45 + 6, windowHeight / 4 + 425);
    IV.class('buttons');
    IV.mousePressed(() => {
      bassNote = 4;
      curColor = purple;
      setMatrix();
    });
    const V = createButton('  V  ');
    V.position(windowWidth / 1.9 + 80 + 10, windowHeight / 4 + 425);
    V.class('buttons');
    V.mousePressed(() => {
      bassNote = 5;
      curColor = orange;
      setMatrix();
    });
    const VI = createButton('  VI  ');
    VI.position(windowWidth / 1.9 + 107 + 14, windowHeight / 4 + 425);
    VI.class('buttons');
    VI.mousePressed(() => {
      bassNote = 6;
      curColor = green;
      setMatrix();
    });
    const gridToggle = createButton('Grid on OFF');
    gridToggle.position(windowWidth / 1.9 + 508, windowHeight / 4 + 425);
    gridToggle.class('buttons');
    gridToggle.style('font-size: 15px;');
    gridToggle.mousePressed(() => {
      gridOn = !gridOn;
      console.log(gridOn);
      setMatrix();
    });

    // synth
    mySynth = new Tone.MonoSynth();

    mySynth.set({
      voice: Tone.MonoSynth,

      oscillator: {
        type: 'sawtooth', //
      },

      envelope: {
        attack: 0.0098,
        decay: 60,
        sustain: 0.9,
        release: 4,
      },

      filter: {
        Q: 3,
        // frequency : 10,
        type: 'lowpass',
        rolloff: -12,
      },

      filterEnvelope: {
        attack: 0.0098,
        decay: 0.8,
        sustain: 0.8,
        release: 3,
        baseFrequency: 100,
        octaves: 1,
        exponent: 2,
      },
    });

    const bassSynth = new Tone.MonoSynth().toDestination();

    bassSynth.set({
      oscillator: {
        type: 'sawtooth', //
      },

      envelope: {
        attack: 0.0098,
        decay: 10,
        sustain: 0.1,
        release: 2.49,
      },

      filter: {
        Q: 3,
        // frequency : 10,
        type: 'lowpass',
        rolloff: -12,
      },

      filterEnvelope: {
        attack: 0.0098,
        decay: 0.8,
        sustain: 0.9,
        release: 2,
        baseFrequency: 100,
        octaves: 1,
        exponent: 2,
      },
    });

    const gainLead = new Tone.Gain(0.85).toDestination();

    const postFilter = new Tone.Filter(2200, 'lowpass').connect(gainLead);
    const drive = new Tone.Distortion(0.3).connect(postFilter);
    mySynth.connect(drive);

    const cnv = p5.createCanvas(600, 400).parent(canvasParentRef);
    cnv.position(p5.windowWidth / 1.9, p5.windowHeight / 4);
    cnv.style('border: 3px solid #8bb6da;;');

    setMatrix();

    p5.strokeWeight(2);

    loopBeat = new Tone.Loop(song, '4n');
    // loopBeat= new Tone.Loop(visuals, '4n');
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
    loopBeat.start(0);

    flutterAndWow(9, 6, 1.6, 20);
  };

  function draw() {
    xPos = ((xPos + 1) % 600) + 1;
  }

  function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      x = [];
      y = [];
      stepArray = [];
      tranPoints = [];
      j = 0;
      bj = 0;
      counter = 0;
      noteTriggered = 0;

      mouseoff = false;

      rightMostX = mouseX;
      bcounter = 0;
      drawer = 0;
      loopCounter = 1;

      // mySynth.triggerAttack("A4");
      setMatrix();
    }
  }

  function mouseReleased() {
    if (releaseNo >= 1) {
      if (mouseX > 0 && mouseY > 0 && mouseY < height) {
        step = Math.round(x.length * 0.1);
        // console.log("step", step);
        // console.log(x[index]);
        mouseoff = true;
        console.log('firstcell is', firstCell());
        console.log('lastcell is', lastCell());
        findTranPoints();
        console.log(tranPoints);
        songCounter = firstCell();
        newLine = true;
      }
    }
    releaseNo += 1;
  }

  function mouseDragged() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      stroke(0);
      if (mouseX >= rightMostX && pmouseX >= rightMostX) {
        line(pmouseX, pmouseY, mouseX, mouseY);
        rightMostX = mouseX;
        x.push(mouseX);
        y.push(mouseY);
        if (mouseX % 75 === 0) {
          stepArray.push(mouseX);
        }
      }
    }
  }

  function redLine() {
    strokeWeight(3);
    stroke(175, 154, 250);

    while (x[j] < x[tranPoints[counter + 1]]) {
      line(x[j + 1], y[j + 1], x[j], y[j]);
      j++;
    }
  }
  function blackLine() {
    strokeWeight(3);
    stroke(0);

    if (counter === 1) {
      bcounter = 0;
      bj = 0;
    }
    while (x[bj] < x[tranPoints[bcounter + 1]]) {
      line(x[bj + 1], y[bj + 1], x[bj], y[bj]);
      bj++;
    }
  }

  function song(time) {
    // counter=counter%(stepArray.length-1)
    if (mouseoff === true) {
      if (songCounter == firstCell()) {
        bassSynth.triggerAttackRelease(playRoot(bassNote), '6');
      }
    }
    if (mouseoff === true) {
      if (songCounter >= firstCell() && songCounter <= lastCell()) {
        // if(cellToPitch(noteTriggered + 1)!==cellToPitch(noteTriggered )){
        mySynth.triggerAttackRelease(
          cellToPitch(noteTriggered + 1),
          '6n',
          time
        );
        // }

        noteTriggered += 1;
        if (songCounter === lastCell()) {
          noteTriggered = 0;
        }
      }

      blackLine();
      redLine();

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

  function firstCell() {
    if (x.length !== 0) {
      // console.log(x[0]);

      let index = 1;
      while (index * 75 < x[0]) {
        index++;
      }
      return index - 1;
    }
    return 'not yet';
  }

  function lastCell() {
    if (x.length !== 0) {
      //  console.log(x[x.length - 1]);

      let index = 1;
      while (index * 75 < x[x.length - 1]) {
        index++;
      }
      return index - 1;
    }
    return 'not yet';
  }

  function findTranPoints() {
    for (let i = 1; i < 9; i++) {
      for (let j = 0; j < x.length; j++) {
        if (x[j + 1] > i * 75 && x[j] <= i * 75) {
          if (x[j] === i * 75) {
            tranPoints.push(j);
          } else {
            tranPoints.push(j + 1);
          }
        }
      }
    }
    tranPoints.unshift(0);
    tranPoints.push(x.length - 1);
  }

  function cellToPitch(beat) {
    let cellHeight = 1;
    let cellNumber = 0;
    let index1 = 1;

    while (cellHeight <= y[tranPoints[beat]]) {
      cellHeight += height / 12;
      cellNumber++;
      index1++;
    }
    // cellHeight= Math.floor(cellHeight/ (height/12));
    // console.log('cellheightis',cellHeight);

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
    if (cellNumber === 1) {
      console.log('yo');
      return 'B5';
    }
  }

  function playRoot(roman) {
    if (roman == 1) {
      return 'C3';
    }
    if (roman == 2) {
      return 'D3';
    }
    if (roman == 4) {
      return 'F3';
    }
    if (roman == 5) {
      return 'G3';
    }
    if (roman == 6) {
      return 'A3';
    }
  }

  function doGradient() {
    timeLeft = (width - initialX) / rectVel;
    console.log(timeLeft);

    for (let i = start; i < start + 150; i++) {
      n = map(i, start, start + 150, 0, 1);
      const lineColor = lerpColor(leftColor, rightColor, n);
      stroke(lineColor);
      line(i, 0, i, height);
    }
    const gradVel = width / timeLeft;

    if (start >= width) {
      background(leftColor);
    } else {
      start += width / timeLeft;
    }
  }
};
