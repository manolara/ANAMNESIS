import { useMemo, useState } from 'react';
import { Synthesizer } from '../Instruments/Synthesizer';
import { DoodlerPage } from '../pages/DoodlerPage';
import { AButton } from '../theme';
import * as Tone from 'tone';
import { Stack } from '@mui/material';

interface SoundSource {
  engine: Tone.PolySynth;
  component: React.ReactElement;
}

interface SoundSources {
  [key: number]: SoundSource;
}

export const PGNodeConnect = () => {
  const initSynth = useMemo(() => new Tone.PolySynth(), []);
  const initSoundSources: SoundSources = {
    0: {
      engine: initSynth,
      component: <Synthesizer key={0} synth={initSynth} />,
    },
  };
  const [soundSources, setSoundSources] = useState(initSoundSources);
  const newSoundSource = () => {
    const tmpSynth = new Tone.PolySynth();
    setSoundSources({
      ...soundSources,
      [Object.keys(soundSources).length]: {
        engine: tmpSynth,
        component: (
          <Synthesizer
            key={Object.keys(soundSources).length}
            synth={tmpSynth}
          />
        ),
      },
    });
  };
  const [doodlerConnect, setDoodlerConnect] = useState<
    keyof SoundSources | null
  >(null);
  const [doodler2Connect, setDoodler2Connect] = useState<
    keyof SoundSources | null
  >(null);

  //just for ease of access
  const synthComponents: React.ReactElement[] = Object.values(soundSources).map(
    (soundSource) => soundSource.component
  );
  const synthEngines: Tone.PolySynth[] = Object.values(soundSources).map(
    (soundSource) => soundSource.engine
  );

  return (
    <>
      <Stack direction="row" spacing={1}>
        {synthComponents}
      </Stack>
      <DoodlerPage
        soundSource={
          doodlerConnect !== null ? synthEngines[doodlerConnect] : undefined
        }
      />
      <DoodlerPage
        soundSource={
          doodler2Connect !== null ? synthEngines[doodler2Connect] : undefined
        }
      />
      <AButton
        sx={{ mt: 1 }}
        onClick={() => {
          if (synthComponents.length < 2) {
            newSoundSource();
          }
        }}
      >
        add synth
      </AButton>
      <AButton
        sx={{ m: 1 }}
        onClick={() => {
          setDoodlerConnect(0);
        }}
      >
        connect to synth 1
      </AButton>
      <AButton
        sx={{ m: 1 }}
        onClick={() => {
          setDoodler2Connect(0);
        }}
      >
        connect 2 to synth 1
      </AButton>
      {synthComponents.length > 1 ? (
        <AButton
          sx={{ m: 1 }}
          onClick={() => {
            setDoodlerConnect(1);
          }}
        >
          connect to synth 2
        </AButton>
      ) : null}
    </>
  );
};
