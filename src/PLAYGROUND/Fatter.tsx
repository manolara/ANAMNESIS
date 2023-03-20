import * as React from 'react';
import { render } from 'react-dom';
import { Button } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};
let circleY = 40;
let circleX = 0;

export const Fatter = () => {
  let fatness = 30;
  let fatnessArray = [fatness, 0];
  function sketch(p: P5CanvasInstance) {
    p.setup = () => {
      p.createCanvas(600, 400);
    };

    p.draw = () => {
      p.background(0);

      p.circle(circleX, circleY, fatnessArray[0]);
      circleX++;
    };
  }
  return (
    <>
      <Button>yo</Button>
      <Button onClick={() => (fatnessArray[0] += 30)}>FATTER</Button>
      <ReactP5Wrapper sketch={sketch} />
    </>
  );
};
