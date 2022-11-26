/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */

import {
  styled,
  experimental_sx as sx,
  createTheme,
  ButtonBase,
} from '@mui/material';

export const AButton = styled(ButtonBase)(
  sx({
    color: 'black',
    backgroundColor: '#ffb8b8',
    fontFamily: 'futura',
    fontSize: '20px',
    px: 2,
    py: 1,
    borderRadius: 1,
    '&:hover': {
      boxShadow: 'inset 100rem 0 0 0 #f8abab',
    },
  })
);

export const customTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
