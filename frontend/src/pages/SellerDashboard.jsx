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
        // Fetch all products and filter by current user
        const productsRes = await productAPI.getAllProducts({});
        const userProducts = productsRes.data.data.filter(
          (p) => p.sellerId?._id === user._id
        );
        setProducts(userProducts);

        // Fetch user's bids
        const bidsRes = await bidAPI.getUserBids();
        setMyBids(bidsRes.data.data || []);
      } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [user, navigate]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-slate-400">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={() => navigate('/add-product')}
            className="btn-primary"
          >
            + List New Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-heritage-600 mb-2">
              {products.length}
            </p>
            <p className="text-slate-400">Items Listed</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-heritage-600 mb-2">
              {myBids.length}
            </p>
            <p className="text-slate-400">Active Bids</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-heritage-600 mb-2">
              {products.filter((p) => p.verificationStatus === 'verified').length}
            </p>
            <p className="text-slate-400">Verified Items</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-heritage-600 text-white'
                : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bids'
                ? 'bg-heritage-600 text-white'
                : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            My Bids
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-heritage-600 font-semibold">Loading...</p>
            </div>
          </div>
        ) : activeTab === 'products' ? (
          <div>
            {products.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-xl text-slate-400 mb-4">No products listed yet</p>
                <button
                  onClick={() => navigate('/add-product')}
                  className="btn-primary"
                >
                  List Your First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="card p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-heritage-600 mb-2">
                          {product.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Price</p>
                            <p className="font-bold text-heritage-600">
                              ₹{product.price?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Status</p>
                            <p className={`font-bold ${
                              product.verificationStatus === 'verified'
                                ? 'text-green-600'
                                : product.verificationStatus === 'rejected'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}>
                              {product.verificationStatus}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Current Bid</p>
                            <p className="font-bold text-heritage-600">
                              ₹{product.currentBid?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Views</p>
                            <p className="font-bold text-heritage-600">
                              {product.views || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="btn-secondary py-2 px-4 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {myBids.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-xl text-slate-400 mb-4">No bids placed yet</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="btn-primary"
                >
                  Start Bidding
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myBids.map((bid) => (
                  <div key={bid._id} className="card p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-heritage-600 mb-2">
                          {bid.productId?.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          Status: <span className="font-semibold text-heritage-600">{bid.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Bid Amount</p>
                        <p className="text-2xl font-bold text-heritage-600">
                          ₹{bid.amount?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${bid.productId?._id}`)}
                        className="btn-secondary py-2 px-4"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}