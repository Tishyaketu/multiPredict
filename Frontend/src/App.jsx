import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PredictHeart from "./pages/PredictHeart";
import PredictDiabetes from "./pages/PredictDiabetes";
import PredictBreast from "./pages/PredictBreast";
import PredictLung from "./pages/PredictLung";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict/heart" element={<PredictHeart />} />
            <Route path="/predict/diabetes" element={<PredictDiabetes />} />
            <Route path="/predict/breast" element={<PredictBreast />} />
            <Route path="/predict/lung" element={<PredictLung />} />

            {/* Fallback root to dashboard if logged in */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
