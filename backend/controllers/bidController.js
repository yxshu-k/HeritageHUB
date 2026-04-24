const Bid = require('../models/Bid');
const Product = require('../models/Product');
const User = require('../models/User');

const placeBid = async (req, res) => {
  try {
    const { productId, amount } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and bid amount are required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if product is for auction
    if (!product.auctionActive) {
      return res.status(400).json({
        success: false,
        message: 'This product is not accepting bids at the moment'
      });
    }

    // Validate bid amount
    const minimumBidAmount = product.currentBid > 0 ? product.currentBid * 1.05 : product.price;

    if (parseFloat(amount) <= minimumBidAmount) {
      return res.status(400).json({
        success: false,
        message: `Bid must be at least ₹${minimumBidAmount.toFixed(2)} (5% higher than current bid)`
      });
    }

    // Mark previous bids as outbid
    await Bid.updateMany(
      { productId, status: 'active' },
      { status: 'outbid' }
    );

    // Create new bid
    const bid = await Bid.create({
      productId,
      bidderId: req.user.id,
      amount: parseFloat(amount),
      status: 'active'
    });

    // Update product with new bid
    await Product.findByIdAndUpdate(productId, {
      currentBid: parseFloat(amount),
      highestBidder: req.user.id
    });

    const populatedBid = await bid.populate('bidderId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: populatedBid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProductBids = async (req, res) => {
  try {
    const bids = await Bid.find({ productId: req.params.productId })
      .populate('bidderId', 'name email avatar')
      .sort({ amount: -1 })
      .limit(20);

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidderId: req.user.id })
      .populate('productId', 'title price images category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  placeBid,
  getProductBids,
  getUserBids
};