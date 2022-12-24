import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import { DoodlerPage } from './pages/DoodlerPage';
import { MySketchPage } from './pages/MySketchPage';
import { Playground } from './PLAYGROUND/Playground';
import { APalette, customTheme } from './theme';

import { PGPage } from './PLAYGROUND/PGPage';
import * as Tone from 'tone';
import { ChatGPT } from './PLAYGROUND/ChatGPT';
import { Fatter } from './PLAYGROUND/Fatter';

import { ThereminWithoutState } from './Instruments/ThereminWithoutState';

import { Horizontal3 } from './PLAYGROUND/horizontal_scrolling/Horizontal3';
import { Knob } from './FX/Knob';
import { Synthesizer } from './Instruments/Synthesizer';
import { SynthesizerPage } from './pages/SynthesizerPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sketch" element={<MySketchPage />} />
      {/* <Route path="/legacy" element={<Doodler />} /> */}
      <Route path="/doodler_page" element={<DoodlerPage />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="PGPage" element={<PGPage />} />
      <Route path="GPT" element={<ChatGPT />} />
      <Route path="fatter" element={<Fatter />} />
      <Route path="reassess2" element={<ThereminWithoutState />} />
      <Route
        path="knob"
        element={<Knob defaultValue={0} min={0} max={100} />}
      />
      <Route path="horizontal3" element={<Horizontal3 />} />
      <Route path="synth" element={<SynthesizerPage />} />
    </Routes>
  );
};

export function WrappedApp() {
  Tone.Transport.bpm.value = 80;
  Tone.Transport.stop();
  // Tone.Transport.loop = true;
  // Tone.Transport.loopEnd = '8m';
  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
