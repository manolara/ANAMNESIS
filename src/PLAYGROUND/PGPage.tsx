import { vi } from 'vitest';
import { Doodler } from '../Instruments/Doodler';
import { Theremin } from '../Instruments/Theremin';
import { DoodlerPage } from '../pages/DoodlerPage';
import { Metronome } from '../pages/Metronome';

import { PlayButton } from '../playbackCtrl/PlayButton';
import { StopButton } from '../playbackCtrl/StopButton';
import { Playground } from './Playground';

export const PGPage = () => {
  return (
    <>
      <DoodlerPage />;
      <Playground />
      <Metronome />
      <StopButton />
      <PlayButton />
      <Theremin />
    </>
  );
};
