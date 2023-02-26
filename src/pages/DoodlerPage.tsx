import { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import * as Tone from 'tone';
import { Doodler } from '../Instruments/Doodler';
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
      <Doodler
        soundSource={soundSource}
        bassNoteProp={bassNote}
        zoomFactor={zoomFactor}
      />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
