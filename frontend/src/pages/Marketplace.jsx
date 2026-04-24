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
    search: searchParams.get('category') || '',
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
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app">
        <div className="mb-12">
          <h1 className="section-title">Marketplace</h1>
          <p className="section-subtitle">Discover rare antiques and heritage collectibles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-heritage-600 mb-6">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-heritage-600 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="input-field text-sm"
                  placeholder="Search products..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-heritage-600 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-field text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-heritage-600 mb-2">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="input-field text-sm"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="-price">Price (High to Low)</option>
                  <option value="-heritageScore">Heritage Score</option>
                </select>
              </div>

              {/* Verified Only */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="verified"
                  checked={filters.verified}
                  onChange={handleFilterChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label className="text-sm text-slate-300 cursor-pointer">
                  Verified Only
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-heritage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-heritage-600 font-semibold">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-xl text-slate-400 mb-4">No products found</p>
                <p className="text-slate-500">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm text-slate-400">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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