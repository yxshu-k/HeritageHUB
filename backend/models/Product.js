const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Ancient Coins',
      'Vintage Watches',
      'Rare Books',
      'Antique Jewelry',
      'Paintings',
      'Sculptures',
      'Historical Cameras',
      'Traditional Artifacts',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 10
  },
  story: {
    type: String,
    default: 'Heritage story coming soon...'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  estimatedAge: {
    type: String,
    default: 'Age unknown'
  },
  heritageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [{
    type: String,
    required: true
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentBid: {
    type: Number,
    default: 0
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  auctionActive: {
    type: Boolean,
    default: false
  },
  auctionEndDate: Date,
  views: {
    type: Number,
    default: 0
  },
  wishlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);