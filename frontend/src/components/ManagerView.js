import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManagerView({ user, onLogout }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [managerComment, setManagerComment] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const response = await api.getAllRequests();
            setRequests(response.data.requests || []);
        } catch (error) {
            console.error('Error loading requests:', error);
            alert('Error loading requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm('Approve this request?')) return;
        
        try {
            await api.updateRequestStatus(requestId, {
                status: 'approved',
                comment: managerComment || 'Approved'
            });
            alert('Request approved!');
            loadRequests();
            setManagerComment('');
        } catch (error) {
            alert('Error approving request');
        }
    };

    const handleDeny = async (requestId) => {
        const comment = prompt('Enter reason for denial:');
        if (comment === null) return;
        
        try {
            await api.updateRequestStatus(requestId, {
                status: 'denied',
                comment: comment
            });
            alert('Request denied!');
            loadRequests();
        } catch (error) {
            alert('Error denying request');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return '#28a745';
            case 'denied': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6c757d';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Manager Dashboard</h1>
                <p>Welcome, {user.name}! You can approve or deny requests.</p>
            </div>

            {loading ? (
                <div style={styles.loading}>Loading requests...</div>
            ) : (
                <div style={styles.requestsContainer}>
                    <h2>All Requests ({requests.length})</h2>
                    
                    {requests.length === 0 ? (
                        <p style={styles.noRequests}>No requests found.</p>
                    ) : (
                        <div style={styles.requestsList}>
                            {requests.map(request => (
                                <div key={request.id} style={styles.requestCard}>
                                    <div style={styles.requestHeader}>
                                        <div>
                                            <strong>Request #{request.id}</strong>
                                            <div style={styles.userInfo}>
                                                From: {request.requester_name} ({request.requester_role})
                                            </div>
                                            <div style={styles.date}>
                                                {new Date(request.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: getStatusColor(request.status)
                                        }}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div style={styles.requestDetails}>
                                        {request.trip_name && (
                                            <p><strong>Trip:</strong> {request.trip_name}</p>
                                        )}
                                        {request.general_comment && (
                                            <p><strong>Comment:</strong> {request.general_comment}</p>
                                        )}
                                        
                                        {request.manager_comment && (
                                            <p style={styles.managerNote}>
                                                <strong>Your Note:</strong> {request.manager_comment}
                                            </p>
                                        )}
                                    </div>

                                    <div style={styles.actions}>
                                        {request.status === 'pending' && (
                                            <>
                                                <textarea
                                                    placeholder="Add a comment (optional)..."
                                                    value={managerComment}
                                                    onChange={(e) => setManagerComment(e.target.value)}
                                                    style={styles.commentInput}
                                                    rows="2"
                                                />
                                                <div style={styles.buttons}>
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        style={styles.approveBtn}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeny(request.id)}
                                                        style={styles.denyBtn}
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #1a5f7a'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666'
    },
    requestsContainer: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    noRequests: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '18px'
    },
    requestsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    requestCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9'
    },
    requestHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
    },
    userInfo: {
        fontSize: '14px',
        color: '#666',
        marginTop: '5px'
    },
    date: {
        fontSize: '12px',
        color: '#999',
        marginTop: '2px'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    requestDetails: {
        marginBottom: '20px',
        lineHeight: '1.6'
    },
    managerNote: {
        backgroundColor: '#fff3cd',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px',
        borderLeft: '4px solid #ffc107'
    },
    actions: {
        marginTop: '15px'
    },
    commentInput: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        resize: 'vertical'
    },
    buttons: {
        display: 'flex',
        gap: '10px'
    },
    approveBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    denyBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default ManagerView;
