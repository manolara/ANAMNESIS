import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ReactFlowTester } from './PLAYGROUND/ReactFlowTester';

export const ReactFlowWrapper = () => {
  return (
    <ReactFlowProvider>
      <ReactFlowTester />
    </ReactFlowProvider>
  );
};
