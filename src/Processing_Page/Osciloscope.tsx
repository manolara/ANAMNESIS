import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import p5 from 'p5';
import * as Tone from 'tone';

interface OscilloscopeProps extends SketchProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

const sketch = (p: P5CanvasInstance<SketchProps>) => {
  const wave = new Tone.Waveform(2048);

  let cnv: p5.Renderer;

  p.updateWithProps = (props: any) => {
    props.input.connect(wave).connect(props.output);
  };

  p.setup = () => {
    cnv = p.createCanvas(500, 300);
  };

  p.draw = () => {
    p.background(0);
    p.noFill();
    p.stroke(255);
    p.beginShape();
    const buffer = wave.getValue();
    let start = 0;
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        start = i;
        break; // interrupts a for loop
      }
    }
    let end = start + buffer.length / 2;
    p.beginShape();
    for (let i = start; i < end; i++) {
      let x = p.map(i - 1, start, end, 0, p.width);
      let y = p.map(buffer[i - 1], -1, 1, 0, p.height);
      p.vertex(x, y);
    }
    p.endShape();
  };
};

export const Oscilloscope = ({ input, output }: OscilloscopeProps) => {
  return <ReactP5Wrapper sketch={sketch} input={input} output={output} />;
};
