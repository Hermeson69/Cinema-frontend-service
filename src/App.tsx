import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "@/pages/login";
import ReservasView from "@/pages/register";
import CadastroView from "./pages/sigup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/sigup" element={<CadastroView />} />
      <Route path="/reservas" element={<ReservasView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
