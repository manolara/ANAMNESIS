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
import { Distortion } from '../FX/Distortion';
import { AButton } from '../theme';

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
        {/* <Planets /> */}
        <APiano soundEngine={piano} output={pianoOutput} />
      </Stack>
      <Playground />
      <Metronome />
      <StopButton />
      <PlayButton />
      <Distortion
        input={pianoOutput}
        output={new Tone.Signal().toDestination()}
      />
      <AButton
        onClick={() => {
          piano.keyDown({ note: 'C3', time: Tone.now() });
          piano.keyUp({ note: 'C3', time: Tone.now() + 0.1 });
        }}
      />

      <Theremin />
      {/* <Theremin /> */}
    </>
  );
};
