import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';
import { setBackground } from '../utils/Doodler_utils';
import { startLoop } from '../utils/utils';
const metronome = new Tone.MonoSynth().toDestination();
const metronome2 = new Tone.MetalSynth().toDestination();
const metronome3 = new Tone.MonoSynth().toDestination();
const MERCYYY = new Tone.Player('src/Audio_Samples/MERCY.mp3').toDestination();
const sketch = (p: P5CanvasInstance) => {
  const song = (time: number) => {
    metronome.triggerAttackRelease('c2', '8n', time, 0.08);
    // MERCYYY.autostart = true;
    console.log(Tone.Transport.position);
    Tone.Draw.schedule(() => {
      p.background(p.random(100));
    }, 100);
  };
  const song2 = (time: number) => {
    metronome2.triggerAttackRelease('c2', '8n', time, 0.2);
    // MERCYYY.autostart = true;
    console.log();
  };

  p.setup = () => {
    metronome.envelope.decay = 0.1;
    const audioStartBtn = p.createButton('click Me ');
    const syncButton = p.createButton('sync  Me ');
    const scheduleTestBtn = p.createButton('schedule test');
    scheduleTestBtn.mouseClicked(() => {
      Tone.Transport.schedule((time) => {
        console.log('test');
        metronome3.triggerAttackRelease('c2', '8n', time, 0.2);
      }, '2:0:0');
    });
    audioStartBtn.mouseClicked(() => {
      Tone.start();
      startLoop(loop);
    });
    syncButton.mouseClicked(() => {
      startLoop(loopSync);
    });
  };

  p.draw = () => {};
  const loop = new Tone.Loop(song, '4n');
  const loopSync = new Tone.Loop(song2, '4n');
};

export function Playground() {
  return <ReactP5Wrapper sketch={sketch} />;
}
