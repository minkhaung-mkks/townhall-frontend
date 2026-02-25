import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../api';
import theme from '../theme';

function CommentCard({ comment, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.body);
    const [error, setError] = useState('');

    const { user } = useAuth();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUpdate = async () => {
        if (!editBody.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        const result = await commentAPI.update(comment._id, { body: editBody });
        if (result.data) {
            setEditing(false);
            window.location.reload();
        } else {
            setError(result.error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const result = await commentAPI.delete(comment._id);
            if (result.data) {
                onDelete(comment._id);
            }
        }
    };

    const isOwner = user && (user._id || user.id) === comment.userId;
    const isAdmin = user && user.role === 'admin';

    if (comment.status === 'hidden' && !isAdmin) {
        return (
            <div className="comment-card" style={{ opacity: 0.5 }}>
                <p style={{ fontStyle: 'italic', color: theme.colors.muted }}>
                    This comment has been hidden.
                </p>
            </div>
        );
    }

    return (
        <div className="comment-card">
            <div className="comment-card-header">
                <span className="comment-card-author">{comment.username || 'Unknown User'}</span>
                <span className="comment-card-date">{formatDate(comment.createdAt)}</span>
            </div>

            {editing ? (
                <div>
                    <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: '2px',
                            background: theme.colors.cardBg,
                            fontFamily: theme.fonts.body,
                        }}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <div style={{ marginTop: '10px' }}>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Save
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setEditing(false)}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="comment-card-body">{comment.body}</p>

                    {(isOwner || isAdmin) && (
                        <div className="comment-card-actions">
                            {isOwner && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditing(true)}
                                    style={{ fontSize: '12px', padding: '5px 10px' }}
                                >
                                    Edit
                                </button>
                            )}
                            {(isOwner || isAdmin) && (
                                <button
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    style={{ fontSize: '12px', padding: '5px 10px' }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CommentCard;
