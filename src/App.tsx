import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import { GeneratorPage } from './pages/Generator';

/**
 * Main application component
 * Handles routing and top-level layout
 */
function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
      </Routes>
    </div>
  );
}

export default App;
