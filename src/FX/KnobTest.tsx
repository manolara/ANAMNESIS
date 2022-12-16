import { Stack, Typography } from '@mui/material';
import p5 from 'p5';
import { Dispatch, SetStateAction } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { mapLog } from '../utils/utils';

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
  min: number;
  max: number;
  hasDecimalsProp?: boolean;
}

let sketchColor = '#b8b9ff';
let sketchTitle = 'Knob';
let p5min: number;
let p5max: number;
let hasDecimals = false;
let isLog = true;
const sketch = (p: P5CanvasInstance<KnobProps>) => {
  const r = 45;
  const canvasWidth = r + 4;
  const canvasHeight = 68;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2 - 8;
  let cnv: p5.Renderer;
  let value = (p5min + p5max) / 2;
  let isDragging = false;
  let prevY = -1;
  let endX = 0;
  let endY = 0;
  let scrollFactor = (p5max - p5min) / (100 * 4);

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
    let angle = p.map(value, p5min, p5max, 225, -45);
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
        let change = hasDecimals
          ? (p.mouseY - prevY) * scrollFactor
          : Math.floor((p.mouseY - prevY) * scrollFactor);
        if (change < 0 && value < p5max) {
          if (value - change > p5max) {
            value = p5max;
          } else {
            value = value - change;
          }
        } else if (change > 0 && value > 0) {
          if (value - change < 0) {
            value = p5min;
          } else {
            value = value - change;
          }
        }
      }

      prevY = p.mouseY;
    }
    value = Math.round(value * 100) / 100;

    setParentValueSketch ? setParentValueSketch(value) : null;

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

export const KnobTest = ({
  color,
  title,
  defaultValue,
  setParentValue,
  min = 0,
  max = 100,
  hasDecimalsProp,
}: KnobComponentProps) => {
  sketchColor = color;
  if (title) {
    sketchTitle = title;
  }
  if (hasDecimalsProp) {
    hasDecimals = hasDecimalsProp;
  }
  p5min = min;
  p5max = max;

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
