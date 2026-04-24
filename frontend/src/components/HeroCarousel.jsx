import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-96 bg-gradient-luxury flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-heritage-600 font-semibold">Loading Heritage Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-luxury py-12">
      <div className="container-app">
        <div className="mb-12 text-center">
          <h2 className="section-title">Featured Heritage Collections</h2>
          <p className="section-subtitle">Explore our most coveted antiques and collectibles</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-slate-400">No verified products yet. Check back soon!</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="heroCarousel"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="card-hover h-full cursor-pointer group"
                >
                  <div className="relative h-64 overflow-hidden bg-dark-700">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=Antique'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.verificationStatus === 'verified' && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-cinzel font-bold text-heritage-600 mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                      {product.story || 'A remarkable piece from history...'}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Estimated Age:</span>
                        <span className="text-heritage-600 font-semibold">{product.estimatedAge}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Heritage Score:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1 bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-heritage-600"
                              style={{ width: `${(product.heritageScore / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-heritage-600 font-semibold w-6">
                            {product.heritageScore}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                      <span className="text-2xl font-bold text-heritage-600">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <button className="btn-primary text-sm py-2 px-4">
                        Explore →
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style>{`
        .heroCarousel :global(.swiper-button-next),
        .heroCarousel :global(.swiper-button-prev) {
          color: #c9a84c;
          background: rgba(11, 11, 11, 0.8);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .heroCarousel :global(.swiper-button-next:hover),
        .heroCarousel :global(.swiper-button-prev:hover) {
          background: rgba(201, 168, 76, 0.2);
        }

        .heroCarousel :global(.swiper-pagination-bullet) {
          background: #c9a84c;
          opacity: 0.5;
        }

        .heroCarousel :global(.swiper-pagination-bullet-active) {
          background: #c9a84c;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}