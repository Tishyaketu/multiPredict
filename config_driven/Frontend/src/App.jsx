import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DynamicAnalysis from './pages/DynamicAnalysis';
import ActivityLog from './pages/ActivityLog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis/:slug" element={<DynamicAnalysis />} />
            <Route path="/activity" element={<ActivityLog />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
