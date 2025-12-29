// This is from Step 12
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Submit new request (all roles except owner)
router.post('/submit', 
    authorize('chef', 'barman', 'captain', 'steward', 'mechanic'), 
    requestController.submitRequest
);

// Get my requests
router.get('/my', requestController.getMyRequests);

// Get specific request
router.get('/:id', requestController.getRequestById);

// Manager only routes
router.get('/', 
    authorize('manager', 'owner'), 
    requestController.getAllRequests
);

router.put('/:id/status', 
    authorize('manager', 'owner'), 
    requestController.updateRequestStatus
);

module.exports = router;
