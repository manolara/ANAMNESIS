import { APalette } from '../theme';
import { Icon, Stack } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export const DragHandle = () => {
  return (
    <Stack
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
