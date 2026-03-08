import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { EditLabContent } from './pages/EditLabContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit-lab-content" element={<EditLabContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
