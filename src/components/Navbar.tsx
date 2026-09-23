import { useAuthStore } from '../store/authStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-lg hidden sm:block">3D Builder</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/dashboard') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                  Dashboard
                </Link>
                <Link to="/create" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/create') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                  Create Model
                </Link>
                <Link to="/models" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/models') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                  My Models
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/profile') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                  {user?.name}
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/login') ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md hover:bg-slate-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/create" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Create Model</Link>
                <Link to="/models" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>My Models</Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
