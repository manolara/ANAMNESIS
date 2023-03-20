import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { APalette } from '../theme';
import * as Tone from 'tone';
import { darken, Slider, Stack } from '@mui/material';
import { useState } from 'react';

interface PlanetProps extends SketchProps {
  viscosity: number;
}

const sketch = (p: P5CanvasInstance<PlanetProps>) => {
  let viscosity = 1;
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
      this.orbitAngle += this.orbitSpeed * viscosity * this.orbitDirection;
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

  p.updateWithProps = (props: PlanetProps) => {
    if (props.viscosity !== undefined) viscosity = props.viscosity;
  };

  p.setup = () => {
    const cnv = p.createCanvas(300, 300);
    cnv.mouseClicked(canvasClicked);

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

  const canvasClicked = () => {
    //push a new planet at mouse position
    let radius = 10;
    let orbitRadius = p.dist(p.width / 2, p.height / 2, p.mouseX, p.mouseY);
    let orbitSpeed = p.random((0.01 * 180) / p.TWO_PI, (0.1 * 180) / p.TWO_PI);
    //calculate orbit angle from mouse position
    let orbitAngle = p.atan2(p.mouseY - p.height / 2, p.mouseX - p.width / 2);
    let orbitDirection = p.random([-1, 1]);
    let color = APalette.lofi;
    let x = p.mouseX - p.width / 2;
    let y = p.mouseY - p.height / 2;
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
  };
};

export const Planets = () => {
  //MUI slider controls viscosity from 0 to 1
  const defaultViscosity = 1;
  const [viscosity, setViscosity] = useState(defaultViscosity);
  const CustomSliderStyles = {
    '& .MuiSlider-thumb': {
      color: '#ffb8b8',
      boxShadow: 'none !important',
    },

    '& .MuiSlider-track': {
      color: APalette.lofi,
    },
    '& .MuiSlider-rail': {
      color: '#acc4e4',
    },
    '& .MuiSlider-active': {
      color: '#f5e278',
    },
  };

  return (
    <Stack>
      <ReactP5Wrapper sketch={sketch} viscosity={viscosity} />
      <Slider
        value={viscosity}
        aria-label="Default"
        min={0}
        step={0.01}
        max={2}
        sx={CustomSliderStyles}
        valueLabelDisplay="off"
        onChange={(e, value) => {
          setViscosity(value as number);
        }}
      />
    </Stack>
  );
};
