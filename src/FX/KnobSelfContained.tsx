import { Stack, Typography } from '@mui/material';
import p5 from 'p5';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { mapLog, mapLogInv } from '../utils/utils';

interface KnobProps extends SketchProps {
  color: string;
  title?: string;
  setParentValue?: Dispatch<SetStateAction<number>>;
}

interface KnobComponentProps {
  color: string;
  title?: string;
  defaultValueProp?: number;
  setParentValue?: Dispatch<SetStateAction<number>>;
  isExpProp?: boolean;
  min?: number;
  max?: number;
  hasDecimalsProp?: boolean;
}

let sketchColor = '#b8b9ff';
let sketchTitle = 'Knob';
let p5min: number;
let p5max: number;
let hasDecimals: boolean;
let isExp: boolean;
let defaultValue: number;
const sketch = (p: P5CanvasInstance<KnobProps>) => {
  const r = 45;
  const canvasWidth = r + 4;
  const canvasHeight = 68;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2 - 8;
  let cnv: p5.Renderer;
  let value = defaultValue ? defaultValue : (p5min + p5max) / 2;
  let isDragging = false;
  let prevY = -1;

  let endX = 0;
  let endY = 0;
  let scrollFactor = (p5max - p5min) / (100 * 4);

  let setParentValueSketch: Dispatch<SetStateAction<number>>;
  p.angleMode(p.DEGREES);

  p.updateWithProps = (props: KnobProps) => {
    if (props.setParentValue) {
      setParentValueSketch = props.setParentValue;
    }
  };

  p.setup = () => {
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(30);
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
      console.log('value2', value);
    }
    let outValue = isExp ? mapLog(value, p5min, p5max, p5min, p5max) : value;
    outValue = hasDecimals
      ? Math.floor(outValue * 100) / 100
      : Math.floor(outValue);

    setParentValueSketch ? setParentValueSketch(outValue) : null;

    p.text(outValue, x, y + 35);
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

export const KnobSelfContained = ({
  color,
  title,
  defaultValueProp,
  setParentValue,
  min = 0,
  max = 1000000,
  hasDecimalsProp,
  isExpProp,
}: KnobComponentProps) => {
  sketchColor = color;
  if (title) {
    sketchTitle = title;
  }

  if (typeof hasDecimalsProp !== 'undefined') {
    hasDecimals = hasDecimalsProp;
  }

  p5min = min;
  p5max = max;

  if (typeof isExpProp !== 'undefined') {
    isExp = isExpProp;
  }

  console.log('p5max', p5max);

  if (defaultValueProp) {
    defaultValue = defaultValueProp;
  }
  return (
    <Stack justifyContent="center" alignItems="center">
      <Typography variant="subtitle2">{sketchTitle}</Typography>
      <ReactP5Wrapper sketch={sketch} setParentValue={setParentValue} />
    </Stack>
  );
};

/*  
1. detect whe
n knob is clicked
2. find wether the dragging is up or down
3. change the value of the knob


1. map range to 0 and 100
2. do the calculations just like before 
3. map back to the range


*/
