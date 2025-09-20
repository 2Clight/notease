import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import Notes from "./pages/NotesPage";

import Navbar from "./components/Navbar";

function App() {
  return (
     <BrowserRouter>
     <div className="min-h-screen bg-gray-200 relative">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;