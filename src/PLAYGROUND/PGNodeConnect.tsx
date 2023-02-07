import { useState } from 'react';
import { Synthesizer } from '../Instruments/Synthesizer';
import { DoodlerPage } from '../pages/DoodlerPage';
import { AButton } from '../theme';
import * as Tone from 'tone';

export const PGNodeConnect = () => {
  const [synthEngines, setSynthEngines] = useState<{
    [key: number]: Tone.PolySynth;
  }>({ 0: new Tone.PolySynth() });
  const [synthesizers, setSynthesizers] = useState([
    <Synthesizer key={0} synth={synthEngines[0]} />,
  ]);

  const handleClick = () => {
    setSynthEngines({
      ...synthEngines,
      [synthesizers.length]: new Tone.PolySynth(),
    });
    setSynthesizers([
      ...synthesizers,
      <Synthesizer
        key={synthesizers.length}
        synth={synthEngines[Object.keys(synthEngines).length - 1]}
      />,
    ]);
  };

  return (
    <>
      {synthesizers}
      <DoodlerPage />
      <AButton
        sx={{ mt: 1 }}
        onClick={() => {
          if (synthesizers.length < 2) {
            handleClick();
          }
        }}
      >
        add synth
      </AButton>
    </>
  );
};
