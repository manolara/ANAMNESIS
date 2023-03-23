import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps,
} from 'react-p5-wrapper';
import p5 from 'p5';
import * as Tone from 'tone';
import { mapLogInv } from '../utils/utils';
import { Box, darken } from '@mui/material';

interface SpectralAnalyzerProps extends SketchProps {
  input: Tone.Signal;
  output: Tone.Signal;
}

const sketch = (p: P5CanvasInstance<SpectralAnalyzerProps>) => {
  const fft = new Tone.FFT(16384);
  let cnv: p5.Renderer;

  p.setup = () => {
    cnv = p.createCanvas(500, 300);
  };

  p.updateWithProps = (props: SpectralAnalyzerProps) => {
    props.input.connect(fft).connect(props.output);
  };

  p.draw = () => {
    p.background('#bdd0c4');
    let spectrum = fft.getValue();
    p.noFill();
    p.stroke(darken('#d0bdc9', 0.05));
    p.strokeWeight(1.3);
    p.beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      let freq = mapLogInv(i, 0, spectrum.length, 20, 20000);
      let x = p.map(freq, 0, spectrum.length, 0, p.width);
      let y = p.map(spectrum[i], -140, 0, p.height, 0);
      p.vertex(x, y);
    }
    p.endShape();
  };
};

export const SpectralAnalyzer = ({ input, output }: SpectralAnalyzerProps) => {
  return (
    <Box
      zIndex={3}
      maxHeight="300px"
      border={`2px solid ${darken('#bdd0c4', 0.3)} `}
    >
      <ReactP5Wrapper sketch={sketch} input={input} output={output} />
    </Box>
  );
};
