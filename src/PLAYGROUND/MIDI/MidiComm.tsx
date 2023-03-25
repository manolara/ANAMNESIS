import { Midi, Track } from '@tonejs/midi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input, InputEventNoteon, InputEventNoteoff } from 'webmidi';
import * as Tone from 'tone';

import WebMidi from 'webmidi';
import { getCurrentBar } from '../../utils/utils';
import { Metronome } from '../../pages/Metronome';
import { MidiAnimation } from './MidiAnimation';

//
// import Buffer

function exportMidiToBlob(midi: Midi) {
  debugger;
  const midiBuffer = Buffer.from(midi.toArray());

  const fileData = new Blob([midiBuffer], {
    type: 'audio/mid',
  });

  return fileData;
}

function downloadFile(fileName: string, fileContent: Blob) {
  const url = window.URL.createObjectURL(fileContent);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}`;
  a.click();
  debugger;
  window.URL.revokeObjectURL(url);
}

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
  // const midiData = fs.readFileSync('test.mid');
  // fs.writeFileSync('output.mid', Buffer.from(midi.toArray()));
  const midi = useMemo(() => new Midi(), []);
  const track = useMemo(() => midi.addTrack(), []);
  const [trackProp, setTrackProp] = useState<Track>(track);

  const recordingStateRef = useRef<ImidiInstrumentState>(
    midiInstrumentState.idle
  );

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
    const addInputListeners = (input: Input) => {
      input.removeListener('noteon');
      input.removeListener('noteoff');
      input.addListener('noteon', 'all', onNoteOn);
      input.addListener('noteoff', 'all', onNoteOff);
    };

    // input.addListener('controlchange', 'all', onControlChange);
  }, []);

  const onNoteOn = (event: InputEventNoteon) => {
    const freq = Tone.Frequency(event.note.number, 'midi').toNote();
    const relativeTick = Tone.Transport.ticks - startingTick;
    if (recordingStateRef.current === midiInstrumentState.recording) {
      notesCurrentlyPlaying[event.note.number] = relativeTick;
    }
    console.log('trigger Ticks', Tone.Transport.ticks);
    PolySynth.triggerAttack(freq, Tone.now(), event.velocity);
    console.log(freq);
  };

  const onNoteOff = (event: InputEventNoteoff) => {
    if (recordingStateRef.current === midiInstrumentState.recording) {
      const relativeTick = Tone.Transport.ticks - startingTick;
      console.log(recordingStateRef.current);
      console.log('release Ticks', relativeTick);
      track.addNote({
        midi: event.note.number,
        ticks: notesCurrentlyPlaying[event.note.number],
        durationTicks: relativeTick - notesCurrentlyPlaying[event.note.number],
      });
    }
    console.log('received Ticks', notesCurrentlyPlaying[event.note.number]);
    console.log(
      'duration Ticks',
      Tone.Transport.ticks -
        notesCurrentlyPlaying[event.note.number] -
        startingTick
    );

    const freq = Tone.Frequency(event.note.number, 'midi').toNote();

    PolySynth.triggerRelease(freq, Tone.now()),
      //remove the note from the currently playing notes
      delete notesCurrentlyPlaying[event.note.number];
  };
  useEffect(() => {}, [recordingState]);

  const startPlayback = () => {
    midiLoop.start();
  };
  const midiLoop = useMemo(
    () =>
      new Tone.Loop((time) => {
        const now = Tone.now();
        const notes = track.notes;
        notes.forEach((note) => {
          console.log(note.name, note.time, note.duration, note.velocity);
          //convert the ticks to seconds
          const time =
            note.ticks *
              (60 / (Tone.Transport.bpm.value * Tone.Transport.PPQ)) +
            now;
          const duration = Tone.Ticks(note.durationTicks).toSeconds();

          PolySynth.triggerAttackRelease(
            note.name,
            duration,
            time,
            note.velocity
          );
          //note.midi, note.time, note.duration, note.name
        });
      }, '1m'),
    []
  );

  //the track also has a channel and instrument
  //track.instrument.name

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
            recordingStateRef.current = midiInstrumentState.recording;
          }, `${start}:0:0`);

          Tone.Transport.scheduleOnce(() => {
            setRecordingState(midiInstrumentState.playback);
            recordingStateRef.current = midiInstrumentState.playback;
            startPlayback();
            console.log('wtf');
            const midiBlob = exportMidiToBlob(midi);
            downloadFile(`my-midi-file.mid`, midiBlob);
          }, `${end}:0:0`);
        }}
      >
        record
      </button>
      <button onClick={() => console.log(track)}> print</button>
      <MidiAnimation midi={midi} durationTicks={midi.durationTicks} />
    </>
  );
};
