import Slider from '@mui/material/Slider';
import * as Tone from 'tone';
import { useContext, useMemo, useState } from 'react';
import { GlobalOutputsContext } from '../GlobalOutputsContext';
import { Stack } from '@mui/system';
import { darken } from '@mui/material';
import { Knob } from '../FX/Knob';
import { AButton } from '../theme';

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

  const masterOutput = useMemo(
    () => new Tone.Channel().receive('masterFXOut'),
    []
  );
  const recorder = useMemo(() => new Tone.Recorder(), []);
  masterOutput.connect(recorder);
  const [isRecording, setIsRecording] = useState(false);

  const RecordButton = () => {
    return (
      <AButton
        onClick={() => {
          setIsRecording(true);
          recorder.start();
        }}
      >
        Record
      </AButton>
    );
  };
  const StopButton = () => {
    const handleStop = async () => {
      setIsRecording(false);
      const recording = await recorder.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement('a');
      anchor.download = 'recording.webm';
      anchor.href = url;
      anchor.click();
    };

    return <AButton onClick={handleStop}>Stop</AButton>;
  };

  const sliders = useMemo(() => {
    return globalOutputs?.map((track, i) => {
      return (
        <Stack justifyContent="center" alignItems="center" key={i}>
          <Slider
            sx={CustomSliderStyles}
            orientation="vertical"
            defaultValue={100}
            valueLabelDisplay="auto"
            onChange={(e, value) => {
              track.set({ volume: Tone.gainToDb((value as number) / 100) });
            }}
          />
          <Knob
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
  console.log;
  return (
    <Stack>
      <Stack pt={2} spacing={1} height={300} direction="row">
        {sliders}
      </Stack>
      {isRecording ? <StopButton /> : <RecordButton />}
    </Stack>
  );
};
