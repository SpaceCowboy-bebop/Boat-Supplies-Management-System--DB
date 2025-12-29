import React, { useState, useEffect } from 'react';
import RequestForm from './RequestForm';
import api from '../services/api';

function Dashboard({ user, onLogout }) {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new');

    useEffect(() => {
        if (activeTab === 'history') {
            loadMyRequests();
        }
    }, [activeTab]);

    const loadMyRequests = async () => {
        try {
            const response = await api.getMyRequests();
            setMyRequests(response.data.requests || []);
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    };

    const handleRequestSubmit = async (requestData) => {
        setLoading(true);
        try {
            const response = await api.submitRequest(requestData);
            if (response.data.success) {
                alert('Request submitted successfully!');
                setActiveTab('history');
                loadMyRequests();
            }
        } catch (error) {
            alert('Error submitting request: ' + (error.response?.data?.message || 'Server error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Welcome, {user.name}!</h1>
                <p>Role: <strong>{user.role.toUpperCase()}</strong></p>
            </div>

            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('new')}
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'new' ? styles.activeTab : {})
                    }}
                >
                    📝 New Request
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'history' ? styles.activeTab : {})
                    }}
                >
                    📋 My Requests
                </button>
            </div>

            <div style={styles.content}>
                {activeTab === 'new' ? (
                    <RequestForm 
                        user={user} 
                        onSubmit={handleRequestSubmit}
                        loading={loading}
                    />
                ) : (
                    <div style={styles.historySection}>
                        <h2>My Request History</h2>
                        {myRequests.length === 0 ? (
                            <p style={styles.noData}>No requests yet.</p>
                        ) : (
                            <div style={styles.requestsList}>
                                {myRequests.map(request => (
                                    <div key={request.id} style={styles.requestCard}>
                                        <div style={styles.requestHeader}>
                                            <span>Request #{request.id}</span>
                                            <span style={{
                                                ...styles.status,
                                                backgroundColor: 
                                                    request.status === 'approved' ? '#d4edda' :
                                                    request.status === 'denied' ? '#f8d7da' : '#fff3cd',
                                                color:
                                                    request.status === 'approved' ? '#155724' :
                                                    request.status === 'denied' ? '#721c24' : '#856404'
                                            }}>
                                                {request.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={styles.requestDetails}>
                                            <p><strong>Date:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                                            <p><strong>Comment:</strong> {request.general_comment || 'No comment'}</p>
                                            {request.manager_comment && (
                                                <p style={styles.managerComment}>
                                                    <strong>Manager Note:</strong> {request.manager_comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
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
    tabs: {
        display: 'flex',
        marginBottom: '30px',
        borderBottom: '1px solid #ddd'
    },
    tab: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '16px',
        borderBottom: '3px solid transparent'
    },
    activeTab: {
        borderBottom: '3px solid #1a5f7a',
        fontWeight: 'bold',
        color: '#1a5f7a'
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    historySection: {
        minHeight: '400px'
    },
    noData: {
        textAlign: 'center',
        color: '#666',
        fontSize: '18px',
        marginTop: '50px'
    },
    requestsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
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
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
    },
    status: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    requestDetails: {
        lineHeight: '1.6'
    },
    managerComment: {
        backgroundColor: '#fff3cd',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px',
        borderLeft: '4px solid #ffc107'
    }
};

export default Dashboard;
