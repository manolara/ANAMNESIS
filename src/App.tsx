import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import { DoodlerPage } from './pages/DoodlerPage';
import { MySketchPage } from './pages/MySketchPage';
import { Playground } from './PLAYGROUND/Playground';
import { customTheme } from './theme';
import { Theremin } from './pages/Theremin';
import { PGPage } from './PLAYGROUND/PGPage';
import * as Tone from 'tone';
import { ChatGPT } from './PLAYGROUND/ChatGPT';
import { Fatter } from './PLAYGROUND/Fatter';
import { ThereminReassess } from './PLAYGROUND/ThereminReassess';
import { ThereminWithoutState } from './PLAYGROUND/ThereminWithoutState';

import { Horizontal } from './PLAYGROUND/horizontal_scrolling/Horizontal';
import { Horizontal2 } from './PLAYGROUND/horizontal_scrolling/Horizontal2';
import { Horizontal3 } from './PLAYGROUND/horizontal_scrolling/Horizontal3';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sketch" element={<MySketchPage />} />
      {/* <Route path="/legacy" element={<Doodler />} /> */}
      <Route path="/doodler_page" element={<DoodlerPage />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="theremin_page" element={<Theremin />} />
      <Route path="PGPage" element={<PGPage />} />
      <Route path="GPT" element={<ChatGPT />} />
      <Route path="fatter" element={<Fatter />} />
      <Route path="reassess" element={<ThereminReassess />} />
      <Route path="reassess2" element={<ThereminWithoutState />} />
      <Route path="horizontal" element={<Horizontal />} />
      <Route path="horizontal2" element={<Horizontal2 />} />
      <Route path="horizontal3" element={<Horizontal3 />} />
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
