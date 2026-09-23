import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateModel from './pages/CreateModel';
import Models from './pages/Models';
import ModelDetails from './pages/ModelDetails';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><CreateModel /></ProtectedRoute>
          } />
          <Route path="/models" element={
            <ProtectedRoute><Models /></ProtectedRoute>
          } />
          <Route path="/models/:id" element={
            <ProtectedRoute><ModelDetails /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
