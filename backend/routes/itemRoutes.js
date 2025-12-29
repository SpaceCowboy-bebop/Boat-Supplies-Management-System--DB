// This is from Step 12
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

// Get all items
router.get('/', itemController.getAllItems);

// Get items by role
router.get('/role/:role', itemController.getItemsByRole);

// Get items by category
router.get('/category/:category', itemController.getItemsByCategory);

// Add new item (manager only)
router.post('/', 
    authorize('manager', 'owner'), 
    itemController.addItem
);

module.exports = router;
