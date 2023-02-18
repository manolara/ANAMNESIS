import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, MenuProps } from '@mui/material';
import { ContextMenu, NestedMenuItem } from 'mui-nested-menu';

interface FlowContextProps extends MenuProps {}

export const FlowContext = ({ ...menuProps }: FlowContextProps) => {
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
          onClick: () => console.log('Reverb'),
        },
        {
          label: 'Delay',
          onClick: () => console.log('Delay'),
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
