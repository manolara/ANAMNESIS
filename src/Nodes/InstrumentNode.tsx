import { createElement } from 'react';
import { Handle, Position } from 'reactflow';

import { DragHandle } from './DragHandle';

export const InstrumentNode = ({ data }: any) => {
  const instrumentComponent = createElement(data.component, {
    soundSource: data.soundSource,
  });

  return (
    <>
      <Handle type="target" position={Position.Left} id="a" />
      <DragHandle />
      {instrumentComponent}
      <Handle type="source" position={Position.Right} />
    </>
  );
};
