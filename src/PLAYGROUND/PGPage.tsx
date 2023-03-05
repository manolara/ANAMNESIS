import { Stack } from '@mui/system';
import { useMemo } from 'react';
import { APiano } from '../Instruments/APiano';
import { Theremin } from '../Instruments/Theremin';
import { DoodlerPage } from '../pages/DoodlerPage';
import { Metronome } from '../pages/Metronome';
import { Piano } from '@tonejs/piano';
import * as Tone from 'tone';
import { PlayButton } from '../playbackCtrl/PlayButton';
import { StopButton } from '../playbackCtrl/StopButton';
import { Playground } from './Playground';
import { Planets } from '../Instruments/Planets';

export const PGPage = () => {
  const piano = useMemo(
    () =>
      new Piano({
        velocities: 5,
      }),
    []
  );
  const pianoOutput = useMemo(() => new Tone.Signal(), []);
  return (
    <>
      <Stack direction="row" spacing={4}>
        <DoodlerPage />
        <Planets />
        <APiano soundEngine={piano} output={pianoOutput} />
      </Stack>
      <Playground />
      <Metronome />
      <StopButton />
      <PlayButton />

      <Theremin />
      {/* <Theremin /> */}
    </>
  );
};
