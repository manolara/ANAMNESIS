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
    id: uuidv4(),
    type: 'master',
    data: {
      input: new Tone.Signal(),
    },
    dragHandle: '.custom-drag-handle',
    position: { x: 1000, y: 200 },
  },
];
