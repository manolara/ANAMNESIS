import { useState, useEffect } from 'react';
import { Menu, MenuItem, MenuProps } from '@mui/material';
import { NestedMenuItem } from 'mui-nested-menu';
import { Node } from 'reactflow';
import { Reverb } from '../FX/Reverb';
import * as Tone from 'tone';
import { createFX } from './createFX';
import { Delay } from '../FX/Delay';

interface FlowContextProps extends MenuProps {
  addNode: (node: Node) => void;
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
  const addFX = (
    FXComponent: React.FC<{ input: Tone.Signal; output: Tone.Signal }>
  ) => {
    const newFX = createFX(FXComponent);
    addNode({
      id: '5',
      type: 'FX',
      data: {
        label: `${FXComponent}`,
        component: newFX.component,
        input: newFX.input,
        output: newFX.output,
      },
      dragHandle: '.custom-drag-handle',
      position: { x: 500, y: 200 },
    });
  };
  const menuItems = [
    {
      label: 'Instrument',
      children: [
        {
          label: 'Theremin',
          onClick: () => console.log('Theremin'),
        },
        {
          label: 'Doodler',
          onClick: () => console.log('Doodler'),
        },
      ],
    },
    {
      label: 'Sound Source',
      children: [
        {
          label: 'MonoSynth',
          onClick: () => console.log('MonoSynth'),
        },
        {
          label: 'PolySynth',
          onClick: () => console.log('PolySynth'),
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
          onClick: () => console.log('Compressor'),
        },
        {
          label: 'Lofi',
          onClick: () => console.log('Lofi'),
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
