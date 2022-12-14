import { useRef } from 'react';

import { Page2 } from './Page2';
import { Link } from 'react-scroll';
import { Box, Icon, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

export const Horizontal = () => {
  return (
    <Stack minWidth="100vw" direction="row">
      <Stack
        justifyContent={'center'}
        alignItems="end"
        height="100vh"
        minWidth="100vw"
        id="page1"
        overflow="hidden"
      >
        <Box mr={3}>
          <Link horizontal smooth to={'page2'}>
            <Icon>
              <EastIcon />
            </Icon>
          </Link>
        </Box>
      </Stack>

      <Stack
        justifyContent={'center'}
        alignItems="start"
        minWidth="100vw"
        height="100vh"
        id="page2"
        sx={{ position: 'relative' }}
        overflow="hidden"
      >
        <Box ml={3}>
          <Link horizontal smooth to={'page1'}>
            <Icon>
              <WestIcon />
            </Icon>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
};
