import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, adminAPI } from '../api';
import theme from '../theme';

const adminNavStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: theme.colors.ink,
    padding: '6px 0',
    borderBottom: `1px solid transparent`,
};
const adminNavActiveStyle = {
    ...adminNavStyle,
    fontWeight: 'bold',
    borderBottom: `2px solid ${theme.colors.burgundy}`,
};

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [pagination.page]);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await userAPI.getAll(pagination.page, pagination.limit);
        if (result.data) {
            setUsers(result.data.users);
            setPagination(prev => ({
                ...prev,
                total: result.data.pagination.total,
                totalPages: result.data.pagination.totalPages
            }));
        }
        setLoading(false);
    };

    const handleStatusChange = async (userId, newStatus) => {
        const result = await adminAPI.updateUser(userId, { status: newStatus });
        if (result.data) {
            setMessage('User status updated');
            fetchUsers();
        } else {
            setError(result.error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        const result = await adminAPI.updateUser(userId, { role: newRole });
        if (result.data) {
            setMessage('User role updated');
            fetchUsers();
        } else {
            setError(result.error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their works, drafts, and comments.')) {
            const result = await adminAPI.deleteUser(userId);
            if (result.data) {
                setMessage('User deleted successfully');
                fetchUsers();
            } else {
                setError(result.error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const selectStyle = {
        padding: '5px',
        borderRadius: '2px',
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.cardBg,
        fontFamily: theme.fonts.body,
        fontSize: '12px',
        color: theme.colors.ink,
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <Link to="/admin/users" style={adminNavActiveStyle}>Manage Users</Link>
                <Link to="/admin/works" style={adminNavStyle}>Manage Works</Link>
                <Link to="/admin/comments" style={adminNavStyle}>Manage Comments</Link>
                <Link to="/admin/categories" style={adminNavStyle}>Manage Categories</Link>
            </div>

            <h1 style={{ marginBottom: '20px', fontFamily: theme.fonts.heading }}>Admin - User Management</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: theme.colors.hoverBg }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Username</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Joined</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                                    <td style={{ padding: '12px' }}>
                                        <strong>{user.username}</strong>
                                        {user.firstname && (
                                            <span style={{ color: theme.colors.muted, marginLeft: '5px' }}>
                                                ({user.firstname} {user.lastname})
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{user.email}</td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={selectStyle}
                                        >
                                            <option value="creator">creator</option>
                                            <option value="editor">editor</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={user.status}
                                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                            style={{
                                                ...selectStyle,
                                                background: user.status === 'active' ? theme.toast.success.bg :
                                                           user.status === 'suspended' ? theme.toast.warning.bg : theme.toast.error.bg
                                            }}
                                        >
                                            <option value="active">active</option>
                                            <option value="suspended">suspended</option>
                                            <option value="banned">banned</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{formatDate(user.createdAt)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button
                        className="btn btn-secondary"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '10px', color: theme.colors.secondary }}>
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
