const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAnnouncements);
router.post('/', protect, authorize('Faculty', 'Admin'), createAnnouncement);
router.delete('/:id', protect, authorize('Faculty', 'Admin'), deleteAnnouncement);

module.exports = router;
