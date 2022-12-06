//react functional component that uses <AButton> from src/theme.tsx to toggle Transport state
// Path: src/playbackCtrl/playButton.tsx
import React from 'react';
import { AButton } from '../theme';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { Icon } from '@mui/material';
import * as Tone from 'tone';

export const PlayButton = () => {
  return (
    <AButton
      onClick={() => {
        if (Tone.Transport.state === 'stopped') {
          Tone.getTransport().start();
        }
        //set transport to 0

        console.log('yo');
      }}
      sx={{ px: 1.5, py: 1 }}
    >
      <Icon>
        <PlayCircleFilledWhiteIcon />
      </Icon>
    </AButton>
  );
};
