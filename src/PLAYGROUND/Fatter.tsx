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
let fatness = 30;

export const Fatter = () => {
  function sketch(p: P5CanvasInstance) {
    p.setup = () => {
      p.createCanvas(600, 400);
      console.log('setup');
    };

    p.draw = () => {
      p.background(0);

      p.circle(circleX, circleY, fatness);
      circleX++;
    };
  }
  return (
    <>
      <Button>yo</Button>
      <Button onClick={() => (fatness += 30)}>FATTER</Button>
      <ReactP5Wrapper sketch={sketch} />
    </>
  );
};
