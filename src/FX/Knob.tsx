import { Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import { mapLog, mapLogInv } from '../utils/utils';
import p5 from 'p5';
import { useStore } from 'reactflow';

interface KnobProps extends SketchProps {
  title?: string;
  onValueChange?: (value: number) => void;
  isExp?: boolean;
  min?: number;
  max?: number;
  hasDecimals?: boolean | number;
  defaultValue?: number;
  zoomFactor?: number;
}

interface KnobComponentProps {
  title?: string;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  isExp?: boolean;
  min?: number;
  max?: number;
  hasDecimals?: boolean | number;
}

let sketchTitleDefault = 'Knob';
let minDefault = 0;
let maxDefault = 100;
let hasDecimalsDefault: boolean | number = false;
let isExpDefault = false;

const sketch = (p: P5CanvasInstance<KnobProps>) => {
  const r = 45;
  const canvasWidth = r + 4;
  const canvasHeight = 68;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2 - 8;
  let cnv: p5.Renderer;
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
  let prevOut: number | undefined = undefined;
  let numDecimals = 2;
  let decimator = Math.pow(10, numDecimals);
  let zoomFactor = 1;
  let sc_mouseX: number;
  let sc_mouseY: number;
  let defaultsSet = false;

  let onValueChange: (value: number) => void = () => {};
  p.angleMode(p.DEGREES);

  p.updateWithProps = (props: KnobProps) => {
    if (!defaultsSet) {
      if (props.onValueChange) {
        onValueChange = props.onValueChange;
      }
      if (props.isExp) {
        isExp = props.isExp;
      }
      if (props.min) {
        min = props.min;
      }
      if (props.max || props.max === 0) {
        max = props.max;
      }
      if (props.hasDecimals) {
        hasDecimals = props.hasDecimals;
        if (typeof hasDecimals === 'number') {
          if (hasDecimals > 0 && hasDecimals % 1 === 0) {
            numDecimals = hasDecimals;
          } else console.warn('hasDecimals must be an integer >= 0 goofy');
          decimator = Math.pow(10, numDecimals);
        }
      }
      defaultsSet = true;
    }
    if (props.defaultValue || props.defaultValue === 0) {
      value = isExp
        ? mapLogInv(props.defaultValue, 0, 100, min, max)
        : p.map(props.defaultValue, min, max, 0, 100);
    }

    if (props.zoomFactor) {
      zoomFactor = props.zoomFactor;
    }
    scrollFactor = 1 / 4;
  };

  p.setup = () => {
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(30);
  };

  p.draw = () => {
    sc_mouseX = p.mouseX / zoomFactor;
    sc_mouseY = p.mouseY / zoomFactor;
    let angle = p.map(value, 0, 100, 225, -45);
    endY = (p.sin(angle) * r) / 2;
    endX = (p.cos(angle) * r) / 2;
    p.clear(0, 0, 0, 0);
    p.push();
    p.translate(x, y);
    p.circle(0, 0, r);
    p.line(0, 0, endX, -endY);
    p.pop();
    if (isDragging) {
      if (prevY !== -1) {
        let change = (sc_mouseY - prevY) * scrollFactor;

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

      prevY = sc_mouseY;
    }
    let outValue = isExp
      ? mapLog(value, 0, 100, min, max)
      : p.map(value, 0, 100, min, max);

    //making sure the value quantization looks good
    let half = (max - min + min) / 2;
    if (outValue > max - max * 0.01) {
      outValue = max;
    } else if (outValue < min) {
      outValue = min;
    } else if (outValue < half + half * 0.01 && outValue > half - half * 0.01) {
      outValue = half;
    }

    outValue = hasDecimals
      ? Math.floor(outValue * decimator) / decimator
      : Math.floor(outValue);

    if (prevOut !== outValue) {
      console.log('change', outValue);
      onValueChange(outValue);
    }

    p.text(outValue, x, y + 35);
    prevOut = outValue;
  };
  p.mousePressed = () => {
    if (p.dist(sc_mouseX, sc_mouseY, p.width / 2, p.height / 2) < r) {
      isDragging = true;
      prevY = -1;
    }
  };
  p.mouseReleased = () => {
    isDragging = false;
  };
};
const zoomSelector = (s: any) => s.transform[2];
export const Knob = ({
  title = sketchTitleDefault,
  defaultValue,
  onValueChange,
  min = minDefault,
  max = maxDefault,
  hasDecimals = hasDecimalsDefault,
  isExp = isExpDefault,
}: KnobComponentProps) => {
  if (!defaultValue && defaultValue !== 0) {
    defaultValue = (min + max) / 2;
  }
  let zoomFactor = 1;
  try {
    zoomFactor = useStore(zoomSelector);
  } catch (e) {
    console.log('zoom not found');
  }

  return (
    <Stack justifyContent="center" alignItems="center">
      <Typography className="unselectable" variant="subtitle2">
        {title}
      </Typography>
      <ReactP5Wrapper
        sketch={sketch}
        onValueChange={
          onValueChange ? useCallback(onValueChange, []) : undefined
        }
        min={min}
        max={max}
        defaultValue={defaultValue}
        hasDecimals={hasDecimals}
        isExp={isExp}
        zoomFactor={zoomFactor}
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
