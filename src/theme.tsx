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
  typography: {
    fontFamily: `"Futura","Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: 100,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export const APalette = {
  pink: '#ffb8b8',
  purple: '#a89db9',
  orange: '#FFDCB8',
  reverb: '#b8b9ff',
  delay: '#fffeb8',
  lofi: '#bde0fe',
};
