import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workAPI, commentAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import CommentCard from '../components/CommentCard';

function WorkDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [work, setWork] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [commentError, setCommentError] = useState('');

    const fetchWork = async () => {
        const result = await workAPI.getById(id);
        if (result.data) {
            setWork(result.data);
        } else {
            console.log('Error:', result.error);
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        const result = await commentAPI.getByWork(id);
        if (result.data) {
            setComments(result.data.comments);
        }
    };

    useEffect(() => {
        fetchWork();
        fetchComments();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        setCommentError('');

        if (!user) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) {
            setCommentError('Comment cannot be empty');
            return;
        }

        const result = await commentAPI.create({
            workId: id,
            body: newComment
        });

        if (result.data) {
            setNewComment('');
            fetchComments();
        } else {
            setCommentError(result.error);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(c => c._id !== commentId));
    };

    const handleDeleteWork = async () => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            const result = await workAPI.delete(id);
            if (result.data) {
                navigate('/');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!work) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2>Work not found</h2>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = user && (user._id || user.id) === work.authorId;
    const isAdmin = user && user.role === 'admin';

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card">
                <h1 style={{ marginBottom: '10px' }}>{work.title}</h1>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    marginBottom: '20px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    <span>By: {work.authorId}</span>
                    <span>Published: {formatDate(work.publishedAt || work.createdAt)}</span>
                    {work.categoryId && (
                        <span>Category: {work.categoryId}</span>
                    )}
                </div>

                {work.tags && work.tags.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        {work.tags.map((tag, index) => (
                            <span
                                key={index}
                                style={{
                                    background: '#007bff',
                                    color: 'white',
                                    padding: '3px 10px',
                                    borderRadius: '15px',
                                    fontSize: '12px',
                                    marginRight: '5px'
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div style={{ 
                    lineHeight: '1.8', 
                    fontSize: '16px',
                    whiteSpace: 'pre-wrap'
                }}>
                    {work.content}
                </div>

                {(isOwner || isAdmin) && (
                    <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                        {isOwner && (
                            <>
                                <Link to={`/edit-work/${id}`} className="btn btn-primary">
                                    Edit Work
                                </Link>
                                <button className="btn btn-danger" onClick={handleDeleteWork}>
                                    Delete Work
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>Comments ({comments.length})</h2>

                {user ? (
                    <div className="card">
                        <h4 style={{ marginBottom: '15px' }}>Add a Comment</h4>
                        <form onSubmit={handleAddComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment here..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    marginBottom: '10px'
                                }}
                            />
                            {commentError && <p className="error-message">{commentError}</p>}
                            <button type="submit" className="btn btn-primary">
                                Post Comment
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p>
                            <Link to="/login" style={{ color: '#007bff' }}>Login</Link> to leave a comment.
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '20px' }}>
                    {comments.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map(comment => (
                            <CommentCard 
                                key={comment._id} 
                                comment={comment}
                                onDelete={handleDeleteComment}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default WorkDetail;