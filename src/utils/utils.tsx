import * as Tone from 'tone';
import { Time } from 'tone/build/esm/core/type/Units';

export const startLoop = (loop: Tone.Loop, time: Time = '4n') => {
  if (Tone.Transport.state !== 'started') {
    loop.start(0);
    Tone.Transport.start();
  } else loop.start(time);
};
