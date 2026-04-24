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
      toast.error('Failed to load restricted data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user]);

  const handleVerify = async (productId) => {
    try {
      await productAPI.verifyProduct(productId);
      toast.success('Artifact officially authenticated in the registry');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Authentication process failed');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-6 block">🚫</span>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Access Restricted</h1>
          <p className="text-slate-500 italic">This sector is reserved for HeritageHUB Administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-24 px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>

      <div className="container-app relative z-10">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-black">Curator Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">AUTHENTICATION <span className="text-heritage-600">PANEL</span></h1>
          <p className="text-slate-400 font-light text-lg italic">Verify and catalog rare artifacts before they enter the public marketplace.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-heritage-600 font-cinzel text-xl animate-pulse uppercase tracking-[0.3em]">Opening Secure Vaults...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card p-8 bg-dark-800/50 backdrop-blur-xl border-l-4 border-heritage-600">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 rounded-lg overflow-hidden border border-dark-700">
                        <img src={product.images?.[0]} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{product.title}</h2>
                        <p className="text-xs font-black text-heritage-600 uppercase tracking-widest mt-1">{product.category}</p>
                        <div className="flex gap-6 mt-4">
                           <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Valuation</p>
                              <p className="text-sm font-bold text-white">₹{product.price?.toLocaleString()}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Current Status</p>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                product.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {product.verificationStatus}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVerify(product._id)}
                      disabled={product.verificationStatus === 'verified'}
                      className={`px-8 py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                        product.verificationStatus === 'verified'
                          ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                          : 'bg-heritage-600 text-dark-900 hover:bg-heritage-500 shadow-xl shadow-heritage-600/10'
                      }`}
                    >
                      {product.verificationStatus === 'verified' ? 'Cataloged & Verified' : 'Confirm Authenticity'}
                    </button>
                    <button 
                      className="p-4 text-slate-500 hover:text-red-500 transition-colors"
                      title="Reject Artifact"
                    >
                      🗑️
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
