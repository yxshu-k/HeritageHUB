import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAllProducts({});
      setProducts(response.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      setTimeout(() => {
        fetchProducts();
      }, 0);
    }
  }, [user]);

  const handleVerify = async (productId) => {
    try {
      await productAPI.verifyProduct(productId);
      toast.success('Product verified');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app">
        <h1 className="section-title mb-4">Admin Verification Panel</h1>
        <p className="section-subtitle mb-8">Review and verify heritage products before they go live.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-heritage-600 font-semibold">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-heritage-600">{product.title}</h2>
                    <p className="text-slate-400 mt-2">{product.category}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-300">
                      <span>Price: ₹{product.price?.toLocaleString()}</span>
                      <span>Status: <strong className={product.verificationStatus === 'verified' ? 'text-green-500' : product.verificationStatus === 'pending' ? 'text-amber-400' : 'text-red-500'}>{product.verificationStatus}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(product._id)}
                      disabled={product.verificationStatus === 'verified'}
                      className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all ${
                        product.verificationStatus === 'verified'
                          ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                          : 'bg-heritage-600 hover:bg-heritage-700 text-white'
                      }`}
                    >
                      {product.verificationStatus === 'verified' ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
