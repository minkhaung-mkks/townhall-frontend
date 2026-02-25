import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { commentAPI, adminAPI } from '../api';

function AdminComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [pagination.page]);

    const fetchComments = async () => {
        setLoading(true);
        const result = await commentAPI.getByWork('', pagination.page, pagination.limit);
        if (result.data) {
            setComments(result.data.comments);
            setPagination(prev => ({
                ...prev,
                total: result.data.pagination?.total || 0,
                totalPages: result.data.pagination?.totalPages || 1
            }));
        }
        setLoading(false);
    };

    const handleStatusChange = async (commentId, newStatus) => {
        const result = await adminAPI.updateComment(commentId, { status: newStatus });
        if (result.data) {
            setMessage('Comment status updated');
            fetchComments();
        } else {
            setError(result.error);
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const result = await adminAPI.deleteComment(commentId);
            if (result.data) {
                setMessage('Comment deleted successfully');
                fetchComments();
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/admin/users" style={{ marginRight: '15px' }}>Manage Users</Link>
                <Link to="/admin/works" style={{ marginRight: '15px' }}>Manage Works</Link>
                <Link to="/admin/comments" style={{ marginRight: '15px', fontWeight: 'bold' }}>Manage Comments</Link>
                <Link to="/admin/categories">Manage Categories</Link>
            </div>

            <h1 style={{ marginBottom: '20px' }}>Admin - Comment Management</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div className="loading">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No comments found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Comment</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>User</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Work</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map(comment => (
                                <tr key={comment._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                                        {truncateText(comment.body)}
                                    </td>
                                    <td style={{ padding: '12px' }}>{comment.username || comment.userId}</td>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/work/${comment.workId}`} style={{ color: '#007bff' }}>
                                            {comment.workId}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={comment.status || 'visible'}
                                            onChange={(e) => handleStatusChange(comment._id, e.target.value)}
                                            style={{
                                                padding: '5px',
                                                borderRadius: '3px',
                                                border: '1px solid #ddd',
                                                background: comment.status === 'hidden' ? '#f8d7da' : '#d4edda'
                                            }}
                                        >
                                            <option value="visible">visible</option>
                                            <option value="hidden">hidden</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px' }}>{formatDate(comment.createdAt)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                            onClick={() => handleDelete(comment._id)}
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
                    <span style={{ padding: '10px' }}>
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

export default AdminComments;