import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const MOCK_HERO_PRODUCTS = [
  {
    _id: 'mock1',
    title: 'Royal Mughal Gold Coin',
    story: 'An exquisite gold mohur from the era of Emperor Shah Jahan, featuring intricate calligraphy and unparalleled purity.',
    images: ['https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200'],
    estimatedAge: '350+ Years',
    heritageScore: 9.5,
    price: 450000,
    verificationStatus: 'verified'
  },
  {
    _id: 'mock2',
    title: 'Victorian Silver Pocket Watch',
    story: 'A masterpiece of 19th-century horology, this precision timepiece was handcrafted in London and remains in perfect working condition.',
    images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=1200'],
    estimatedAge: '140+ Years',
    heritageScore: 8.8,
    price: 125000,
    verificationStatus: 'verified'
  },
  {
    _id: 'mock3',
    title: 'Ancient Greek Amphora',
    story: 'A beautifully preserved terracotta vessel from the Attic period, depicting scenes of classical mythology and everyday life.',
    images: ['https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200'],
    estimatedAge: '2000+ Years',
    heritageScore: 9.9,
    price: 890000,
    verificationStatus: 'verified'
  },
  {
    _id: 'mock4',
    title: 'Imperial Jade Scepter',
    story: 'A symbol of supreme authority from the Qing Dynasty, carved from a single piece of flawless Hetian jade.',
    images: ['https://images.unsplash.com/photo-1599708147811-189f70d18d45?auto=format&fit=crop&q=80&w=1200'],
    estimatedAge: '250+ Years',
    heritageScore: 9.7,
    price: 1500000,
    verificationStatus: 'verified'
  },
  {
    _id: 'mock5',
    title: 'Renaissance Astrolabe',
    story: 'A sophisticated astronomical instrument from 16th-century Florence, used by navigators to determine their latitude by the stars.',
    images: ['https://images.unsplash.com/photo-1584266304446-cc28659582d1?auto=format&fit=crop&q=80&w=1200'],
    estimatedAge: '450+ Years',
    heritageScore: 9.4,
    price: 750000,
    verificationStatus: 'verified'
  }
];

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getAllProducts({
          verified: 'true',
          limit: 10,
        });
        const fetchedProducts = response.data.data || [];
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : MOCK_HERO_PRODUCTS);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(MOCK_HERO_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-heritage-600 font-cinzel text-xl animate-pulse">Unveiling History...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-dark-950 overflow-hidden border-y border-dark-800">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ 
          clickable: true, 
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          }
        }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        className="h-[85vh] w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="relative w-full h-full flex items-center">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover opacity-40 scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=2000';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="container-app relative z-10 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-heritage-600/20 border border-heritage-600/50 text-heritage-600 rounded-full text-xs font-bold tracking-widest uppercase">
                      Featured Collection
                    </span>
                    {product.verificationStatus === 'verified' && (
                      <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        AUTHENTICATED
                      </span>
                    )}
                  </div>

                  <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-white mb-6 leading-tight">
                    {product.title}
                  </h1>

                  <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed italic">
                    "{product.story}"
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-10 border-l-2 border-heritage-600 pl-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Est. Age</p>
                      <p className="text-xl font-bold text-heritage-600">{product.estimatedAge}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Heritage Score</p>
                      <p className="text-xl font-bold text-heritage-600">{product.heritageScore}/10</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Current Value</p>
                      <p className="text-xl font-bold text-heritage-600">₹{product.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="btn-primary px-10 py-4 text-lg group"
                    >
                      Explore History
                      <span className="inline-block transition-transform group-hover:translate-x-2 ml-2">→</span>
                    </button>
                    <button 
                      onClick={() => navigate('/marketplace')}
                      className="text-white hover:text-heritage-600 transition-colors font-semibold"
                    >
                      Browse Gallery
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="relative p-4 bg-dark-800/50 backdrop-blur-xl border border-dark-700 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-[400px] object-cover rounded-xl shadow-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=2000';
                      }}
                    />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-heritage-600/10 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button className="swiper-button-prev-custom w-14 h-14 border border-dark-700 rounded-full flex items-center justify-center text-white hover:bg-heritage-600 hover:border-heritage-600 transition-all">
            <span className="text-2xl">←</span>
          </button>
          <button className="swiper-button-next-custom w-14 h-14 border border-dark-700 rounded-full flex items-center justify-center text-white hover:bg-heritage-600 hover:border-heritage-600 transition-all">
            <span className="text-2xl">→</span>
          </button>
        </div>
      </Swiper>

      <style>{`
        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          background: transparent !important;
          border: 2px solid #3d2e0a !important;
          opacity: 1 !important;
          margin: 0 8px !important;
          transition: all 0.3s !important;
        }
        .custom-bullet.swiper-pagination-bullet-active {
          background: #c9a84c !important;
          border-color: #c9a84c !important;
          transform: scale(1.2);
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}