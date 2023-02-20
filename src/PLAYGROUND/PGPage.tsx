import { Stack } from '@mui/system';
import { Planets } from '../Instruments/Planets';
import { Theremin } from '../Instruments/Theremin';
import { DoodlerPage } from '../pages/DoodlerPage';
import { Metronome } from '../pages/Metronome';

import { PlayButton } from '../playbackCtrl/PlayButton';
import { StopButton } from '../playbackCtrl/StopButton';
import { Playground } from './Playground';

export const PGPage = () => {
  return (
    <>
      <Stack direction="row" spacing={4}>
        <DoodlerPage />
        <Planets />
      </Stack>
      <Playground />
      <Metronome />
      <StopButton />
      <PlayButton />

      <Theremin />
    </>
  );
};
