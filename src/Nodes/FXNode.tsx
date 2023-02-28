import { Handle, Position, useStore } from 'reactflow';

import { DoodlerPage } from '../pages/DoodlerPage';
import { DragHandle } from './DragHandle';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const FXNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <DragHandle />

      {data.component}
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
