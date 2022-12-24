import * as Tone from 'tone';

import { RefObject, useRef } from 'react';

import { Box, Icon, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Reverb, ReverbOut } from '../../FX/Reverb';
import { AButton, APalette } from '../../theme';
import { Delay, DelayOut } from '../../FX/Delay';
import { Compressor, CompressorOut } from '../../FX/Compressor';
import { Lofi, LofiOut } from '../../FX/Lofi';
import { Synthesizer } from '../../Instruments/Synthesizer';

const testSynth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
});

export const Horizontal3 = () => {
  LofiOut.toDestination();
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
            {/* <Reverb input={testSynth} color={APalette.reverb} /> */}
            <Delay input={ReverbOut} color={APalette.delay} />
            {/* <Compressor input={DelayOut} color={APalette.orange} />

            <Lofi input={CompressorOut} color={APalette.lofi} /> */}
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
