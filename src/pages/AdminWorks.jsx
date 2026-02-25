import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, adminAPI } from '../api';
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

function AdminWorks() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWorks();
    }, [pagination.page, filter]);

    const fetchWorks = async () => {
        setLoading(true);
        const params = {
            page: pagination.page,
            limit: pagination.limit
        };
        if (filter) {
            params.status = filter;
        }

        const result = await workAPI.getAll(params);
        if (result.data) {
            setWorks(result.data.works);
            setPagination(prev => ({
                ...prev,
                total: result.data.pagination.total,
                totalPages: result.data.pagination.totalPages
            }));
        }
        setLoading(false);
    };

    const handleStatusChange = async (workId, newStatus) => {
        const result = await adminAPI.updateWork(workId, { status: newStatus });
        if (result.data) {
            setMessage('Work status updated');
            fetchWorks();
        } else {
            setError(result.error);
        }
    };

    const handleDelete = async (workId) => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            const result = await adminAPI.deleteWork(workId);
            if (result.data) {
                setMessage('Work deleted successfully');
                fetchWorks();
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

    const getStatusBadge = (status) => (
        <span style={{
            background: theme.status[status] || theme.colors.muted,
            color: 'white',
            padding: '3px 10px',
            borderRadius: '2px',
            fontSize: '12px',
            textTransform: 'uppercase',
        }}>
            {status}
        </span>
    );

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
                <Link to="/admin/users" style={adminNavStyle}>Manage Users</Link>
                <Link to="/admin/works" style={adminNavActiveStyle}>Manage Works</Link>
                <Link to="/admin/comments" style={adminNavStyle}>Manage Comments</Link>
                <Link to="/admin/categories" style={adminNavStyle}>Manage Categories</Link>
            </div>

            <h1 style={{ marginBottom: '20px', fontFamily: theme.fonts.heading }}>Admin - Work Management</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div style={{ marginBottom: '20px' }}>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '2px',
                        border: `1px solid ${theme.colors.border}`,
                        background: theme.colors.cardBg,
                        fontFamily: theme.fonts.body,
                        color: theme.colors.ink,
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div className="loading">Loading works...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: theme.colors.hoverBg }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Author</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Created</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map(work => (
                                <tr key={work._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/work/${work._id}`} style={{ color: theme.colors.burgundy }}>
                                            {work.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{work.author ? `${work.author.firstname} ${work.author.lastname}` : work.authorId}</td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={work.status}
                                            onChange={(e) => handleStatusChange(work._id, e.target.value)}
                                            style={selectStyle}
                                        >
                                            <option value="draft">draft</option>
                                            <option value="submitted">submitted</option>
                                            <option value="approved">approved</option>
                                            <option value="rejected">rejected</option>
                                            <option value="published">published</option>
                                            <option value="hidden">hidden</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{formatDate(work.createdAt)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                            onClick={() => handleDelete(work._id)}
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

export default AdminWorks;
