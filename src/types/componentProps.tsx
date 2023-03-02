import * as Tone from 'tone';

export interface InstrumentProps {
  soundSource?: Tone.PolySynth;
}

export interface FXProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

export interface SoundSourceProps {
  soundEngine: Tone.MonoSynth | Tone.PolySynth;
  output: Tone.Signal;
}
