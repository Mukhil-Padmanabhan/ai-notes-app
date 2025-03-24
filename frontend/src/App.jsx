import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Notes from './pages/notes/Notes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
