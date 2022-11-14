import { Button } from '@mui/material';
import React, { useState } from 'react';
import { Doodler } from './Doodler';

export const DoodlerPage = () => {
  const [value, setValue] = useState(0);
  console.log(value);

  return (
    <div className="css-test">
      <Button onClick={() => {}}>Yello</Button>
      <Doodler />
    </div>
  );
};
