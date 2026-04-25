import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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
      // Search for the category or term
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm + ' history artifact')}&format=json&origin=*`
      );
      return response.data.query.search || [];
    } catch (error) {
      console.error('Heritage API Search Error:', error);
      return [];
    }
  },

  getArticleContent: async (title) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&format=json&origin=*`
      );
      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (!page || page.missing === '') return null;

      return {
        extract: page.extract ? page.extract.substring(0, 800) + '...' : '',
        image: page.original?.source || null
      };
    } catch (error) {
      console.error('Article Fetch Error:', error);
      return null;
    }
  },

  // Mock heritage data for fallback
  getMockHeritageData: (category) => {
    const heritageData = {
      'Ancient Coins': {
        title: 'Ancient Coinage Systems',
        history: 'Ancient coins represent the pinnacle of early currency systems, originating around 600 BC in Lydia. These artifacts showcase the economic, political, and artistic achievements of civilizations like the Greeks, Romans, and Mauryans.',
        origin: 'Lydia, Greece, Rome, India',
        significance: 'Key evidence of trade routes, economic systems, and political hierarchies',
      },
      'Vintage Watches': {
        title: 'History of Horology',
        history: 'Mechanical watches represent centuries of innovation in timekeeping. From the first Nuremberg eggs to the precision of Swiss movements, each era brought refinements in precision and design.',
        origin: 'Europe, particularly Switzerland, Germany, and England',
        significance: 'Symbols of precision engineering and luxury craftsmanship',
      },
      'Rare Books': {
        title: 'Antiquarian Bibliography',
        history: 'Rare books are treasures of human knowledge, preserving first editions of seminal works. Collectible editions range from early incunabula to limited modern printings with unique bindings.',
        origin: 'Publishing centers across Europe and Asia',
        significance: 'Windows into intellectual history and cultural development',
      },
      'Antique Jewelry': {
        title: 'Jewelry Through the Ages',
        history: 'Antique jewelry combines artistic vision with precious materials, reflecting fashion, status, and cultural values across millennia, from Victorian mourning jewelry to Art Deco masterpieces.',
        origin: 'Global artisan communities across Egypt, Europe, and Asia',
        significance: 'Personal adornment as cultural and economic indicator',
      },
      'Paintings': {
        title: 'Art History and Masterpieces',
        history: 'Historical paintings are windows into artistic movements, capturing the aesthetic and cultural zeitgeist of their eras, from the Renaissance masters to Impressionist pioneers.',
        origin: 'European and Asian art centers',
        significance: 'Cultural and monetary value in art markets',
      },
      'Sculptures': {
        title: 'Sculptural Traditions',
        history: 'Sculptures represent the evolution of three-dimensional artistic expression across cultures and centuries, using materials like marble, bronze, and terracotta.',
        origin: 'Ancient civilizations to modern era',
        significance: 'Evidence of artistic technique and cultural values',
      },
      'Historical Cameras': {
        title: 'Evolution of Photography',
        history: 'Vintage cameras chronicle the technical evolution of photography, from the earliest daguerreotype boxes to the iconic Leica 35mm systems that revolutionized photojournalism.',
        origin: 'Europe and USA',
        significance: 'Instrumental in democratizing visual documentation',
      },
      'Traditional Artifacts': {
        title: 'Cultural Artifacts & Anthropology',
        history: 'Traditional artifacts preserve cultural practices, beliefs, and technologies of civilizations past and present, serving as a bridge between generations.',
        origin: 'Diverse cultures worldwide',
        significance: 'Anthropological and cultural preservation',
      },
    };
    return heritageData[category] || heritageData['Traditional Artifacts'];
  },
};

export default api;
