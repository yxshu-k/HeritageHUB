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
        let productData;
        if (id.startsWith('mock')) {
          // Handle mock data for demo
          toast.info('Viewing Demo Artifact');
          // I will define MOCK_DATA here for the demo
          const MOCK_DATA = {
            mock1: { _id: 'mock1', title: 'Royal Mughal Gold Coin', category: 'Ancient Coins', price: 450000, estimatedAge: '350+ Years', heritageScore: 9.5, story: 'An exquisite gold mohur from the era of Emperor Shah Jahan.', description: 'This museum-grade coin represents the pinnacle of Mughal currency.', images: ['https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200'] },
            mock2: { _id: 'mock2', title: 'Victorian Silver Pocket Watch', category: 'Vintage Watches', price: 125000, estimatedAge: '140+ Years', heritageScore: 8.8, story: 'A masterpiece of 19th-century horology.', description: 'Handcrafted in London with a sterling silver case and high-precision movement.', images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=1200'] },
            mock3: { _id: 'mock3', title: 'Ancient Greek Amphora', category: 'Sculptures', price: 890000, estimatedAge: '2000+ Years', heritageScore: 9.9, story: 'A beautifully preserved terracotta vessel.', description: 'Depicting classical scenes of Dionysian rituals, this amphora is a rare survivor.', images: ['https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200'] },
            mock4: { _id: 'mock4', title: 'Imperial Jade Scepter', category: 'Artifacts', price: 1500000, estimatedAge: '250+ Years', heritageScore: 9.7, story: 'A symbol of supreme authority.', description: 'Carved from a single piece of flawless jade for the Qing court.', images: ['https://images.unsplash.com/photo-1599708147811-189f70d18d45?auto=format&fit=crop&q=80&w=1200'] },
            mock5: { _id: 'mock5', title: 'Renaissance Astrolabe', category: 'Artifacts', price: 750000, estimatedAge: '450+ Years', heritageScore: 9.4, story: 'A sophisticated astronomical instrument.', description: 'Used by the great explorers of the 16th century to map the new world.', images: ['https://images.unsplash.com/photo-1584266304446-cc28659582d1?auto=format&fit=crop&q=80&w=1200'] },
          };
          productData = MOCK_DATA[id] || MOCK_DATA.mock1;
        } else {
          const productRes = await productAPI.getProductById(id);
          productData = productRes.data.data;
        }

        setProduct(productData);

        if (!id.startsWith('mock')) {
          const bidsRes = await bidAPI.getProductBids(id);
          setBids(bidsRes.data.data || []);
        }

        // Fetch heritage info
        const heritageResults = await heritageAPI.getHeritageInfo(productData.category);
        if (heritageResults.length > 0) {
          const content = await heritageAPI.getArticleContent(heritageResults[0].title);
          setHeritageInfo({
            title: heritageResults[0].title,
            content: content,
          });
        } else {
          const mockData = heritageAPI.getMockHeritageData(productData.category);
          setHeritageInfo(mockData);
        }

        // Check wishlist
        if (user && !id.startsWith('mock')) {
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
    <div className="min-h-screen bg-dark-900 py-6 md:py-12 px-4">
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
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>

            {/* Heritage History */}
            {heritageInfo && (
              <div className="card p-8 mb-8 border-l-4 border-heritage-600 bg-gradient-to-br from-dark-800 to-dark-900 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📜</span>
                  <h3 className="text-xl md:text-2xl font-cinzel font-bold text-heritage-600">
                    Heritage & Historical Context
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {heritageInfo.title}
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {heritageInfo.extract || heritageInfo.history}
                    </p>
                    
                    {heritageInfo.origin && (
                      <div className="pt-4 flex flex-wrap gap-4">
                        <div className="bg-dark-700/50 px-3 py-2 rounded-lg border border-dark-600">
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Origin</p>
                          <p className="text-xs text-heritage-600 font-bold">{heritageInfo.origin}</p>
                        </div>
                        <div className="bg-dark-700/50 px-3 py-2 rounded-lg border border-dark-600">
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Cultural Significance</p>
                          <p className="text-xs text-heritage-600 font-bold">Highly Significant</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {heritageInfo.image && (
                    <div className="md:col-span-1">
                      <div className="rounded-xl overflow-hidden border border-dark-700 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <img 
                          src={heritageInfo.image} 
                          alt={heritageInfo.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="bg-dark-800 p-2 text-center">
                          <p className="text-[10px] text-slate-500 italic">Reference Image from Wikipedia</p>
                        </div>
                      </div>
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
                <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-heritage-600">
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
                <p className="text-3xl md:text-4xl font-bold text-heritage-600 mb-6">
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