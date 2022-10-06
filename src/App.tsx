import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MySketch } from './pages/MySketch';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/sketch" element={<MySketch />} />
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
