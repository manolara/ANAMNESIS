import { APalette } from '../theme';
import { Stack } from '@mui/material';

export const DragHandle = () => {
  return (
    <Stack
      sx={{ cursor: 'move' }}
      height={18}
      width={18}
      className="custom-drag-handle"
      bgcolor={APalette.beige}
      borderRadius="100%"
      style={{
        transform: ' translate(-100%, 0)',
      }}
    ></Stack>
  );
};
