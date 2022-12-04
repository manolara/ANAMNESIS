import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';
import { startLoop } from '../utils/utils';
const metronome = new Tone.MetalSynth().toDestination();
const metronome2 = new Tone.MetalSynth().toDestination();
const MERCYYY = new Tone.Player('src/Audio_Samples/MERCY.mp3').toDestination();
const sketch = (p: P5CanvasInstance) => {
  const song = (time: number) => {
    metronome.triggerAttackRelease('c2', '8n', time, 0.08);
    // MERCYYY.autostart = true;
    console.log(Tone.Transport.position);
  };
  const song2 = (time: number) => {
    metronome2.triggerAttackRelease('c2', '8n', time, 0.2);
    // MERCYYY.autostart = true;
    console.log();
  };

  p.setup = () => {
    p.createCanvas(600, 400);
    metronome.envelope.decay = 0.1;
    const audioStartBtn = p.createButton('click Me ');
    const syncButton = p.createButton('sync  Me ');
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
