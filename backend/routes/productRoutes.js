const express = require('express');
const router = express.Router();
const upload = require('../middleware/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  verifyProduct,
  getCategories
} = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images', 4), createProduct);
router.put('/:id', protect, upload.array('images', 4), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.put('/:id/verify', protect, verifyProduct);

module.exports = router;