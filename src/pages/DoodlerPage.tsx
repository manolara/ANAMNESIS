import React, { useState } from 'react';
import { BassnotesBar } from './BassnotesBar';
import { Doodler } from './Doodler';

export const DoodlerPage = () => {
  const [value, setValue] = useState(0);
  const [bassNote, setBassNote] = useState('C3');
  console.log(bassNote);
  return (
    <>
      <Doodler bassNoteProp={bassNote} />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
