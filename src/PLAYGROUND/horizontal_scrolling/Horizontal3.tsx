import * as Tone from 'tone';

import { RefObject, useRef } from 'react';

import { Box, Icon, Stack } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
// import { Reverb, ReverbOut } from '../../FX/Reverb';
import { AButton, APalette } from '../../theme';
import { Delay } from '../../FX/Delay';
import { Compressor } from '../../FX/Compressor';
import { useFX } from '../useFX';
import { Reverb } from '../../FX/Reverb';
import { Lofi } from '../../FX/Lofi';

const testSynth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
});

export const Horizontal3 = () => {
  // LofiOut.toDestination();
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const handleScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
    console.log('scrolling');
  };
  const reverb = useFX(Reverb);
  const delay = useFX(Delay);
  const compressor = useFX(Compressor);
  const lofi = useFX(Lofi);
  testSynth.connect(reverb.input);
  reverb.output.connect(delay.input);
  delay.output.connect(compressor.input);
  compressor.output.connect(lofi.input);
  lofi.output.toDestination();

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
            {reverb.component}
            {delay.component}
            {compressor.component}
            {lofi.component}
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
