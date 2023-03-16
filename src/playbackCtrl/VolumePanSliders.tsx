import Slider from '@mui/material/Slider';
import * as Tone from 'tone';
import { useContext, useMemo } from 'react';
import { GlobalOutputsContext } from '../GlobalOutputsContext';
import { Stack } from '@mui/system';
import { darken } from '@mui/material';
import { Knob } from '../FX/Knob';

const CustomSliderStyles = {
  '& .MuiSlider-thumb': {
    color: '#f8abab',
    boxShadow: 'none !important',
  },

  '& .MuiSlider-track': {
    color: darken('#D3A9C9', 0.2),
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

  const sliders = useMemo(() => {
    return globalOutputs?.map((track, i) => {
      return (
        <Stack justifyContent="center" alignItems="center">
          <Slider
            key={i}
            sx={CustomSliderStyles}
            orientation="vertical"
            defaultValue={100}
            valueLabelDisplay="auto"
            onChange={(e, value) => {
              track.set({ volume: Tone.gainToDb((value as number) / 100) });
            }}
          />
          <Knob
            key={i}
            title="Pan"
            defaultValue={0}
            min={-50}
            max={50}
            onValueChange={(value) => {
              track.set({ pan: value / 50 });
            }}
          />
        </Stack>
      );
    });
  }, [globalOutputs]);
  return (
    <Stack pt={2} spacing={1} height={300} direction="row">
      {sliders}
    </Stack>
  );
};
