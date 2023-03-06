//react functional component that uses <AButton> from src/theme.tsx to toggle Transport state
// Path: src/playbackCtrl/playButton.tsx
import { AButton } from '../theme';
import StopIcon from '@mui/icons-material/Stop';
import { Icon } from '@mui/material';
import * as Tone from 'tone';

export const StopButton = () => {
  return (
    <AButton
      onClick={() => {
        Tone.getTransport().stop();
        //set transport to 0
        Tone.Transport.position = '0:0:0';
      }}
      sx={{ px: 1.5, py: 1 }}
    >
      <Icon>
        <StopIcon />
      </Icon>
    </AButton>
  );
};
