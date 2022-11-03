import { ReactP5Wrapper, P5Instance } from 'react-p5-wrapper';

function sketch(p: P5Instance) {
  p.setup = () => {
    p.createCanvas(600, 400);
    p.background(0);
  };

  p.draw = () => {};
  p.mouseDragged = () => {
    p.stroke(255);
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
  };
}

export function MySketch() {
  return <ReactP5Wrapper sketch={sketch} />;
}
