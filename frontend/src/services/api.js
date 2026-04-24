import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('heritageToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('heritageToken');
      localStorage.removeItem('heritageUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH ENDPOINTS
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// PRODUCT ENDPOINTS
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'images') {
        data[key].forEach((img) => formData.append('images', img));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  verifyProduct: (id) => api.put(`/products/${id}/verify`, {}),
  getCategories: () => api.get('/products/categories'),
};

// BID ENDPOINTS
export const bidAPI = {
  placeBid: (data) => api.post('/bids', data),
  getProductBids: (productId) => api.get(`/bids/${productId}`),
  getUserBids: () => api.get('/bids/user/mybids'),
};

// WISHLIST ENDPOINTS
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkInWishlist: (productId) => api.get(`/wishlist/${productId}/check`),
};

// WIKIPEDIA API FOR ANTIQUE HISTORY
export const heritageAPI = {
  getHeritageInfo: async (searchTerm) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&origin=*`
      );
      return response.data.query.search || [];
    } catch (error) {
      console.error('Heritage API Error:', error);
      return [];
    }
  },

  getArticleContent: async (title) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=extracts&explaintext=true&format=json&origin=*`
      );
      const pages = response.data.query.pages;
      const pageContent = Object.values(pages)[0]?.extract || '';
      return pageContent.substring(0, 500) + '...';
    } catch (error) {
      console.error('Article Fetch Error:', error);
      return '';
    }
  },

  // Mock heritage data for fallback
  getMockHeritageData: (category) => {
    const heritageData = {
      'Ancient Coins': {
        title: 'Ancient Coinage Systems',
        history: 'Ancient coins represent the pinnacle of early currency systems, originating around 600 BC. These artifacts showcase the economic, political, and artistic achievements of civilizations.',
        origin: 'Mediterranean and Middle Eastern regions',
        significance: 'Key evidence of trade routes, economic systems, and political hierarchies',
      },
      'Vintage Watches': {
        title: 'History of Horology',
        history: 'Mechanical watches represent centuries of innovation in timekeeping. From pocket watches to wristwatches, each era brought refinements in precision and design.',
        origin: 'European craftsmen, particularly Swiss and German makers',
        significance: 'Symbols of precision engineering and luxury craftsmanship',
      },
      'Rare Books': {
        title: 'Antiquarian Bibliography',
        history: 'Rare books are treasures of human knowledge, preserving first editions of seminal works. Collectible editions range from incunabula to limited modern printings.',
        origin: 'Publishing centers across Europe and Asia',
        significance: 'Windows into intellectual history and cultural development',
      },
      'Antique Jewelry': {
        title: 'Jewelry Through the Ages',
        history: 'Antique jewelry combines artistic vision with precious materials, reflecting fashion, status, and cultural values across millennia.',
        origin: 'Global artisan communities',
        significance: 'Personal adornment as cultural and economic indicator',
      },
      'Paintings': {
        title: 'Art History and Masterpieces',
        history: 'Historical paintings are windows into artistic movements, capturing the aesthetic and cultural zeitgeist of their eras.',
        origin: 'European art centers during the Renaissance and beyond',
        significance: 'Cultural and monetary value in art markets',
      },
      'Sculptures': {
        title: 'Sculptural Traditions',
        history: 'Sculptures represent the evolution of three-dimensional artistic expression across cultures and centuries.',
        origin: 'Ancient civilizations to modern era',
        significance: 'Evidence of artistic technique and cultural values',
      },
      'Historical Cameras': {
        title: 'Evolution of Photography',
        history: 'Vintage cameras chronicle the technical evolution of photography, from daguerreotypes to early 35mm systems.',
        origin: 'Pioneer photographers and manufacturers',
        significance: 'Instrumental in democratizing visual documentation',
      },
      'Traditional Artifacts': {
        title: 'Cultural Artifacts & Anthropology',
        history: 'Traditional artifacts preserve cultural practices, beliefs, and technologies of civilizations past and present.',
        origin: 'Diverse cultures worldwide',
        significance: 'Anthropological and cultural preservation',
      },
    };
    return heritageData[category] || heritageData['Traditional Artifacts'];
  },
};

export default api;
