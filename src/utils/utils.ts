import * as Tone from 'tone';
import { Time } from 'tone/build/esm/core/type/Units';
import { vi } from 'vitest';

export const startLoop = (
  loop: Tone.Loop,
  time: string = Tone.now().toString()
) => {
  console.log(time, 'time inside startLoop');
  if (Tone.Transport.state === 'stopped') {
    loop.start(0);
    Tone.Transport.start();
  } else {
    console.log(time);
    loop.start(getNextSubdivision(time));
  }
};

// export const loopLengthSeconds = (barLength: number) => {
//   return barLength * ((4 * 60) / Tone.Transport.bpm.value);
// };

// export const barVisualizerSpeed = (barLength: number, width: number) => {
//   const totalTime = loopLengthSeconds(barLength);
//   return width / (totalTime * 30);
// };

export const getCurrentBeat = () => {
  return +Tone.Transport.position.toString().split(':')[1];
};

export const getCurrentBar = () => {
  return +Tone.Transport.position.toString().split(':')[0];
};
export const getNextSubdivision = (subdivision: string) => {
  //use regex to extract the letter from the subdivision
  const letter = subdivision.match(/[a-z]/i)?.[0];
  let number = subdivision.match(/[0-9]/i)?.[0] || 1;
  number = +number;

  if (letter === 'm') {
    let nextBar = getCurrentBar() + number;
    return `${nextBar}:0:0`;
  } else if (letter === 'n') {
    let nextBeat = getCurrentBeat() + number;
    let futureBars = Math.floor(nextBeat / 4);
    nextBeat = nextBeat % 4;
    return `${getCurrentBar() + futureBars}:${nextBeat}:0`;
  }
};

// export const mapLog = (
//   value: number,
//   start1: number,
//   stop1: number,
//   start2: number,
//   stop2: number
// ): number => {
//   start2 = Math.log(start2);
//   stop2 = Math.log(stop2);

//   let outgoing = Math.exp(
//     start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
//   );
//   console.log({ outgoing });

//   let badness: string | null = null;
//   if (outgoing !== outgoing) {
//     badness = 'NaN (not a number)';
//   } else if (
//     outgoing === Number.NEGATIVE_INFINITY ||
//     outgoing === Number.POSITIVE_INFINITY
//   ) {
//     badness = 'infinity';
//   }
//   if (badness != null) {
//     const msg = `map(${value}, ${start1}, ${stop1}, ${start2}, ${stop2}) called, which returns ${badness}`;
//     console.warn(msg);
//   }
//   return outgoing;
// };

export const mapLog = (
  value: number,
  minp: number,
  maxp: number,
  minv: number,
  maxv: number
): number => {
  if (minv == 0) {
    minv = 0.2;
  }

  var minv = Math.log(minv);
  var maxv = Math.log(maxv);

  // calculate adjustment factor
  var scale = (maxv - minv) / (maxp - minp);

  return Math.exp(minv + scale * (value - minp));
};

export const mapLogInv = (
  value: number,
  minp: number,
  maxp: number,
  minv: number,
  maxv: number
) => {
  // position will be between 0 and 100
  if (minv == 0) {
    minv = 0.2;
  }
  // The result should be between 100 an 10000000
  var minv = Math.log(minv);
  var maxv = Math.log(maxv);

  // calculate adjustment factor
  var scale = (maxv - minv) / (maxp - minp);

  return (Math.log(value) - minv) / scale + minp;
};
