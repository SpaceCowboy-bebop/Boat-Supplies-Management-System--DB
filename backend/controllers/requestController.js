const Request = require('../models/Request');

exports.submitRequest = async (req, res) => {
    try {
        const { user_id, trip_id, items, general_comment } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'At least one item is required' 
            });
        }

        // Create request
        const requestId = await Request.create({
            user_id,
            trip_id: trip_id || null,
            general_comment: general_comment || ''
        });

        // Add items to request
        await Request.addItems(requestId, items);

        // Create log entry
        await Request.createLog(
            requestId, 
            'submitted', 
            user_id, 
            'Request submitted'
        );

        // TODO: Create notification for manager

        res.json({
            success: true,
            message: 'Request submitted successfully',
            requestId
        });

    } catch (error) {
        console.error('Submit request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.getAll();
        
        res.json({
            success: true,
            requests
        });

    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await Request.getByUser(userId);
        
        res.json({
            success: true,
            requests
        });

    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await Request.getById(requestId);
        
        if (!request) {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found' 
            });
        }

        res.json({
            success: true,
            request
        });

    } catch (error) {
        console.error('Get request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status, manager_comment } = req.body;
        const reviewerId = req.user.id;

        // Validate status
        const validStatuses = ['approved', 'denied', 'pending'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }

        // Update request status
        await Request.updateStatus(requestId, status, reviewerId, manager_comment);

        // Create log entry
        await Request.createLog(
            requestId, 
            status, 
            reviewerId, 
            `Request ${status} by manager`
        );

        // TODO: Create notification for requester

        res.json({
            success: true,
            message: `Request ${status} successfully`
        });

    } catch (error) {
        console.error('Update request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};
