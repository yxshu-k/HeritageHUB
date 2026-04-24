import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-dark-800 border-b-2 border-heritage-600 sticky top-0 z-40">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-cinzel font-bold text-heritage-600 hover:text-heritage-500 transition-colors"
          >
            🏺 HeritageHUB
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/marketplace"
              className="text-slate-300 hover:text-heritage-600 transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              to="/wishlist"
              className="text-slate-300 hover:text-heritage-600 transition-colors font-medium flex items-center gap-1"
            >
              ♡ Wishlist
            </Link>
            <Link
              to="/add-product"
              className="text-slate-300 hover:text-heritage-600 transition-colors font-medium"
            >
              Sell Item
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-heritage-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-slate-300 hover:text-heritage-600 transition-colors font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-heritage-600 flex items-center justify-center overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-heritage-600">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2 text-sm">
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-heritage-600 text-2xl"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-dark-700 pt-4">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-heritage-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-heritage-600 transition-colors"
            >
              ♡ Wishlist
            </Link>
            <Link
              to="/add-product"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-heritage-600 transition-colors"
            >
              Sell Item
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-300 hover:text-heritage-600 transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-heritage-600 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="pt-3 border-t border-dark-700 space-y-2">
                  <p className="text-sm font-semibold text-heritage-600">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary text-sm py-2"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-dark-700 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn-secondary py-2 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn-primary py-2 text-sm"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}