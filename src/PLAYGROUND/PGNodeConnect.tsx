import { useMemo, useState } from 'react';
import { Synthesizer } from '../Instruments/Synthesizer';
import { DoodlerPage } from '../pages/DoodlerPage';
import { AButton } from '../theme';
import * as Tone from 'tone';
import { Stack } from '@mui/material';
import { Reverb } from '../FX/Reverb';
import { Lofi } from '../FX/Lofi';

interface SoundSource {
  engine: Tone.PolySynth;
  output: Tone.Signal;
  component: React.ReactElement;
}

interface SoundSources {
  [key: number]: SoundSource;
}

export const PGNodeConnect = () => {
  const initSynth = useMemo(() => new Tone.PolySynth(), []);
  const initSynthOutput = useMemo(() => new Tone.Signal(), []);
  const initSoundSources: SoundSources = {
    0: {
      engine: initSynth,
      output: initSynthOutput,
      component: (
        <Synthesizer key={0} synth={initSynth} output={initSynthOutput} />
      ),
    },
  };
  const [soundSources, setSoundSources] = useState(initSoundSources);
  const newSoundSource = () => {
    const tmpSynth = new Tone.PolySynth();
    const tmpSynthOutput = new Tone.Signal();
    setSoundSources({
      ...soundSources,
      [Object.keys(soundSources).length]: {
        engine: tmpSynth,
        output: tmpSynthOutput,
        component: (
          <Synthesizer
            key={Object.keys(soundSources).length}
            synth={tmpSynth}
            output={tmpSynthOutput}
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
  const reverbOutput = useMemo(() => new Tone.Signal(), []);
  const reverbEngine1 = useMemo(() => new Tone.Reverb(), []);
  const LofiInput = useMemo(() => new Tone.Signal(), []);
  const LofiOutput = useMemo(() => new Tone.Signal().toDestination(), []);

  return (
    <>
      <Stack direction="row" spacing={1}>
        {synthComponents}
        <Reverb reverbEngine={reverbEngine1} reverbOutput={reverbOutput} />
        <Lofi input={LofiInput} output={LofiOutput} />
      </Stack>
      <DoodlerPage
        soundSource={
          doodlerConnect !== null ? synthEngines[doodlerConnect] : undefined
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
      <AButton
        sx={{ m: 1 }}
        onClick={() => {
          soundSources?.[0].output.disconnect().connect(reverbEngine1);
          console.log('reverb connected');
        }}
      >
        connect synth 1 to reverb 1
      </AButton>
      <AButton
        sx={{ m: 1 }}
        onClick={() => {
          reverbOutput.disconnect().connect(LofiInput);
        }}
      >
        connect reverb out to lofi
      </AButton>
    </>
  );
};
