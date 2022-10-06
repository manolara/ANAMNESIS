import Sketch from 'react-p5';
import p5Types from 'p5';
import * as Tone from 'tone';

let x = 50;
const y = 50;

const duoSynth = new Tone.DuoSynth().toDestination();

export const MySketch = () => {
  const yo = (p5: p5Types) => {
    console.log('yo');
  };
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);

    const yoButton = p5.createButton('yo');
    yoButton.mouseClicked(() => duoSynth.triggerAttackRelease('C4', '2n'));
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.ellipse(x, y, 80, 70);
    x++;
    yo(p5);
  };

  return <Sketch setup={setup} draw={draw} />;
};
