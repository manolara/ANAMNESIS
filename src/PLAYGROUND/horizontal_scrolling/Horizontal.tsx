import { useRef } from 'react';

import { Page1 } from './Page1';
import { Page2 } from './Page2';
import 'react-locomotive-scroll/dist/locomotivescroll.css';

export const Horizontal = () => {
  return (
    <main data-scroll-container ref={containerRef}>
      <Page1 />
      <Page2 />
    </main>
  );
};
