import * as Tone from 'tone';

import { RefObject, useEffect, useRef } from 'react';

import { Box, Button, Icon, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Reverb, ReverbFX } from '../../FX/Reverb';
import { AButton } from '../../theme';
import { Delay } from '../../FX/Delay';

const testSynth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
}).connect(ReverbFX);

export const Horizontal3 = () => {
  useEffect(() => {
    testSynth.connect(ReverbFX);
  }, [ReverbFX]);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const handleScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
    console.log('scrolling');
  };

  return (
    <Stack
      minWidth="100vw"
      direction="row"
      sx={{ scrollSnapType: 'x mandatory' }}
      overflow="auto"
    >
      <Stack
        justifyContent={'center'}
        alignItems="end"
        height="100vh"
        minWidth="100vw"
        id="page1"
        sx={{ scrollSnapAlign: 'start' }}
        ref={page1Ref}
      >
        <Box mr={3}>
          <Icon onClick={() => handleScroll(page2Ref)}>
            <EastIcon />
          </Icon>
        </Box>
      </Stack>
      {/* page 2 */}
      <Stack
        direction="row"
        minWidth="100vw"
        height="100vh"
        id="page2"
        ref={page2Ref}
        sx={{ position: 'relative', scrollSnapAlign: 'start' }}
      >
        <Stack height="100%" width="100%" direction="row">
          {/* arrow */}
          <Stack
            height="100%"
            justifyContent={'center'}
            alignItems="start"
            ml={3}
          >
            <Icon onClick={() => handleScroll(page1Ref)}>
              <WestIcon />
            </Icon>
          </Stack>
          {/* FX */}
          <Stack>
            <Reverb />
            <Delay />
          </Stack>
          <AButton
            onClick={() => {
              testSynth.triggerAttack('C4', Tone.now(), 0.2);
            }}
            sx={{ maxHeight: '10%' }}
          >
            Attack
          </AButton>
          <AButton
            onClick={() => {
              testSynth.triggerRelease();
            }}
            sx={{ maxHeight: '10%' }}
          >
            Release
          </AButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
