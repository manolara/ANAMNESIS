import { useState, useEffect } from 'react';
import { Menu, MenuItem, MenuProps } from '@mui/material';
import { NestedMenuItem } from 'mui-nested-menu';
import { Reverb } from '../FX/Reverb';
import * as Tone from 'tone';
import { Delay } from '../FX/Delay';
import { ANode } from '../pages/Flow';
import { Compressor } from '../FX/Compressor';
import { Lofi } from '../FX/Lofi';
import { v4 as uuidv4 } from 'uuid';
import { Piano } from '@tonejs/piano';
import { FXProps, InstrumentProps } from '../types/componentProps';
import { Theremin } from '../Instruments/Theremin';
import { Synthesizer } from '../Instruments/Synthesizer';
import { MonoSynth } from '../Instruments/MonoSynth';
import { DoodlerPage } from '../pages/DoodlerPage';
import { APiano } from '../Instruments/APiano';
import { SoundSourceNode } from '../Nodes/SoundSourceNode';

///object to hold all the components
const components = {
  Instrument: {
    Doodler: DoodlerPage,
    Theremin: Theremin,
  },
  'Sound Source': {
    MonoSynth: Synthesizer,
    PolySynth: MonoSynth,
  },
  FX: {
    Reverb: Reverb,
    Delay: Delay,
    Compressor: Compressor,
    Lofi: Lofi,
  },
};

interface FlowContextProps extends MenuProps {
  addNode: (node: ANode) => void;
}

export const FlowContext = ({ addNode, ...menuProps }: FlowContextProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      setMousePosition({ x: event.clientX, y: event.clientY });
      setOpen(true);
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleMenuItemClick = (onClick: () => void) => {
    setOpen(false);
    onClick();
  };
  const addFX = (FXComponent: ({ input, output }: FXProps) => JSX.Element) => {
    addNode({
      id: uuidv4(),
      type: 'FX',
      data: {
        label: `${FXComponent}`,
        component: FXComponent,
        input: new Tone.Signal(),
        output: new Tone.Signal(),
      },
      dragHandle: '.custom-drag-handle',
      position: { x: mousePosition.x, y: mousePosition.y },
    });
  };

  const addInstrument = (
    InstrumentComponent: ({ soundSource }: InstrumentProps) => JSX.Element,
    label: 'Theremin' | 'Doodler'
  ) => {
    addNode({
      id: uuidv4(),
      type: 'instrument',
      data: {
        label: label,
        component: InstrumentComponent,
        soundSource: undefined,
      },
      dragHandle: '.custom-drag-handle',
      position: { x: mousePosition.x, y: mousePosition.y },
    });
  };

  const menuItems = [
    {
      label: 'Instrument',
      children: [
        {
          label: 'Doodler',
          onClick: () => addInstrument(DoodlerPage, 'Doodler'),
        },
        {
          label: 'Theremin',
          onClick: () => addInstrument(Theremin, 'Theremin'),
        },
      ],
    },
    {
      label: 'Sound Source',
      children: [
        {
          label: 'MonoSynth',
          onClick: () => {
            addNode({
              id: uuidv4(),
              type: 'soundSource',
              data: {
                label: 'MonoSynth',
                component: MonoSynth,
                soundEngine: new Tone.MonoSynth(),
                output: new Tone.Signal(),
              },
              dragHandle: '.custom-drag-handle',
              position: { x: mousePosition.x, y: mousePosition.y },
            });
          },
        },
        {
          label: 'PolySynth',
          onClick: () =>
            addNode({
              id: uuidv4(),
              type: 'soundSource',
              data: {
                label: 'PolySynth',
                component: Synthesizer,
                soundEngine: new Tone.PolySynth(),
                output: new Tone.Signal(),
              },
              dragHandle: '.custom-drag-handle',
              position: { x: mousePosition.x, y: mousePosition.y },
            }),
        },
        {
          label: 'Piano',
          onClick: () =>
            addNode({
              id: uuidv4(),
              type: 'soundSource',
              data: {
                label: 'Piano',
                component: APiano,
                soundEngine: new Piano(),

                output: new Tone.Signal(),
              },
              dragHandle: '.custom-drag-handle',
              position: { x: 200, y: 200 },
            }),
        },
      ],
    },
    {
      label: 'Effect',
      children: [
        {
          label: 'Reverb',
          onClick: () => addFX(Reverb),
        },
        {
          label: 'Delay',
          onClick: () => addFX(Delay),
        },
        {
          label: 'Compressor',
          onClick: () => addFX(Compressor),
        },
        {
          label: 'Lofi',
          onClick: () => addFX(Lofi),
        },
      ],
    },
  ];

  return (
    <>
      {open ? (
        <Menu
          onClose={() => setOpen(false)}
          anchorReference="anchorPosition"
          anchorPosition={{ left: mousePosition.x, top: mousePosition.y }}
          {...menuProps}
        >
          {menuItems.map((menuItem, index) => (
            <NestedMenuItem
              key={index}
              nonce={undefined}
              parentMenuOpen={true}
              label={menuItem.label}
            >
              {menuItem.children.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleMenuItemClick(item.onClick)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </NestedMenuItem>
          ))}
        </Menu>
      ) : null}

      {menuProps.children}
    </>
  );
};
