import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav style={{
            background: '#333',
            padding: '15px 20px',
            marginBottom: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    Town Hall Board
                </Link>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'white' }}>Home</Link>
                    
                    {!user ? (
                        <>
                            <Link to="/login" style={{ color: 'white' }}>Login</Link>
                            <Link to="/register" style={{ color: 'white' }}>Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
                            <Link to="/my-works" style={{ color: 'white' }}>My Works</Link>
                            
                            {(user.role === 'editor' || user.role === 'admin') && (
                                <Link to="/editor-dashboard" style={{ color: 'white' }}>Editor Dashboard</Link>
                            )}
                            
                            {user.role === 'admin' && (
                                <Link to="/admin/users" style={{ color: 'white' }}>Admin</Link>
                            )}
                            
                            <span style={{ color: '#aaa', fontSize: '14px' }}>
                                Hi, {user.username} ({user.role})
                            </span>
                            
                            <button 
                                onClick={handleLogout}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
