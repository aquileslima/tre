import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PowerUp from './PowerUp';
import Settings from './Settings';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PowerUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
