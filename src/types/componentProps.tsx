import * as Tone from 'tone';
import { Piano } from '@tonejs/piano';

export interface InstrumentProps {
  soundSource?: Tone.PolySynth;
}

export interface FXProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

export interface SoundSourceProps<
  SE extends Tone.MonoSynth | Tone.PolySynth | Piano
> {
  soundEngine: SE;

  output: Tone.Signal;
}
