//react functional component that uses <AButton> from src/theme.tsx to toggle Transport state
// Path: src/playbackCtrl/playButton.tsx
import { AButton } from '../theme';
import { Icon } from '@mui/material';
import * as Tone from 'tone';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export const PlayButton = () => {
  return (
    <AButton
      onClick={() => {
        if (Tone.Transport.state === 'stopped') {
          Tone.getTransport().start();
        }
      }}
      sx={{ px: 1.5, py: 1 }}
    >
      <Icon>
        <PlayArrowIcon />
      </Icon>
    </AButton>
  );
};
