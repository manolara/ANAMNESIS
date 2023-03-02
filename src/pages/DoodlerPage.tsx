import { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import * as Tone from 'tone';
import { Doodler } from '../Instruments/Doodler';
import { PGDoodler } from '../PLAYGROUND/PGDoodler';
import { InstrumentProps } from '../types/componentProps';

export const DoodlerPage = ({ soundSource }: InstrumentProps) => {
  const [bassNote, setBassNote] = useState('C3');

  return (
    <>
      <Doodler soundSource={soundSource} bassNoteProp={bassNote} />
      <BassnotesBar setBassNote={setBassNote} />
    </>
  );
};
