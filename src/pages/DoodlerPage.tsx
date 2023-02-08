import React, { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import { Doodler } from '../Instruments/Doodler';
import * as Tone from 'tone';
import { PGDoodler } from '../PLAYGROUND/PGDoodler';

interface DoodlerPageProps {
  zoomFactor?: number;
  soundSource?: Tone.PolySynth;
}
export const DoodlerPage = ({
  zoomFactor = 1,
  soundSource,
}: DoodlerPageProps) => {
  const [bassNote, setBassNote] = useState('C3');
  console.log('soundSource', soundSource);
  return (
    <>
      <PGDoodler
        soundSource={soundSource}
        bassNoteProp={bassNote}
        zoomFactor={zoomFactor}
      />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
