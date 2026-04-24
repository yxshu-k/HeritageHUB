const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bidder ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0, 'Bid amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'outbid', 'won', 'rejected'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for quick lookups
bidSchema.index({ productId: 1, amount: -1 });
bidSchema.index({ bidderId: 1 });
bidSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);