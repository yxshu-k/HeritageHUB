const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { placeBid, getProductBids, getUserBids } = require('../controllers/bidController');

router.post('/', protect, placeBid);
router.get('/user/mybids', protect, getUserBids);
router.get('/:productId', getProductBids);

module.exports = router;