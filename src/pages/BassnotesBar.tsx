import { Button, Stack } from '@mui/material';
import { Dispatch } from 'react';

interface BassNotesBarProps {
  setBassNote: Dispatch<React.SetStateAction<string>>;
}

export const BassnotesBar = ({ setBassNote }: BassNotesBarProps) => {
  return (
    <Stack direction="row">
      <Button onClick={() => setBassNote('C3')}>I</Button>
      <Button onClick={() => setBassNote('D3')}>II</Button>
      <Button onClick={() => setBassNote('F3')}>IV</Button>
      <Button onClick={() => setBassNote('G3')}>V</Button>
      <Button onClick={() => setBassNote('A3')}>VI</Button>
    </Stack>
  );
};
