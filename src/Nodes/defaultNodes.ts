import 'reactflow/dist/style.css';
import * as Tone from 'tone';

import { Theremin } from '../Instruments/Theremin';
import { v4 as uuidv4 } from 'uuid';
import { Reverb } from '../FX/Reverb';
import { DoodlerPage } from '../pages/DoodlerPage';
import { ANode } from '../pages/Flow';

export const initialNodes: ANode[] = [
  {
    id: uuidv4(),
    type: 'instrument',
    data: {
      label: 'Doodler',
      component: DoodlerPage,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: -500, y: 5 },
  },
  {
    id: uuidv4(),
    type: 'instrument',
    data: {
      label: 'Theremin',
      component: Theremin,
      soundSource: undefined,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 1000, y: 1000 },
  },
  {
    id: uuidv4(),
    type: 'FX',
    data: {
      label: 'Reverb',
      input: new Tone.Signal(),
      output: new Tone.Signal(),
      component: Reverb,
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 650, y: 250 },
  },
  {
    id: 'master-node-id',
    type: 'master',
    data: {
      input1: new Tone.Channel(),
      input2: new Tone.Channel(),
      input3: new Tone.Channel(),
      input4: new Tone.Channel(),
      input5: new Tone.Channel(),
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 1000, y: 200 },
  },
];
