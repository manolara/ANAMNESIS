import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MySketch } from './pages/MySketch';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import { Doodler } from './pages/Doodler';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sketch" element={<MySketch />} />
      <Route path="/legacy" element={<Doodler />} />
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
