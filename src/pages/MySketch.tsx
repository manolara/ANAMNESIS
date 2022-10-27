import { ReactP5Wrapper, P5Instance } from 'react-p5-wrapper';

function sketch(p: P5Instance) {
  p.setup = () => p.createCanvas(600, 400, p.WEBGL);

  p.draw = () => {
    p.background(250);
    p.normalMaterial();
    p.push();
    p.rotateZ(p.frameCount * 0.01);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.plane(100);
    p.pop();
  };
}

export function MySketch() {
  return <ReactP5Wrapper sketch={sketch} />;
}
