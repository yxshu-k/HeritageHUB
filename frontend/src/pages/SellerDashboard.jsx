import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, bidAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const productsRes = await productAPI.getAllProducts({});
        const userProducts = productsRes.data.data.filter(
          (p) => p.sellerId?._id === user._id
        );
        setProducts(userProducts);

        const bidsRes = await bidAPI.getUserBids();
        setMyBids(bidsRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load archives');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this artifact from the registry?')) return;

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Artifact removed from archives');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove artifact');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-24 px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-heritage-600/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>

      <div className="container-app relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <div className="inline-block px-3 py-1 bg-heritage-600/10 border border-heritage-600/30 rounded-full mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-heritage-600 font-black">Member Dashboard</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">THE <span className="text-heritage-600">CUSTODIAN</span> ROOM</h1>
            <p className="text-slate-400 font-light text-lg italic">Welcome back, {user?.name}. Your collection awaits management.</p>
          </div>
          <button
            onClick={() => navigate('/add-product')}
            className="btn-primary px-8 py-4 shadow-2xl shadow-heritage-600/20"
          >
            + List New Artifact
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Listed Artifacts', value: products.length, icon: '🏺' },
            { label: 'Active Bids', value: myBids.length, icon: '⚖️' },
            { label: 'Verified Status', value: products.filter(p => p.verificationStatus === 'verified').length, icon: '🛡️' },
            { label: 'Estimated Portfolio', value: `₹${products.reduce((acc, p) => acc + (p.price || 0), 0).toLocaleString()}`, icon: '💰' },
          ].map((stat, i) => (
            <div key={i} className="card p-8 border-t-2 border-heritage-600 bg-dark-800/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Archive Stat</span>
              </div>
              <p className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-heritage-600 font-black">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs Interface */}
        <div className="flex gap-8 mb-12 border-b border-dark-700">
          {['products', 'bids'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab ? 'text-heritage-600' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'products' ? 'My Registry' : 'My Acquisitions'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-heritage-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-heritage-600 font-cinzel text-xl animate-pulse uppercase tracking-[0.3em]">Accessing Records...</p>
          </div>
        ) : activeTab === 'products' ? (
          <div className="space-y-6">
            {products.length === 0 ? (
              <div className="card p-20 text-center bg-dark-800/30 border-dashed border-dark-700">
                <p className="text-xl font-cinzel text-slate-400 mb-8 uppercase tracking-widest">Your registry is currently empty</p>
                <button
                  onClick={() => navigate('/add-product')}
                  className="btn-secondary py-3 px-10"
                >
                  List Your First Artifact
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="card p-8 bg-dark-800/50 backdrop-blur-xl group hover:border-heritage-600 transition-all duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8 flex-1">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-dark-700 flex-shrink-0">
                        <img src={product.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-heritage-600 transition-colors">{product.title}</h3>
                        <div className="flex gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Valuation</p>
                            <p className="text-sm font-bold text-heritage-600">₹{product.price?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Verification</p>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              product.verificationStatus === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {product.verificationStatus}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Views</p>
                            <p className="text-sm font-bold text-white">{product.views || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="btn-secondary py-2 px-6 text-xs"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {myBids.length === 0 ? (
              <div className="card p-20 text-center bg-dark-800/30 border-dashed border-dark-700">
                <p className="text-xl font-cinzel text-slate-400 mb-8 uppercase tracking-widest">No active acquisitions in progress</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="btn-secondary py-3 px-10"
                >
                  Enter Marketplace
                </button>
              </div>
            ) : (
              myBids.map((bid) => (
                <div key={bid._id} className="card p-8 bg-dark-800/50 backdrop-blur-xl group hover:border-heritage-600 transition-all duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{bid.productId?.title}</h3>
                      <div className="flex gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Your Bid</p>
                          <p className="text-xl font-black text-heritage-600">₹{bid.amount?.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Auction Status</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{bid.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${bid.productId?._id}`)}
                      className="btn-primary py-3 px-10 text-xs"
                    >
                      Revisit Artifact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}