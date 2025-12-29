import React, { useState } from 'react';
import api from '../services/api';

function Login({ setUser }) {
    const [username, setUsername] = useState('mohamed');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.login({ username, password });
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const testUsers = [
        { username: 'mohamed', password: 'password', role: 'steward', name: 'Mohamed' },
        { username: 'ahmed', password: 'password', role: 'chef', name: 'Ahmed' },
        { username: 'ali', password: 'password', role: 'captain', name: 'Ali' },
        { username: 'manager1', password: 'password', role: 'manager', name: 'Manager' },
        { username: 'omar', password: 'password', role: 'owner', name: 'Omar' },
        { username: 'youssef', password: 'password', role: 'mechanic', name: 'Youssef' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>⛵ Boat Supply System</h1>
                <h2 style={styles.subtitle}>Login</h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div style={styles.testSection}>
                    <h3 style={styles.testTitle}>Quick Test Logins:</h3>
                    <div style={styles.testButtons}>
                        {testUsers.map((user, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    setUsername(user.username);
                                    setPassword(user.password);
                                }}
                                style={styles.testButton}
                            >
                                {user.name} ({user.role})
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        width: '100%',
        maxWidth: '500px'
    },
    title: {
        color: '#1a5f7a',
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '28px'
    },
    subtitle: {
        color: '#555',
        textAlign: 'center',
        marginBottom: '30px',
        fontWeight: 'normal'
    },
    form: {
        marginBottom: '30px'
    },
    input: {
        width: '100%',
        padding: '15px',
        marginBottom: '15px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#1a5f7a',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    error: {
        backgroundColor: '#ffeaea',
        color: '#d63031',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    testSection: {
        borderTop: '1px solid #eee',
        paddingTop: '20px'
    },
    testTitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px',
        textAlign: 'center'
    },
    testButtons: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
    },
    testButton: {
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer'
    }
};

export default Login;
