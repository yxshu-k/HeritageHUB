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
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories();
        setCategories(response.data.data || [
          'Ancient Coins', 'Vintage Watches', 'Rare Books', 
          'Antique Jewelry', 'Paintings', 'Sculptures', 
          'Historical Cameras', 'Traditional Artifacts'
        ]);
      } catch (err) {
        console.error(err);
        setCategories([
          'Ancient Coins', 'Vintage Watches', 'Rare Books', 
          'Antique Jewelry', 'Paintings', 'Sculptures', 
          'Historical Cameras', 'Traditional Artifacts'
        ]);
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
    if (files.length + images.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image of the artifact');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((image) => data.append('images', image));

    try {
      await productAPI.createProduct(data);
      toast.success('Artifact submitted for authentication! 🏺');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit artifact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-10 md:py-24 px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-heritage-600/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>

      <div className="container-app max-w-4xl relative z-10">
        <div className="mb-10 md:mb-12">
          <div className="inline-block px-3 py-1 bg-heritage-600/10 border border-heritage-600/30 rounded-full mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-heritage-600 font-black">Seller Protocol</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">LIST AN <span className="text-heritage-600">ARTIFACT</span></h1>
          <p className="text-slate-400 font-light text-base md:text-lg italic text-sm md:text-base">Every piece has a soul. Share its story with the world.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 md:p-10 border-t-2 border-heritage-600 bg-dark-800/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-heritage-600 mb-6 md:mb-8 uppercase tracking-[0.4em]">Historical Cataloging</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Artifact Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 17th Century Mughal Silver Coin"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Classification</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Estimated Value (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Amount in INR"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Estimated Age / Period</label>
                  <input
                    type="text"
                    name="estimatedAge"
                    value={formData.estimatedAge}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. Early 1900s, 150 years old"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Condition & Details</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Describe the condition, materials, and any special features..."
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">The Artifact's Story</label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Share the history, origin, or cultural significance of this item..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Media & Action */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card p-8 border-t-2 border-heritage-600 bg-dark-800/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-heritage-600 mb-8 uppercase tracking-[0.4em]">Visual Evidence</h3>
              
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <div className="w-full h-48 border-2 border-dashed border-dark-700 rounded-xl flex flex-col items-center justify-center group-hover:border-heritage-600 transition-colors bg-dark-900/50">
                    <span className="text-4xl mb-3">📸</span>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">Upload High-Res Images<br/>(Max 4)</p>
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative h-24 rounded-lg overflow-hidden border border-dark-700 group">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] uppercase tracking-widest text-heritage-600 font-black">Heritage Score</label>
                    <span className="text-heritage-600 font-black">{formData.heritageScore}/10</span>
                  </div>
                  <input
                    type="range"
                    name="heritageScore"
                    min="1"
                    max="10"
                    value={formData.heritageScore}
                    onChange={handleInputChange}
                    className="w-full h-1 bg-dark-700 rounded-full appearance-none accent-heritage-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-heritage-600/5 border border-heritage-600/20 rounded-lg">
                  <p className="text-[10px] text-heritage-600 font-bold leading-relaxed">
                    📝 NOTE: Our curators will verify the authenticity of your artifact before it goes live. High-quality photos significantly speed up the process.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : 'Establish Listing'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancel and Return
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}