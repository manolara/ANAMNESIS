import * as Tone from 'tone';
import { Time } from 'tone/build/esm/core/type/Units';

export const startLoop = (loop: Tone.Loop, time: Time = Tone.now()) => {
  if (Tone.Transport.state !== 'started') {
    loop.start(0);
    Tone.Transport.start();
  } else loop.start(time);
};
export const loopLengthSeconds = (barLength: number) => {
  return barLength * ((4 * 60) / Tone.Transport.bpm.value);
};

export const barVisualizerSpeed = (barLength: number, width: number) => {
  const totalTime = loopLengthSeconds(barLength);
  return width / (totalTime * 30);
};

export const getCurrentBeat = () => {
  return +Tone.Transport.position.toString().split(':')[1];
};

export const getCurrentBar = () => {
  return +Tone.Transport.position.toString().split(':')[0];
};
