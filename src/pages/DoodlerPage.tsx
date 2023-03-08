import { Stack } from '@mui/material';
import { useState } from 'react';
import { BassnotesBar } from '../Instruments/BassnotesBar';
import { Doodler } from '../Instruments/Doodler';
import { InstrumentProps } from '../types/componentProps';

export const DoodlerPage = ({ soundSource }: InstrumentProps) => {
  const [bassNote, setBassNote] = useState('C3');

  return (
    <Stack direction="column">
      <Doodler soundSource={soundSource} bassNoteProp={bassNote} />

      <BassnotesBar setBassNote={setBassNote} />
    </Stack>
  );
};
