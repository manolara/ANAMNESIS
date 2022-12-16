import p5 from 'p5';
import { useEffect } from 'react';

import { ReactP5Wrapper } from 'react-p5-wrapper';

interface KnobProps {
  p: p5;
}

let sketchColor = '#b8b9ff';

const Knob = ({ p }: KnobProps) => {
  const r = 45;
  const x = r + 2;
  const y = r + 2;

  let value = 50;
  let isDragging = false;
  let prevY = -1;
  let angle = 0;

  const knobPosition = p.createVector(x, y);
  const lineEnd = p.createVector(0, 0);

  p.angleMode(p.DEGREES);

  useEffect(() => {
    draw();
  });

  const onMousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, x, y) < r) {
      isDragging = true;
      prevY = -1;
    }
  };

  const onMouseReleased = () => {
    isDragging = false;
  };

  const draw = () => {
    angle = p.map(value, 0, 100, 225, -45);
    lineEnd.y = (p.sin(angle) * r) / 2;
    lineEnd.x = (p.cos(angle) * r) / 2;

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
  };

  return (
    <svg
      width={r * 2 + 4}
      height={r * 2 + 4}
      onMouseDown={onMousePressed}
      onMouseUp={onMouseReleased}
    >
      <circle
        cx={knobPosition.x}
        cy={knobPosition.y}
        r={r}
        fill={sketchColor}
      />
      <line
        x1={knobPosition.x}
        y1={knobPosition.y}
        x2={knobPosition.x + lineEnd.x}
        y2={knobPosition.y + lineEnd.y}
        stroke={sketchColor}
      />
      <text x={x} y={y + r + 12} textAnchor="middle">
        {value}
      </text>
    </svg>
  );
};

export const KnobSVG = () => <ReactP5Wrapper sketch={(p) => <Knob p={p} />} />;
