import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import { APalette } from '../theme';
import * as Tone from 'tone';

const sketch = (p: P5CanvasInstance) => {
  // define a planet class
  class Planet {
    constructor(
      public x: number,
      public y: number,
      public radius: number,
      public color: string,
      public orbitRadius: number,
      public orbitSpeed: number,
      public orbitAngle: number,
      public orbitDirection: number
    ) {}
    draw() {
      p.fill(this.color);
      p.noStroke();
      p.circle(this.x, this.y, this.radius);
    }
    orbit() {
      this.orbitAngle += this.orbitSpeed * this.orbitDirection;
      this.x = this.orbitRadius * p.cos(this.orbitAngle);
      this.y = this.orbitRadius * p.sin(this.orbitAngle);
    }
  }

  const notes = [`A3`, `C4`, `D4`, `E4`, `E4`, `G4`, `B4`, `C5`];
  //create a synth and connect and increase release
  let synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.5, release: 2 },
  });
  let reverb = new Tone.Reverb({ decay: 5, wet: 0.8 });
  synth.chain(reverb, Tone.Destination);
  synth.volume.value = -6;

  let lineAngle = 0;
  let x = 0;
  let y = 0;
  let framerate = 60;
  let planets: Planet[] = [];
  p.setup = () => {
    p.createCanvas(300, 300);
    p.background('#fbe0ca');
    p.frameRate(framerate);
    p.angleMode(p.DEGREES);
    //push 5 planets at random positions
    for (let i = 0; i < 5; i++) {
      let radius = 10;
      let orbitRadius = p.random(50, 100);
      let orbitSpeed = p.random(
        (0.01 * 180) / p.TWO_PI,
        (0.1 * 180) / p.TWO_PI
      );
      let orbitAngle = p.random(0, 360);
      let orbitDirection = p.random([-1, 1]);
      let color = APalette.lofi;
      let x = orbitRadius * p.cos(orbitAngle);
      let y = orbitRadius * p.sin(orbitAngle);
      planets.push(
        new Planet(
          x,
          y,
          radius,
          color,
          orbitRadius,
          orbitSpeed,
          orbitAngle,
          orbitDirection
        )
      );
    }
  };
  p.draw = () => {
    //line that starts from middle and rotates counter clockwise
    p.background('#fbe0ca');
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.fill('#ddc7f7');
    p.noStroke();
    p.circle(0, 0, 50);
    p.stroke('#ddc7f7');
    p.strokeWeight(2);
    lineAngle = (lineAngle + 0.5) % 360;
    p.rotate(-lineAngle);
    p.line(0, 0, p.width, 0);
    p.pop();
    //draw planets
    p.translate(p.width / 2, p.height / 2);

    planets.forEach((planet) => {
      let planetAngle =
        p.floor(p.atan2(-planet.y, planet.x)) < 0
          ? p.floor(p.atan2(-planet.y, planet.x)) + 360
          : p.floor(p.atan2(-planet.y, planet.x));
      //console.log('planetAngle', planetAngle, 'lineAngle', lineAngle);
      if (p.abs(lineAngle - planetAngle) < 2) {
        //map orbit angle to midi note
        let note =
          notes[p.floor(p.map(planet.orbitRadius, 50, 100, 0, notes.length))];
        synth.triggerAttackRelease(note, '16n');
      }

      planet.draw();
      planet.orbit();
    });
  };
};

export const Planets = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};
