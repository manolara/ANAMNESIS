import * as Tone from 'tone';
import { Piano } from '@tonejs/piano';

export type SoundEngine = Tone.MonoSynth | Tone.PolySynth | Piano;

export interface InstrumentProps {
  soundSource?: Tone.PolySynth;
}

export interface FXProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

export interface SoundSourceProps<SE extends SoundEngine> {
  soundEngine: SE;

  output: Tone.Signal;
}
