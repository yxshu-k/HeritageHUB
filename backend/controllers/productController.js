const Product = require('../models/Product');
const User = require('../models/User');

const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort = '-createdAt', verified = false } = req.query;
    let query = {};

    if (verified === 'true') {
      query.verificationStatus = 'verified';
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } }
      ];
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('sellerId', 'name email avatar role')
      .populate('verifiedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('sellerId', 'name email avatar role')
      .populate('verifiedBy', 'name')
      .populate('highestBidder', 'name email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, category, description, story, price, estimatedAge, heritageScore } = req.body;

    // Validate input
    if (!title || !category || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, description, price'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const images = req.files.map(file => file.path);

    const product = await Product.create({
      title,
      category,
      description,
      story: story || 'Heritage story coming soon...',
      price: parseFloat(price),
      estimatedAge: estimatedAge || 'Age unknown',
      heritageScore: Math.min(10, Math.max(0, parseInt(heritageScore) || 0)),
      images,
      sellerId: req.user.id
    });

    const populatedProduct = await product.populate('sellerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Only seller can update
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('sellerId', 'name email');

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Only seller or admin can delete
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin can verify
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can verify products' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        verificationStatus: 'verified',
        verifiedBy: req.user.id,
        heritageScore: 7
      },
      { new: true }
    ).populate('sellerId', 'name email');

    res.json({ success: true, message: 'Product verified', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = [
      'Ancient Coins',
      'Vintage Watches',
      'Rare Books',
      'Antique Jewelry',
      'Paintings',
      'Sculptures',
      'Historical Cameras',
      'Traditional Artifacts'
    ];
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  verifyProduct,
  getCategories
};