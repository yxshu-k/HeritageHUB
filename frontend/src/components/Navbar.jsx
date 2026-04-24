import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Sell Item', path: '/add-product' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-dark-900/80 backdrop-blur-xl border-b border-heritage-600/30 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="container-app">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🏺</span>
            <span className="text-2xl font-cinzel font-black tracking-tighter text-white group-hover:text-heritage-600 transition-colors">
              HERITAGE<span className="text-heritage-600 group-hover:text-white transition-colors">HUB</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'text-heritage-600' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-dark-700"></div>

            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="group flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-heritage-600 uppercase tracking-widest font-black">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-heritage-600/30 p-0.5 group-hover:border-heritage-600 transition-all duration-300">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <span className="text-xl">⏻</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                  SIGN IN
                </Link>
                <Link to="/register" className="btn-primary py-2 px-6 text-xs tracking-widest">
                  JOIN HUB
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          >
            <span className={`w-6 h-0.5 bg-heritage-600 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-heritage-600 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-heritage-600 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-dark-900 border-b border-dark-700 transition-all duration-500 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen py-8 px-6 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-cinzel font-bold text-white hover:text-heritage-600"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px w-full bg-dark-700 my-2"></div>
            
            {user ? (
              <div className="space-y-6">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4"
                >
                  <img src={user.avatar} className="w-12 h-12 rounded-full border border-heritage-600" alt="" />
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-heritage-600 uppercase tracking-widest">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full btn-secondary py-3"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 border border-dark-700 rounded-lg text-white font-bold"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-primary py-4"
                >
                  JOIN HUB
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}