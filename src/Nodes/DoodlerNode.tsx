import { DoodlerPage } from '../pages/DoodlerPage';
import { DragHandle } from './DragHandle';

const handleStyle = { left: 10 };
const zoomSelector = (s: any) => s.transform[2];

export const DoodlerNode = ({ data }: any) => {
  const zoom = useStore(zoomSelector);

  return (
    <>
      <Handle type="source" position={Position.Right} />
      <DragHandle />

      <DoodlerPage soundSource={data.soundSource} zoomFactor={zoom} />
      <Handle type="target" position={Position.Left} id="a" />
    </>
  );
};
