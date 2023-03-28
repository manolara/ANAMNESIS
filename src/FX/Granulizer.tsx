import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

interface GranulizerProps {
  input: Tone.ToneAudioBuffer;
  output: Tone.Signal;
  grainSize: number;
  overlap: number;
  attack: number;
  release: number;
}

export const Granulizer = ({
  input,
  output,
  grainSize,
  overlap,
  attack,
  release,
}: GranulizerProps) => {
  const [granularEffect, setGranularEffect] = useState<Tone.GrainPlayer | null>(
    null
  );

  useEffect(() => {
    // Create a new granular effect
    const newGranularEffect = new Tone.GrainPlayer({
      url: input,
      grainSize: grainSize,
      overlap: overlap,
    }).toDestination();

    // Connect granular effect to the output
    newGranularEffect.connect(output);

    // Update the state with the new effect
    setGranularEffect(newGranularEffect);

    return () => {
      // Clean up the effect when the component is unmounted
      newGranularEffect.disconnect(output);
      newGranularEffect.dispose();
    };
  }, [input, output, grainSize, overlap, attack, release]);

  return null;
};
