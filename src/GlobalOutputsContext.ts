import { createContext, useMemo } from 'react';
import * as Tone from 'tone';

type ArrayLengthMutationKeys =
  | 'splice'
  | 'push'
  | 'pop'
  | 'shift'
  | 'unshift'
  | number;

type ArrayItems<T extends Array<any>> = T extends Array<infer TItems>
  ? TItems
  : never;

export type FixedLengthArray<T extends any[]> = Pick<
  T,
  Exclude<keyof T, ArrayLengthMutationKeys>
> & { [Symbol.iterator]: () => IterableIterator<ArrayItems<T>> } & {
  [index: number]: ArrayItems<T>;
};

export const GlobalOutputsContext = createContext<FixedLengthArray<
  Tone.Channel[]
> | null>(null);
