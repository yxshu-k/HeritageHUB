import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await wishlistAPI.getWishlist();
        setWishlist(response.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlist(wishlist.filter((item) => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app">
        <h1 className="section-title mb-4">My Wishlist</h1>
        <p className="section-subtitle mb-8">Your saved favorite items</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-heritage-600 font-semibold">Loading wishlist...</p>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-xl text-slate-400 mb-4">Your wishlist is empty</p>
            <p className="text-slate-500 mb-8">Start adding items you love</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="btn-primary"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-slate-400">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="w-full mt-3 btn-secondary text-sm py-2"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}