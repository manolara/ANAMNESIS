import { Stack } from '@mui/material';
import { Dispatch } from 'react';
import { AButton } from '../theme';

interface BassNotesBarProps {
  setBassNote: Dispatch<React.SetStateAction<string>>;
}

const bassNotesColor = '#ffb8b8';

export const BassnotesBar = ({ setBassNote }: BassNotesBarProps) => {
  return (
    <Stack direction="row" spacing={0.55}>
      <AButton
        sx={{
          backgroundColor: bassNotesColor,
        }}
        onClick={() => setBassNote('C3')}
      >
        I
      </AButton>
      <AButton
        sx={{ backgroundColor: bassNotesColor }}
        onClick={() => setBassNote('D3')}
      >
        II
      </AButton>
      <AButton
        sx={{ backgroundColor: bassNotesColor }}
        onClick={() => setBassNote('F3')}
      >
        IV
      </AButton>
      <AButton
        sx={{ backgroundColor: bassNotesColor }}
        onClick={() => setBassNote('G3')}
      >
        V
      </AButton>
      <AButton
        sx={{ backgroundColor: bassNotesColor }}
        onClick={() => setBassNote('A3')}
      >
        VI
      </AButton>
    </Stack>
  );
};
