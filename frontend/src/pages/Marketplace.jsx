import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    sortBy: '-createdAt',
    verified: false,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: filters.category || undefined,
          search: filters.search || undefined,
          sort: filters.sortBy,
          verified: filters.verified ? 'true' : undefined,
        };

        const response = await productAPI.getAllProducts(params);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 py-20 px-4">
      <div className="container-app">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-heritage-600/10 border border-heritage-600/30 rounded-full mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-heritage-600 font-black">Curated Collection</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">THE <span className="text-heritage-600">GALLERY</span></h1>
            <p className="text-slate-400 font-light text-lg italic">Explore rare antiquities and priceless artifacts curated from across the globe.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-dark-800 p-2 rounded-xl border border-dark-700 shadow-xl">
             <div className="flex items-center gap-2 px-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Marketplace</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-32 border-t-2 border-heritage-600">
              <h3 className="text-xs font-black text-heritage-600 mb-8 uppercase tracking-[0.4em]">Filter Archives</h3>

              <div className="space-y-8">
                {/* Search */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">
                    Search Artifact
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="input-field pl-10"
                      placeholder="e.g. Mughal Gold..."
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">🔍</span>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">
                    Era / Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="input-field appearance-none"
                  >
                    <option value="">All Periods</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">
                    Valuation Order
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="input-field appearance-none"
                  >
                    <option value="-createdAt">Newest Discoveries</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-heritageScore">Heritage Score</option>
                  </select>
                </div>

                {/* Verified Only */}
                <div className="pt-4 border-t border-dark-700">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="verified"
                        checked={filters.verified}
                        onChange={handleFilterChange}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-dark-950 border border-dark-700 rounded-full peer-checked:bg-heritage-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-slate-600 rounded-full peer-checked:translate-x-5 peer-checked:bg-dark-900 transition-all"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
                      Authenticated Only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="w-16 h-16 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-heritage-600 font-cinzel text-xl animate-pulse uppercase tracking-[0.3em]">Opening Vaults...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card p-20 text-center bg-dark-800/50 backdrop-blur-sm border-dashed border-dark-700">
                <div className="text-6xl mb-6">🏺</div>
                <h3 className="text-2xl font-cinzel font-bold text-white mb-2">No Artifacts Found</h3>
                <p className="text-slate-500 font-light mb-8">The archives do not contain items matching your current filters.</p>
                <button 
                  onClick={() => setFilters({ search: '', category: '', sortBy: '-createdAt', verified: false })}
                  className="btn-secondary py-2 px-8 text-xs"
                >
                  Reset Archives
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-slate-500">
                  <span>Showing {products.length} cataloged artifacts</span>
                  <span className="text-heritage-600">Page 1 of 1</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}