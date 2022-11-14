import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import { DoodlerPage } from './pages/DoodlerPage';
import { MySketchPage } from './pages/MySketchPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sketch" element={<MySketchPage />} />
      {/* <Route path="/legacy" element={<Doodler />} /> */}
      <Route path="/doodler_page" element={<DoodlerPage />} />
    </Routes>
  );
};

export function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
