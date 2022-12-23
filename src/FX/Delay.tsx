import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { APalette } from '../theme';

import * as Tone from 'tone';
import { Knob } from './Knob';

interface DelayProps {
  input: Tone.ToneAudioNode;
  color: string;
}
export const DelayOut = new Tone.Signal();
const DelayFX = new Tone.FeedbackDelay();

export const Delay = ({ color, input }: DelayProps) => {
  input.chain(DelayFX, DelayOut);
  const feedbackDefault = 20;
  const mixDefault = 50;
  const [feedback, setFeedback] = React.useState(feedbackDefault);
  const [mix, setMix] = React.useState(mixDefault);

  DelayFX.set({ feedback: feedback / 100, wet: mix / 100 });
  console.log('wetness', DelayFX.get().wet);
  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{ p: 1, backgroundColor: color, minWidth: 'fit-content' }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Delay
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            title={'Feedback'}
            defaultValue={feedbackDefault}
            setParentValue={setFeedback}
          />
          <Knob
            title={'Mix'}
            isExp={false}
            defaultValue={mixDefault}
            setParentValue={setMix}
          />
          <Knob title={'Filter'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
