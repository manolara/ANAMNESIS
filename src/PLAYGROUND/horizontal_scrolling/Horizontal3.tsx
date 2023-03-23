import * as Tone from 'tone';

import { RefObject, useEffect, useMemo, useRef } from 'react';

import { Box, darken, Icon, Stack } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
// import { Reverb, ReverbOut } from '../../FX/Reverb';
import { AButton } from '../../theme';
import { Delay } from '../../FX/Delay';
import { Compressor } from '../../FX/Compressor';
import { useFX } from '../useFX';
import { Reverb } from '../../FX/Reverb';
import { Lofi } from '../../FX/Lofi';
import { Flow } from '../../pages/Flow';
import { EQ3 } from '../../FX/EQ3';
import { ReactFlowProvider } from 'reactflow';
import { SpectralAnalyzer } from '../../Processing_Page/SpectralAnalyzer';
import { Oscilloscope } from '../../Processing_Page/Osciloscope';
import { VolumePanSliders } from '../../playbackCtrl/VolumePanSliders';

const testSynth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
});

export const Horizontal3 = () => {
  const masterFXIn = useMemo(
    () => new Tone.Channel().receive('mixerOutput'),
    []
  );
  const masterFXOut = useMemo(() => new Tone.Channel().send('masterFXOut'), []);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const handleScroll = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  };
  const reverb = useFX(Reverb);
  const delay = useFX(Delay);
  const compressor = useFX(Compressor);
  const lofi = useFX(Lofi);
  const eq = useFX(EQ3);
  const spectralAnalyzer = useFX(SpectralAnalyzer);
  const oscilloscope = useFX(Oscilloscope);
  useEffect(() => {
    masterFXIn.connect(reverb.input);
    reverb.output.connect(delay.input);
    delay.output.connect(compressor.input);
    compressor.output.connect(lofi.input);
    lofi.output.connect(eq.input);
    eq.output.connect(spectralAnalyzer.input);
    spectralAnalyzer.output.connect(oscilloscope.input);
    oscilloscope.output.fan(masterFXOut, Tone.Destination);
  }, []);
  return (
    <Stack
      minWidth="100vw"
      direction="row"
      sx={{ scrollSnapType: 'x mandatory' }}
      overflow="auto"
    >
      <ReactFlowProvider>
        <Stack
          direction={'row'}
          height="100vh"
          minWidth="100vw"
          id="page1"
          sx={{ scrollSnapAlign: 'start' }}
          ref={page1Ref}
        >
          <Box width="100%">
            <Flow />
          </Box>
          <Box
            justifyContent={'center'}
            flexDirection="column"
            display="flex"
            mr={3}
          >
            <Icon onClick={() => handleScroll(page2Ref)}>
              <EastIcon />
            </Icon>
          </Box>
        </Stack>
      </ReactFlowProvider>
      {/* page 2 */}
      <Stack
        direction="row"
        minWidth="100vw"
        height="100vh"
        id="page2"
        ref={page2Ref}
        sx={{
          position: 'relative',
          scrollSnapAlign: 'start',
          backgroundColor: '#b4ddff',
        }}
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
          {/* add border color */}

          <Stack pl={4} pt={10}>
            <Box border={`2px solid ${darken('#b4ddff', 0.2)}`}>
              {reverb.component}
              {delay.component}
              {compressor.component}
              {lofi.component}
              {eq.component}
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={40}
            position="absolute"
            bottom="10%"
            left="24%"
            alignItems={'end'}
          >
            <VolumePanSliders />
            {oscilloscope.component}
          </Stack>
          <Box position="absolute" top="15%" left="20%">
            {spectralAnalyzer.component}
          </Box>
          <Box position="absolute" top="50%" left="20%"></Box>
          {/* set image to original size */}
          <img
            src="assets/water_1.gif"
            style={{
              position: 'absolute',
              top: '3%',
              left: '65%',

              border: '1.5px solid #73ad21',
              width: '450px',
              height: 'auto',
            }}
          />
          <img
            src="assets/water_2.gif"
            style={{
              position: 'absolute',
              top: '33%',
              left: '52%',
              border: '1.5px solid #f5c990',
              width: '342px',
              height: 'auto',
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
