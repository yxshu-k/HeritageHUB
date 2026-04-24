const User = require('../models/User');
const Product = require('../models/Product');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        populate: { path: 'sellerId', select: 'name email' }
      });

    res.json({
      success: true,
      count: user.wishlist?.length || 0,
      data: user.wishlist || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlistCount: user.wishlist.length,
      data: user.wishlist
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlistCount: user.wishlist.length,
      data: user.wishlist
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const checkInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    const isInWishlist = user.wishlist.includes(productId);

    res.json({
      success: true,
      isInWishlist
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist
};