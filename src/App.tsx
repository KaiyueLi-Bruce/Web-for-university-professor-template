import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { EditLabContent } from './pages/EditLabContent';

const enableEditor = import.meta.env.VITE_ENABLE_EDITOR === 'true';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {enableEditor && <Route path="/edit-lab-content" element={<EditLabContent />} />}
        {/* 兜底：未知路径都回到主页，防止线上被直接访问编辑页 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
