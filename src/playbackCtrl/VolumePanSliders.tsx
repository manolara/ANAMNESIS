import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const CustomSliderStyles = {
  '& .MuiSlider-thumb': {
    color: '#749761',
  },
  '& .MuiSlider-thumb:hover': {
    boxShadow: 'none',
  },
  '& .MuiSlider-track': {
    color: '#749761',
  },
  '& .MuiSlider-rail': {
    color: '#acc4e4',
  },
  '& .MuiSlider-active': {
    color: '#f5e278',
  },
};
export const VolumePanSliders = () => {
  return (
    <Box width={300} height={300}>
      <Slider
        sx={CustomSliderStyles}
        orientation="vertical"
        defaultValue={50}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};
