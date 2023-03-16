import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import * as Tone from 'tone';
import { useContext, useMemo } from 'react';
import { GlobalOutputsContext } from '../GlobalOutputsContext';
import { Stack } from '@mui/system';

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
  const globalOutputs = useContext(GlobalOutputsContext);
  const track1 = globalOutputs?.[0] as Tone.Channel;

  const sliders = useMemo(() => {
    return globalOutputs?.map((track, i) => {
      return (
        <Slider
          sx={CustomSliderStyles}
          orientation="vertical"
          defaultValue={100}
          valueLabelDisplay="auto"
          onChange={(e, value) => {
            track.set({ volume: Tone.gainToDb((value as number) / 100) });
          }}
        />
      );
    });
  }, [globalOutputs]);
  return (
    <Stack pt={2} spacing={1} height={300} direction="row">
      {sliders}
    </Stack>
  );
};
