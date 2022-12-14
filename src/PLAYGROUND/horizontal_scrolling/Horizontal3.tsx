import { RefObject, useRef } from 'react';

import { Page2 } from './Page2';
import { Link } from 'react-scroll';
import { Box, Button, Icon, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

export const Horizontal3 = () => {
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

      <Stack
        justifyContent={'center'}
        alignItems="start"
        minWidth="100vw"
        height="100vh"
        id="page2"
        ref={page2Ref}
        sx={{ position: 'relative', scrollSnapAlign: 'start' }}
        //overflow="hidden"
      >
        <Box ml={3}>
          <Icon onClick={() => handleScroll(page1Ref)}>
            <WestIcon />
          </Icon>
        </Box>
      </Stack>
    </Stack>
  );
};
