import { Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';

import * as Tone from 'tone';
import { FXProps } from '../types/componentProps';
import { Knob } from './Knob';

export const Distortion = ({ input, output }: FXProps) => {
  const distortionDefault = 5;
  const wetDefault = 50;
  const distortionEngine = useMemo(
    () =>
      new Tone.Distortion({
        distortion: distortionDefault,
        wet: wetDefault / 100,
      }),
    []
  );

  useEffect(() => {
    input.chain(distortionEngine, output);

    return () => {
      input.disconnect(distortionEngine);
      distortionEngine.disconnect(output);
      distortionEngine.dispose();
      input.dispose();
      output.dispose();
    };
  }, [input]);

  return (
    <>
      <Stack
        // width="30%"
        height="fit-content"
        sx={{
          p: 1,
          backgroundColor: '#f5f5f5',
          minWidth: 'fit-content',
        }}
      >
        <Typography width="100%" className="unselectable" mb={1}>
          Distortion
        </Typography>
        <Stack className="unselectable" direction="row" spacing={3}>
          <Knob
            min={0}
            max={10}
            title={'Distortion'}
            hasDecimals={true}
            defaultValue={distortionDefault}
            onValueChange={(value) =>
              distortionEngine.set({ distortion: value / 10 })
            }
          />
          <Knob
            title={'Mix'}
            isExp={false}
            defaultValue={wetDefault}
            onValueChange={(value) =>
              distortionEngine.set({ wet: value / 100 })
            }
          />
          <Knob title={'HPF'} isExp min={20} max={2000} />
        </Stack>
      </Stack>
    </>
  );
};
