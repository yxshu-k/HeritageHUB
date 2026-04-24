import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const userData = response.data.data;

      localStorage.setItem('heritageToken', userData.token);
      localStorage.setItem('heritageUser', JSON.stringify(userData));

      login(userData);
      toast.success(`Welcome back, ${userData.name}! 🏺`);
      navigate('/marketplace');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-heritage-600/5 rounded-full blur-[120px] -ml-64 -mt-64"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-heritage-600/5 rounded-full blur-[120px] -mr-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="card p-12 border-t-4 border-heritage-600">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-cinzel font-black text-white mb-3 tracking-tighter">
              HUB <span className="text-heritage-600">ACCESS</span>
            </h1>
            <p className="text-slate-400 font-light italic">
              Reconnect with your heritage collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-heritage-600 font-black ml-1">
                Verified Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="collector@heritage.hub"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase tracking-widest text-heritage-600 font-black">
                  Secure Password
                </label>
                <a href="#" className="text-[10px] text-slate-500 hover:text-heritage-600 uppercase tracking-widest font-bold">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : 'Establish Access'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-dark-700 pt-8">
            <p className="text-slate-500 text-sm">
              New to the circle?{' '}
              <Link to="/register" className="text-heritage-600 font-bold hover:text-white transition-colors">
                Apply for Access →
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black">
          © 2026 HERITAGEHUB • SECURE ENCRYPTED ACCESS
        </p>
      </div>
    </div>
  );
}