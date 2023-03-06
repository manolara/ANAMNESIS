//react functional component that uses <AButton> from src/theme.tsx to toggle Transport state
// Path: src/playbackCtrl/playButton.tsx
import { AButton } from '../theme';
import PauseIcon from '@mui/icons-material/Pause';
import { Icon } from '@mui/material';
import * as Tone from 'tone';

export const PauseButton = () => {
  return (
    <AButton
      onClick={() => {
        Tone.getTransport().stop();

        console.log('yo');
      }}
      sx={{ px: 1.5, py: 1 }}
    >
      <Icon>
        <PauseIcon />
      </Icon>
    </AButton>
  );
};
