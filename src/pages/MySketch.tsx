import { ReactP5Wrapper, P5Instance, SketchProps } from 'react-p5-wrapper';

interface MySketchProps extends SketchProps {
  strokeWeight: number;
}
function sketch(p: P5Instance<MySketchProps>) {
  let myStrokeWeight = 0;
  p.setup = () => {
    p.createCanvas(600, 400);
    p.background(0);
    p.stroke(255);
  };

  p.updateWithProps = (props) => {
    myStrokeWeight = props.strokeWeight;
  };

  p.draw = () => {};
  p.mouseDragged = () => {
    p.strokeWeight(myStrokeWeight);
    p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
  };
}

export const MySketch = ({ strokeWeight }: MySketchProps) => {
  return <ReactP5Wrapper sketch={sketch} strokeWeight={strokeWeight} />;
};
