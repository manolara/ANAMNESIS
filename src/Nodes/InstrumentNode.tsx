import { createElement } from 'react';
import { Handle, Node, Position } from 'reactflow';

import { DragHandle } from './DragHandle';

export const InstrumentNode = ({ data }: any) => {
  const instrumentComponent = createElement(data.component, {
    soundSource: data.soundSource,
  });

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <DragHandle />
      {instrumentComponent}
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
