import { Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { Handle, Position, useStore } from 'reactflow';

import { DoodlerPage } from '../pages/DoodlerPage';
import { AButton, APalette } from '../theme';
import * as Tone from 'tone';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];
export function DoodlerNode() {
  const zoom = useStore(zoomSelector);
  console.log({ zoom });
  const [changeSynth, setChangeSynth] = useState(false);
  const synth = new Tone.PolySynth();
  return (
    <>
      <Handle type="target" position={Position.Right} />
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

      <DoodlerPage
        soundSource={changeSynth ? synth : undefined}
        zoomFactor={zoom}
      />
      <Handle type="source" position={Position.Left} id="a" />
      <AButton onClick={() => setChangeSynth(true)}></AButton>
    </>
  );
}
