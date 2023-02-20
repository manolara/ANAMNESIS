import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import { APalette } from '../theme';

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
      this.x = p.width / 2 + this.orbitRadius * p.cos(this.orbitAngle);
      this.y = p.height / 2 + this.orbitRadius * p.sin(this.orbitAngle);
    }
  }
  let x = 0;
  let y = 0;
  let framerate = 30;
  let planets: Planet[] = [];
  p.setup = () => {
    p.createCanvas(300, 300);
    p.background('#fbe0ca');
    p.frameRate(framerate);
    //push 5 planets at random positions
    for (let i = 0; i < 5; i++) {
      let radius = 10;
      let orbitRadius = p.random(50, 100);
      let orbitSpeed = p.random(0.01, 0.1);
      let orbitAngle = p.random(0, p.TWO_PI);
      let orbitDirection = p.random([-1, 1]);
      let color = APalette.lofi;
      let x = p.width / 2 + orbitRadius * p.cos(orbitAngle);
      let y = p.height / 2 + orbitRadius * p.sin(orbitAngle);
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
    p.rotate((p.PI * p.frameCount) / (2 * framerate));
    p.line(p.width / 2, p.height / 2, x, y);
    p.pop();
    //draw planets
    planets.forEach((planet) => {
      planet.draw();
      planet.orbit();
    });
  };
};

export const Planets = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};
