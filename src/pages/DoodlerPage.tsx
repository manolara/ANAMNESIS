import React, { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import { Doodler } from '../Instruments/Doodler';

interface DoodlerPageProps {
  zoomFactor?: number;
}
export const DoodlerPage = ({ zoomFactor = 1 }: DoodlerPageProps) => {
  const [bassNote, setBassNote] = useState('C3');

  return (
    <>
      <Doodler bassNoteProp={bassNote} zoomFactor={zoomFactor} />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
