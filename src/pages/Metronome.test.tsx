// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import { Metronome } from './Metronome';
// import * as Tone from 'tone';

// describe('Metronome', () => {
//   it('should render the canvas and two circles', () => {
//     const { getByTestId } = render(<Metronome />);
//     expect(getByTestId('metronome-canvas')).toBeInTheDocument();
//     expect(getByTestId('circle-1')).toBeInTheDocument();
//     expect(getByTestId('circle-2')).toBeInTheDocument();
//   });

//   it('should highlight the correct circle on each beat', () => {
//     const { getByTestId } = render(<Metronome />);

//     // the first beat should highlight circle 1
//     fireEvent.click(getByTestId('metronome-canvas'));
//     expect(getByTestId('circle-1')).toHaveClass('highlighted');
//     expect(getByTestId('circle-2')).not.toHaveClass('highlighted');

//     // the second beat should highlight circle 2
//     fireEvent.click(getByTestId('metronome-canvas'));
//     expect(getByTestId('circle-1')).not.toHaveClass('highlighted');
//     expect(getByTestId('circle-2')).toHaveClass('highlighted');
//   });

//   it('should stop the metronome when the stop button is clicked', () => {
//     const { getByText } = render(<Metronome />);
//     const stopButton = getByText('Stop');

//     // click the stop button and verify that the metronome is stopped
//     fireEvent.click(stopButton);
//     expect(Tone.Transport.state).toBe('stopped');
//   });
// });
