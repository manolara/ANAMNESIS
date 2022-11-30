import { P5CanvasInstance, ReactP5Wrapper } from 'react-p5-wrapper';
import * as Tone from 'tone';
const metronome = new Tone.MetalSynth().toDestination();
const MERCYYY = new Tone.Player('src/Audio_Samples/MERCY.mp3').toDestination();
const sketch = (p: P5CanvasInstance) => {
  const song = (time: number) => {
    metronome.triggerAttackRelease('c2', '8n', time, 0.08);
    // MERCYYY.autostart = true;
  };
  p.setup = () => {
    p.createCanvas(600, 400);
    metronome.envelope.decay = 0.1;
    const audioStartBtn = p.createButton('click Me twice slut');
    audioStartBtn.mouseClicked(() => {
      Tone.start();
      Tone.Transport.start();
      loop.start();
    });
  };

  p.draw = () => {};
  const loop = new Tone.Loop(song, '4n');
};

export function Playground() {
  return <ReactP5Wrapper sketch={sketch} />;
}
