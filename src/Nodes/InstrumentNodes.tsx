import { createElement } from 'react';
import { Handle, Node, Position, useStore } from 'reactflow';

import { DoodlerPage } from '../pages/DoodlerPage';
import { DragHandle } from './DragHandle';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

type InstrumentNodeData = {
  label: string;
  color: string;
};

type InstrumentNodeType = 'start';

type InstrumentNode = Node<InstrumentNodeData, InstrumentNodeType>;

export const InstrumentNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);
  const instrument = createElement(data.component, {
    soundSource: data.soundSource,
    zoomFactor: zoom,
  });

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <DragHandle />
      {instrument}
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
