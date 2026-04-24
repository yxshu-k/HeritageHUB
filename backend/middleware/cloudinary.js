const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'heritagehub',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `product_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    };
  },
});

module.exports = multer({ storage });