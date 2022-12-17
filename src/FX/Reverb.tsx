import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { APalette } from '../theme';
import { Knob } from './Knob';
import { KnobSVG } from './KnobSVG';
import * as Tone from 'tone';
import { KnobTest } from './KnobTest';
import { KnobExp } from './KnobExp';

export const ReverbFX = new Tone.Reverb({ decay: 5, wet: 1 }).toDestination();

export const Reverb = () => {
  const theme = useTheme();
  const [decay, setDecay] = React.useState(5);
  const testDecayDefault = 0.2;
  const [testDecay, setTestDecay] = React.useState(testDecayDefault);
  ReverbFX.set({ decay: decay });
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: '#b8b9ff', minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Reverb
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            defaultValue={decay}
            color={APalette.reverb}
            setParentValue={setDecay}
            title={'Decay'}
          />
          <Knob color={APalette.reverb} title={'Mix'} />
          <Knob color={APalette.reverb} title={'HPF'} />
          <KnobTest
            min={0}
            max={100}
            color={APalette.reverb}
            title={'HPF'}
            hasDecimalsProp={false}
          />
          <KnobExp
            min={0.2}
            max={70}
            color={APalette.reverb}
            title={'HPF'}
            hasDecimalsProp={true}
            defaultValueProp={testDecayDefault}
            setParentValue={setTestDecay}
          />
          <Typography>Test: {testDecay}</Typography>
        </Stack>
      </Stack>
    </>
  );
};
