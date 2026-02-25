import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const linkStyle = {
        color: theme.colors.ink,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontFamily: theme.fonts.body,
    };

    return (
        <nav style={{
            background: theme.colors.pageBg,
            padding: '18px 20px',
            marginBottom: '20px',
            borderTop: `2px solid ${theme.colors.ink}`,
            borderBottom: `3px double ${theme.colors.ink}`,
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    color: theme.colors.ink,
                    fontSize: '26px',
                    fontWeight: 900,
                    fontFamily: theme.fonts.heading,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                }}>
                    Town Hall Board
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={linkStyle}>Home</Link>

                    {!user ? (
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/register" style={linkStyle}>Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" style={linkStyle}>Profile</Link>
                            <Link to="/my-works" style={linkStyle}>My Works</Link>

                            {(user.role === 'editor' || user.role === 'admin') && (
                                <Link to="/editor-dashboard" style={linkStyle}>Editor</Link>
                            )}

                            {user.role === 'admin' && (
                                <Link to="/admin/users" style={linkStyle}>Admin</Link>
                            )}

                            <span style={{
                                color: theme.colors.muted,
                                fontSize: '16px',
                                fontFamily: theme.fonts.accent,
                            }}>
                                Hi, {user.username} ({user.role})
                            </span>

                            <button
                                onClick={handleLogout}
                                style={{
                                    background: theme.colors.rust,
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontFamily: theme.fonts.body,
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
