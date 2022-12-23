import { vi } from 'vitest';
import { Doodler } from '../pages/Doodler';
import { DoodlerPage } from '../pages/DoodlerPage';
import { Metronome } from '../pages/Metronome';
import { Theremin } from '../pages/Theremin';

import { ThereminPage } from '../pages/ThereminPage';
import { PlayButton } from '../playbackCtrl/PlayButton';
import { StopButton } from '../playbackCtrl/StopButton';
import { Playground } from './Playground';
import { ThereminWithoutState } from './ThereminWithoutState';

export const PGPage = () => {
  return (
    <>
      <DoodlerPage />;
      <Playground />
      <Metronome />
      <StopButton />
      <PlayButton />
      <ThereminWithoutState />
    </>
  );
};
