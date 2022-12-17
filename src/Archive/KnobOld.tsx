import { Stack, Typography } from '@mui/material';
import p5 from 'p5';
import { Dispatch, SetStateAction } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';

interface KnobProps extends SketchProps {
  color: string;
  title?: string;
  defaultValue?: number;
  setParentValue?: Dispatch<SetStateAction<number>>;
}

interface KnobComponentProps {
  color: string;
  title?: string;
  defaultValue?: number;
  setParentValue?: (value: number) => void;
}

let sketchColor = '#b8b9ff';
let sketchTitle = 'Knob';
const sketch = (p: P5CanvasInstance<KnobProps>) => {
  const r = 45;
  const canvasWidth = r + 4;
  const canvasHeight = 68;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2 - 8;
  let cnv: p5.Renderer;
  let value = 50;
  let isDragging = false;
  let prevY = -1;
  let endX = 0;
  let endY = 0;
  let setParentValueSketch: Dispatch<SetStateAction<number>>;
  p.angleMode(p.DEGREES);
  p.updateWithProps = (props: KnobProps) => {
    if (props.defaultValue) {
      value = props.defaultValue;
    }
    if (props.setParentValue) {
      setParentValueSketch = props.setParentValue;
    }
  };

  p.setup = () => {
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = () => {
    let angle = p.map(value, 0, 100, 225, -45);
    endY = (p.sin(angle) * r) / 2;
    endX = (p.cos(angle) * r) / 2;

    p.background(sketchColor);
    p.push();
    p.translate(x, y);
    p.circle(0, 0, r);
    p.line(0, 0, endX, -endY);
    p.pop();
    if (isDragging) {
      if (prevY !== -1) {
        let change = Math.floor((p.mouseY - prevY) / 4);
        if (change < 0 && value < 100) {
          if (value - change > 100) {
            value = 100;
          } else {
            value = value - change;
          }
        } else if (change > 0 && value > 0) {
          if (value - change < 0) {
            value = 0;
          } else {
            value = value - change;
          }
        }
      }

      prevY = p.mouseY;
    }
    setParentValueSketch ? setParentValueSketch(Math.floor(value)) : null;
    p.text(value, x, y + 35);
  };
  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2) < r) {
      isDragging = true;
      console.log(isDragging);
      prevY = -1;
    }
  };
  p.mouseReleased = () => {
    isDragging = false;
    console.log(isDragging);
  };
};

export const KnobOld = ({
  color,
  title,
  defaultValue,
  setParentValue,
}: KnobComponentProps) => {
  sketchColor = color;
  if (title) {
    sketchTitle = title;
  }

  return (
    <Stack justifyContent="center" alignItems="center">
      <Typography variant="subtitle2">{sketchTitle}</Typography>
      <ReactP5Wrapper
        sketch={sketch}
        defaultValue={defaultValue}
        setParentValue={setParentValue}
      />
    </Stack>
  );
};

/*  
1. detect when knob is clicked
2. find wether the dragging is up or down
3. change the value of the knob

*/
