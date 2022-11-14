import { Button } from '@mui/material';
import React, { useState } from 'react';
import { MySketch } from './MySketch';

export const MySketchPage = () => {
  const [strokeWeight, setStrokeWeight] = useState(0);

  return (
    <div className="css-test">
      <Button onClick={() => setStrokeWeight((prev) => prev + 10)}>
        Increase Weight
      </Button>
      ;
      <MySketch strokeWeight={strokeWeight} />
    </div>
  );
};
