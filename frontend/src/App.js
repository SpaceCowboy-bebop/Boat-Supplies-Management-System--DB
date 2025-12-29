import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ManagerView from './components/ManagerView';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (!user) {
        return <Login setUser={setUser} />;
    }

    // Render based on role
    const renderContent = () => {
        if (user.role === 'manager' || user.role === 'owner') {
            return <ManagerView user={user} onLogout={handleLogout} />;
        } else {
            return <Dashboard user={user} onLogout={handleLogout} />;
        }
    };

    return (
        <div className="App">
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <h2 style={styles.logo}>⛵ Boat Supply</h2>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.userInfo}>
                        👤 {user.name} <strong>({user.role})</strong>
                    </span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>
            {renderContent()}
        </div>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#1a5f7a',
        color: 'white',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    logo: {
        margin: 0,
        fontSize: '22px'
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userInfo: {
        fontSize: '14px'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '6px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    }
};

export default App;
