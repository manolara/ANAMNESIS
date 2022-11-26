import React, { useState } from 'react';
import { BassnotesBar } from './BassnotesBar';
import { Doodler } from './Doodler';

export const DoodlerPage = () => {
  const [bassNote, setBassNote] = useState('C3');
  return (
    <>
      <Doodler bassNoteProp={bassNote} />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
