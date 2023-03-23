import { Midi, Track } from '@tonejs/midi';
import { useEffect, useMemo, useState } from 'react';
import { Input, InputEventNoteon, InputEventNoteoff } from 'webmidi';
import * as Tone from 'tone';

import WebMidi from 'webmidi';
const PolySynth = new Tone.PolySynth().toDestination();

const notesCurrentlyPlaying: { [key: number]: number } = {};
const startingTick = 0;

const onNoteOn = (event: InputEventNoteon) => {
  const freq = Tone.Frequency(event.note.number, 'midi').toNote();
  PolySynth.triggerAttack(freq, Tone.now(), event.velocity);
  console.log(freq);
  //assign ticks when triggered to the note
  notesCurrentlyPlaying[event.note.number] =
    Tone.Transport.ticks - startingTick;
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

const onNoteOff = (event: InputEventNoteoff, track: Track) => {
  track.addNote({
    midi: event.note.number,
    ticks: notesCurrentlyPlaying[event.note.number],
    duration: Tone.Transport.ticks - notesCurrentlyPlaying[event.note.number],
  }),
    //remove the note from the currently playing notes
    delete notesCurrentlyPlaying[event.note.number];
};

const setDevicesByName = () => {
  WebMidi.inputs.forEach(function (input, key) {
    console.log(input.name);
  });
  WebMidi.outputs.forEach(function (output, key) {
    console.log(output.name);
  });
};

export const MidiWriting = () => {
  const [isRecording, setIsRecording] = useState(false);
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
      input.addListener('noteoff', 'all', (event) => onNoteOff(event, track));
      // input.addListener('pitchbend', 'all', onPitchBend);
      // input.addListener('controlchange', 'all', onControlChange);
    }
  }, []);

  return (
    <>
      <button onClick={() => Tone.start()}>yo</button>
      <button onClick={() => console.log(Track)}> print</button>
    </>
  );
};
