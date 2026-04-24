import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    story: '',
    price: '',
    estimatedAge: '',
    heritageScore: 5,
    images: [],
  });
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    setFormData({
      ...formData,
      images: files,
    });

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
    });
    setPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.price ||
      formData.images.length === 0
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      await productAPI.createProduct(formData);
      toast.success('Product listed successfully!');
      navigate('/marketplace');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container-app max-w-2xl">
        <h1 className="section-title mb-4">List Your Antique</h1>
        <p className="section-subtitle mb-8">Share your treasured collectible with the community</p>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-heritage-600 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Vintage Omega Seamaster Watch, 1965"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-heritage-600 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-heritage-600 mb-2">
                Starting Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
                placeholder="10000"
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-heritage-600 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Describe the condition, materials, dimensions, and any special features..."
              rows="4"
              required
            />
          </div>

          {/* Heritage Story */}
          <div>
            <label className="block text-sm font-semibold text-heritage-600 mb-2">
              Heritage Story
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Share the history, origin, or cultural significance of this item..."
              rows="4"
            />
          </div>

          {/* Estimated Age & Heritage Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-heritage-600 mb-2">
                Estimated Age
              </label>
              <input
                type="text"
                name="estimatedAge"
                value={formData.estimatedAge}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., Early 1900s, 150 years old"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-heritage-600 mb-2">
                Heritage Score (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="heritageScore"
                  value={formData.heritageScore}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-dark-700 rounded-full cursor-pointer accent-heritage-600"
                  min="1"
                  max="10"
                />
                <span className="text-heritage-600 font-bold text-lg w-6">
                  {formData.heritageScore}
                </span>
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-semibold text-heritage-600 mb-2">
              Upload Images (Max 4) *
            </label>
            <div className="border-2 border-dashed border-heritage-600 rounded-lg p-8 text-center hover:border-heritage-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
                required={formData.images.length === 0}
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-slate-300 font-semibold">Click to upload images</p>
                <p className="text-slate-500 text-sm">or drag and drop</p>
              </label>
            </div>

            {/* Image Previews */}
            {preview.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-heritage-600 mb-3">
                  Selected Images ({preview.length}/4)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {preview.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-heritage-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-dark-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Listing Product...' : 'List Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}