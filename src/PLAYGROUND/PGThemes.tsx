/* eslint-disable react/destructuring-assignment */
import { Button } from '@mui/material';

export const PGButton = (props: any) => (
  <Button
    sx={{
      padding: 1, // means "theme.spacing(1)", NOT "1px"
      borderRadius: '4px',
      fontFamily: 'futura',
    }}
  >
    {props.children}
  </Button>
);
