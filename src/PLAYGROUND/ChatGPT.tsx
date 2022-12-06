import React, { useState, useEffect } from 'react';
import p5 from 'p5';
import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';

// create the metronome component
export const ChatGPT = () => {
  // state to track the bpm
  const [bpm, setBpm] = useState(60);

  // create the p5 sketch
  const sketch = (p: P5CanvasInstance) => {
    // create a new synth to play the sound
    const synth = new Tone.Synth().toDestination();

    // create a new loop to play the metronome sound
    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease('C4', '8n', time);
    }, '4n').start(0);

    // set the bpm of the loop based on the state
    Tone.Transport.bpm.value = bpm;

    // update the bpm when the state changes
    useEffect(() => {
      Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    // handle the input change to update the bpm state
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setBpm(parseInt(event.target.value));
    };

    // render the input to control the bpm
    return (
      <div>
        <label>BPM:</label>
        <input type="number" value={bpm} onChange={handleChange} />
      </div>
    );
  };

  // render the p5 sketch inside the react-p5-wrapper component
  return (
    <>
      <ReactP5Wrapper sketch={sketch} />
      <div>yoo</div>
    </>
  );
};
