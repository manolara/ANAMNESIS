import React, { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import { Doodler } from '../Instruments/Doodler';

export const DoodlerPage = () => {
  const [bassNote, setBassNote] = useState('C3');
  return (
    <>
      <Doodler bassNoteProp={bassNote} />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
