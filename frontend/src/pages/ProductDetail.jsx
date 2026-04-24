import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, bidAPI, wishlistAPI, heritageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [heritageInfo, setHeritageInfo] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const productRes = await productAPI.getProductById(id);
        setProduct(productRes.data.data);

        const bidsRes = await bidAPI.getProductBids(id);
        setBids(bidsRes.data.data || []);

        // Fetch heritage info
        const heritageResults = await heritageAPI.getHeritageInfo(
          productRes.data.data.category
        );
        if (heritageResults.length > 0) {
          const content = await heritageAPI.getArticleContent(heritageResults[0].title);
          setHeritageInfo({
            title: heritageResults[0].title,
            content: content,
          });
        } else {
          const mockData = heritageAPI.getMockHeritageData(productRes.data.data.category);
          setHeritageInfo(mockData);
        }

        // Check wishlist
        if (user) {
          try {
            const wishlistRes = await wishlistAPI.checkInWishlist(id);
            setIsInWishlist(wishlistRes.data.isInWishlist);
          } catch (err) {
            console.error('Wishlist check failed:', err);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate, user]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to place a bid');
      navigate('/login');
      return;
    }

    setBidLoading(true);

    try {
      await bidAPI.placeBid({
        productId: id,
        amount: parseFloat(bidAmount),
      });
      toast.success('Bid placed successfully!');
      setBidAmount('');

      // Refresh bids and product
      const bidsRes = await bidAPI.getProductBids(id);
      setBids(bidsRes.data.data || []);

      const productRes = await productAPI.getProductById(id);
      setProduct(productRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-heritage-600 font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-xl text-slate-400">Product not found</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn-primary mt-4"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app">
        <button
          onClick={() => navigate('/marketplace')}
          className="text-heritage-600 hover:text-heritage-500 mb-8 flex items-center gap-2"
        >
          ← Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden mb-6">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/800x600?text=Antique'}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Heritage History */}
            {heritageInfo && (
              <div className="card p-6 mb-6">
                <h3 className="text-2xl font-cinzel font-bold text-heritage-600 mb-4">
                  Heritage & History
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-heritage-600 mb-2">
                      {heritageInfo.title}
                    </h4>
                    <p className="text-slate-400 leading-relaxed">
                      {heritageInfo.content || heritageInfo.history}
                    </p>
                  </div>
                  {heritageInfo.origin && (
                    <div>
                      <p className="text-sm text-slate-500">
                        <span className="font-semibold text-heritage-600">Origin:</span>{' '}
                        {heritageInfo.origin}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="card p-6">
              <h3 className="text-2xl font-cinzel font-bold text-heritage-600 mb-4">
                About This Item
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Sidebar - Product Info & Bidding */}
          <div className="lg:col-span-1">
            {/* Product Info Card */}
            <div className="card p-6 mb-6">
              <div className="mb-4">
                {product.verificationStatus === 'verified' && (
                  <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    ✓ Verified
                  </span>
                )}
                <h1 className="text-3xl font-cinzel font-bold text-heritage-600">
                  {product.title}
                </h1>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-dark-700">
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="text-lg font-semibold text-heritage-600">
                    {product.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Estimated Age</p>
                  <p className="text-lg font-semibold text-heritage-600">
                    {product.estimatedAge}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Heritage Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-heritage-600"
                        style={{ width: `${(product.heritageScore / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-heritage-600 font-bold">
                      {product.heritageScore}/10
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Seller</p>
                  <p className="text-lg font-semibold text-heritage-600">
                    {product.sellerId?.name}
                  </p>
                </div>
              </div>

              {/* Price & Wishlist */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">Starting Price</p>
                <p className="text-4xl font-bold text-heritage-600 mb-6">
                  ₹{product.price?.toLocaleString()}
                </p>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-3 ${
                    isInWishlist
                      ? 'bg-heritage-600 text-white hover:bg-heritage-700'
                      : 'border-2 border-heritage-600 text-heritage-600 hover:bg-heritage-600 hover:text-white'
                  }`}
                >
                  {isInWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>

            {/* Bidding Section */}
            {product.auctionActive ? (
              <div className="card p-6 mb-6 border-heritage-600 border-2">
                <h3 className="text-xl font-cinzel font-bold text-heritage-600 mb-4">
                  Place Your Bid
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-slate-500">Current Bid</p>
                  <p className="text-2xl font-bold text-heritage-600 mb-4">
                    ₹{product.currentBid?.toLocaleString() || product.price?.toLocaleString()}
                  </p>

                  {product.highestBidder && (
                    <p className="text-xs text-slate-500">
                      Highest Bidder: {product.highestBidder?.name}
                    </p>
                  )}
                </div>

                <form onSubmit={handlePlaceBid} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-heritage-600 mb-2">
                      Your Bid Amount
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="input-field"
                      placeholder={`Minimum: ₹${(product.currentBid * 1.05).toLocaleString()}`}
                      step="100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bidLoading || !user}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {bidLoading ? 'Placing Bid...' : 'Place Bid'}
                  </button>

                  {!user && (
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full btn-secondary"
                    >
                      Sign In to Bid
                    </button>
                  )}
                </form>
              </div>
            ) : (
              <div className="card p-6 mb-6 bg-dark-800 text-center">
                <p className="text-slate-400">Bidding is not active for this item</p>
              </div>
            )}

            {/* Recent Bids */}
            {bids.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-cinzel font-bold text-heritage-600 mb-4">
                  Recent Bids
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {bids.slice(0, 10).map((bid, idx) => (
                    <div
                      key={bid._id}
                      className="flex justify-between items-center py-2 px-3 bg-dark-800 rounded-lg"
                    >
                      <span className="text-sm">
                        <span className="font-semibold text-heritage-600">#{idx + 1}</span>
                        {' '}
                        {bid.bidderId?.name}
                      </span>
                      <span className="font-bold text-heritage-600">
                        ₹{bid.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}