import { createElement } from 'react';
import { Handle, Position } from 'reactflow';
import { DragHandle } from './DragHandle';

export const SoundSourceNode = ({ data }: any) => {
  const soundSourceComponent = createElement(data.component, {
    soundEngine: data.soundEngine,
    output: data.output,
  });
  return (
    <>
      <Handle type="target" position={Position.Left} id="a" />
      <DragHandle />
      {soundSourceComponent}
      <Handle type="source" position={Position.Right} />
    </>
  );
};
