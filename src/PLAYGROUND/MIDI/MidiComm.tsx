import { Midi, Track } from '@tonejs/midi';
import { useEffect, useMemo, useState } from 'react';
import { Input, InputEventNoteon, InputEventNoteoff } from 'webmidi';
import * as Tone from 'tone';

import WebMidi from 'webmidi';
import { getCurrentBar } from '../../utils/utils';
import { Metronome } from '../../pages/Metronome';
const PolySynth = new Tone.PolySynth().toDestination();

const notesCurrentlyPlaying: { [key: number]: number } = {};

const setDevicesByName = () => {
  WebMidi.inputs.forEach(function (input, key) {
    console.log(input.name);
  });
};

//make enum for instrument state (idle, recording, playback) using object as const

const midiInstrumentState = {
  idle: 'idle',
  recording: 'recording',
  playback: 'playback',
} as const;
type ImidiInstrumentState =
  typeof midiInstrumentState[keyof typeof midiInstrumentState];

export const MidiComm = () => {
  const [recordingState, setRecordingState] = useState<ImidiInstrumentState>(
    midiInstrumentState.idle
  );
  let startingTick = 0;
  // create a new midi file

  // const midiData = fs.readFileSync('test.mid');
  // fs.writeFileSync('output.mid', Buffer.from(midi.toArray()));
  const midi = useMemo(() => new Midi(), []);
  const track = useMemo(() => midi.addTrack(), []);
  useEffect(() => {
    WebMidi.enable((err) => {
      WebMidi.inputs.forEach(function (input, key) {
        addInputListeners(input);
      });
      WebMidi.addListener('connected', function (e) {
        if (e.port.type === 'input') {
          addInputListeners(e.port);
        }
        setDevicesByName();
      });
      WebMidi.addListener('disconnected', function (e) {
        setDevicesByName();
      });
    });
    function addInputListeners(input: Input) {
      input.removeListener('noteon');
      input.removeListener('noteoff');
      input.addListener('noteon', 'all', onNoteOn);
      input.addListener('noteoff', 'all', onNoteOff);
      // input.addListener('pitchbend', 'all', onPitchBend);
      // input.addListener('controlchange', 'all', onControlChange);
    }
  }, []);

  const onNoteOn = (event: InputEventNoteon) => {
    const freq = Tone.Frequency(event.note.number, 'midi').toNote();
    //assign ticks when triggered to the note
    if (recordingState === midiInstrumentState.recording) {
      notesCurrentlyPlaying[event.note.number] =
        Tone.Transport.ticks - startingTick;
    }
    PolySynth.triggerAttack(freq, Tone.now(), event.velocity);
    console.log(freq);

    WebMidi.outputs[0].playNote(
      event.note.name + event.note.octave,
      event.channel,
      {
        velocity: event.velocity,
      }
    );
  };
  const onNoteOff = (event: InputEventNoteoff) => {
    if (recordingState !== midiInstrumentState.recording) {
      track.addNote({
        midi: event.note.number,
        ticks: notesCurrentlyPlaying[event.note.number],
        durationTicks:
          Tone.Transport.ticks - notesCurrentlyPlaying[event.note.number],
      });
    }
    const freq = Tone.Frequency(event.note.number, 'midi').toNote();

    PolySynth.triggerRelease(freq, Tone.now()),
      //remove the note from the currently playing notes
      delete notesCurrentlyPlaying[event.note.number];
  };

  return (
    <>
      <Metronome />
      <button
        onClick={() => {
          Tone.start();
          Tone.Transport.start();
        }}
      >
        start
      </button>
      <button
        style={{
          backgroundColor:
            recordingState === midiInstrumentState.recording ? 'red' : 'white',
        }}
        onClick={() => {
          if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
          }

          let start = getCurrentBar() + 1;
          let end = start + 1;

          Tone.Transport.scheduleOnce(() => {
            startingTick = Tone.Transport.ticks;
            setRecordingState(midiInstrumentState.recording);
          }, `${start}:0:0`);

          Tone.Transport.scheduleOnce(() => {
            setRecordingState(midiInstrumentState.playback);
          }, `${end}:0:0`);
        }}
      >
        record
      </button>
      <button onClick={() => console.log(track)}> print</button>
    </>
  );
};
