import { Midi, Track } from '@tonejs/midi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input, InputEventNoteon, InputEventNoteoff } from 'webmidi';
import * as Tone from 'tone';
import WebMidi from 'webmidi';
import { getCurrentBar } from '../../utils/utils';
import { Metronome } from '../../pages/Metronome';
import { MidiAnimation } from './MidiAnimation';
import { AButton } from '../../theme';
import { Icon } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import { InstrumentDataProps } from '../../pages/Flow';
import { InstrumentProps } from '../../types/componentProps';

//
// import Buffer

function exportMidiToBlob(midi: Midi) {
  // debugger;
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
  // debugger;
  window.URL.revokeObjectURL(url);
}

const notesCurrentlyPlaying: { [key: number]: number } = {};

const setDevicesByName = () => {
  WebMidi.inputs.forEach(function (input, key) {
    console.log(input.name);
  });
};

const midiInstrumentState = {
  idle: 'idle',
  recording: 'recording',
  playback: 'playback',
} as const;

type ImidiInstrumentState = keyof typeof midiInstrumentState;

export const MidiInput = ({ soundSource }: InstrumentProps) => {
  const [recordingState, setRecordingState] = useState<ImidiInstrumentState>(
    midiInstrumentState.idle
  );
  const startingTick = useRef<number>(0);
  // const midiData = fs.readFileSync('test.mid');
  // fs.writeFileSync('output.mid', Buffer.from(midi.toArray()));
  const soundEngine = useMemo(() => soundSource, [soundSource]);
  useEffect(() => {
    if (!soundEngine) {
      soundEngine = new Tone.PolySynth().toDestination();
    }
  });
  const midi = useMemo(() => new Midi(), []);
  const [track, setTrack] = useState<Track>(midi.addTrack());
  const trackRef = useRef<Track>(track);

  const recordingStateRef = useRef<ImidiInstrumentState>(
    midiInstrumentState.idle
  );

  const onNoteOn = (event: InputEventNoteon) => {
    const note = Tone.Frequency(event.note.number, 'midi').toNote();
    const relativeTick = Tone.Transport.ticks - startingTick.current;
    console.log(Tone.Transport.ticks, 'ticks');
    console.log(startingTick, 'starting tick');
    console.log(relativeTick, 'relative tick');
    if (recordingStateRef.current === midiInstrumentState.recording) {
      notesCurrentlyPlaying[event.note.number] = relativeTick;
    }
    console.log('trigger Ticks', Tone.Transport.ticks);
    soundEngine.triggerAttack(note, Tone.now(), event.velocity);
  };

  const onNoteOff = (event: InputEventNoteoff) => {
    if (recordingStateRef.current === midiInstrumentState.recording) {
      const currTrack = trackRef.current;
      const relativeTick = Tone.Transport.ticks - startingTick.current;
      console.log('release Ticks', relativeTick);

      currTrack.addNote({
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
        startingTick.current
    );

    const freq = Tone.Frequency(event.note.number, 'midi').toNote();

    soundEngine.triggerRelease(freq, Tone.now()),
      //remove the note from the currently playing notes
      delete notesCurrentlyPlaying[event.note.number];
  };

  useEffect(() => {
    WebMidi.enable((err) => {
      WebMidi.inputs.forEach((input, key) => {
        addInputListeners(input);
        console.log('attached to', input.name);
      });
      WebMidi.addListener('connected', (e) => {
        if (e.port.type === 'input') {
          console.log(track);
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
  }, [track]); // TODO: check if i actully need the track as a dependency

  const midiLoop = useRef<Tone.Loop>(new Tone.Loop(() => {}, '1m')).current;

  const startPlayback = () => {
    midiLoop.start();
  };

  useEffect(() => {
    midiLoop.callback = (time) => {
      const notes = track.notes;
      console.log('yo', notes);
      notes.forEach((note) => {
        console.log(note.name, note.time, note.duration, note.velocity);
        //convert the ticks to seconds
        const duration = Tone.Ticks(note.durationTicks).toSeconds();

        soundEngine.triggerAttackRelease(
          note.name,
          duration,
          `+${note.ticks}i`,
          note.velocity
        );
        //note.midi, note.time, note.duration, note.name
      });
    };
  }, [track]);

  const clearMidi = () => {
    trackRef.current = midi.addTrack();
    setTrack(trackRef.current);
    midiLoop.stop();
  };

  //the track also has a channel and instrument
  //track.instrument.name
  const handleRecord = () => {
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }

    let start = getCurrentBar() + 1;
    let end = start + 1;

    Tone.Transport.scheduleOnce(() => {
      startingTick.current = Tone.Transport.ticks;
      setRecordingState(midiInstrumentState.recording);
      recordingStateRef.current = midiInstrumentState.recording;
    }, `${start}:0:0`);

    Tone.Transport.scheduleOnce(() => {
      setRecordingState(midiInstrumentState.playback);
      recordingStateRef.current = midiInstrumentState.playback;
      startPlayback();
      console.log('started playback');
      // const midiBlob = exportMidiToBlob(midi);
      // downloadFile(`my-midi-file.mid`, midiBlob);
    }, `${end}:0:0`);
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

      <MidiAnimation track={track} durationTicks={midi.durationTicks}>
        <AButton
          sx={{
            p: 0.6,
          }}
          onClick={handleRecord}
        >
          <Icon>
            <FiberManualRecord
              sx={{
                fill:
                  recordingState === midiInstrumentState.recording ? 'red' : '',
                transform: 'scale(0.6)',
                m: 0,
              }}
            />
          </Icon>
        </AButton>
        <AButton
          sx={{
            width: 'fit-content',
            fontSize: 10,
            ml: 'auto',
          }}
          onClick={() => {
            setRecordingState(midiInstrumentState.idle);
            recordingStateRef.current = midiInstrumentState.idle;
            clearMidi();
          }}
        >
          Clear
        </AButton>
      </MidiAnimation>
    </>
  );
};
