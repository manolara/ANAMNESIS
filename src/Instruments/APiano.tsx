import { Stack } from '@mui/material';
import { Piano } from '@tonejs/piano';
import { useEffect, useMemo } from 'react';
import * as Tone from 'tone';
import { Knob } from '../FX/Knob';
import { SoundSourceProps } from '../types/componentProps';

export const APiano = ({ soundEngine, output }: SoundSourceProps<Piano>) => {
  const filter = useMemo(
    () => new Tone.Filter(20000, 'lowpass').toDestination(),
    []
  );
  useEffect(() => {
    const piano = soundEngine;
    piano.load().then(() => {
      piano.chain(filter, output);
    });
    return () => {
      piano.dispose();
      output.dispose();
    };
  }, []);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        className="unselectable"
        sx={{
          backgroundColor: '#FEEDD5',
          width: 'fit-content',
          height: 'fit-content',
          p: 1,
          border: `3px solid #a8aeec`,
        }}
      >
        <img
          src="assets/piano-brown.svg"
          style={{ display: 'block', width: '100px', height: '100px' }}
        />
        <Knob
          title="Mood"
          min={500}
          max={2000}
          isExp
          onValueChange={(value) => {
            filter.frequency.value = value;
          }}
          defaultValue={2000}
        />
      </Stack>
    </>
  );
};
