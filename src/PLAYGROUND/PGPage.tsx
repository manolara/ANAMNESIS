import { Doodler } from '../pages/Doodler';
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
    </>
  );
};
