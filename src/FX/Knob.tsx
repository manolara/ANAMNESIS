import { Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { mapLog, mapLogInv } from '../utils/utils';
import p5 from 'p5';

interface KnobProps extends SketchProps {
  color: string;
  title?: string;
  setParentValue?: Dispatch<SetStateAction<number>>;
  isExp?: boolean;
  min?: number;
  max?: number;
  hasDecimals?: boolean;
  defaultValue?: number;
}

interface KnobComponentProps {
  color: string;
  title?: string;
  defaultValue?: number;
  setParentValue?: Dispatch<SetStateAction<number>>;
  isExp?: boolean;
  min?: number;
  max?: number;
  hasDecimals?: boolean;
}

let sketchColorDefault = '#b8b9ff';
let sketchTitleDefault = 'Knob';
let minDefault = 0;
let maxDefault = 100;
let hasDecimalsDefault = false;
let isExpDefault = false;

const sketch = (p: P5CanvasInstance<KnobProps>) => {
  const r = 45;
  const canvasWidth = r + 4;
  const canvasHeight = 68;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2 - 8;
  let cnv: p5.Renderer;
  let sketchColor = sketchColorDefault;
  let min = minDefault;
  let max = maxDefault;
  let hasDecimals = hasDecimalsDefault;
  let isExp = isExpDefault;
  let value = (minDefault + maxDefault) / 2;
  let isDragging = false;
  let prevY = -1;
  let endX = 0;
  let endY = 0;
  let scrollFactor = 1 / (100 * 4);

  let setParentValueSketch: Dispatch<SetStateAction<number>>;
  p.angleMode(p.DEGREES);

  p.updateWithProps = (props: KnobProps) => {
    if (props.setParentValue) {
      setParentValueSketch = props.setParentValue;
    }
    if (props.color) {
      sketchColor = props.color;
    }
    if (props.isExp) {
      isExp = props.isExp;
    }
    if (props.min) {
      min = props.min;
    }
    if (props.max) {
      max = props.max;
    }
    if (props.hasDecimals) {
      hasDecimals = props.hasDecimals;
    }
    if (props.defaultValue) {
      value = isExp
        ? Math.floor(mapLogInv(props.defaultValue, 0, 100, min, max))
        : p.map(props.defaultValue, min, max, 0, 100);
      console.log('hasDecimals', hasDecimals);
    }
    scrollFactor = 1 / 4;
  };

  p.setup = () => {
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(30);
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
      console.log({ value });
      if (prevY !== -1) {
        let change = hasDecimals
          ? (p.mouseY - prevY) * scrollFactor
          : Math.floor((p.mouseY - prevY) * scrollFactor);
        console.log(scrollFactor);

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
      console.log({ value });

      prevY = p.mouseY;
    }
    let outValue = isExp
      ? mapLog(value, 0, 100, min, max)
      : p.map(value, 0, 100, min, max);

    //making sure the value quantization looks good
    let half = (max - min + min) / 2;
    if (outValue > max - max * 0.1) {
      outValue = max;
    } else if (outValue < min) {
      outValue = min;
    } else if (outValue < half + half * 0.01 && outValue > half - half * 0.01) {
      outValue = half;
    }

    outValue = hasDecimals
      ? Math.floor(outValue * 100) / 100
      : Math.floor(outValue);

    setParentValueSketch ? setParentValueSketch(outValue) : null;

    p.text(outValue, x, y + 35);
  };
  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2) < r) {
      isDragging = true;
      prevY = -1;
    }
  };
  p.mouseReleased = () => {
    isDragging = false;
  };
};

export const Knob = ({
  color = sketchColorDefault,
  title = sketchTitleDefault,
  defaultValue,
  setParentValue,
  min = minDefault,
  max = maxDefault,
  hasDecimals = hasDecimalsDefault,
  isExp = isExpDefault,
}: KnobComponentProps) => {
  if (!defaultValue) {
    defaultValue = (min + max) / 2;
  }
  return (
    <Stack justifyContent="center" alignItems="center">
      <Typography variant="subtitle2">{title}</Typography>
      <ReactP5Wrapper
        sketch={sketch}
        setParentValue={setParentValue}
        color={color}
        min={min}
        max={max}
        defaultValue={defaultValue}
        hasDecimals={hasDecimals}
        isExp={isExp}
      />
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
