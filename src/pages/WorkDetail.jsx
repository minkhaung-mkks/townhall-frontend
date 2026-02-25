import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workAPI, commentAPI, reviewAPI } from '../api';
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
    const [reviews, setReviews] = useState([]);
    const [reviewFeedback, setReviewFeedback] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

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

    const fetchReviews = async () => {
        const result = await reviewAPI.getAll(id);
        if (result.data) {
            setReviews(result.data.reviews);
        }
    };

    useEffect(() => {
        fetchWork();
        fetchComments();
    }, [id]);

    useEffect(() => {
        if (user && (user.role === 'editor' || user.role === 'admin')) {
            fetchReviews();
        }
    }, [id, user]);

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

    const handleReview = async (decision) => {
        setReviewError('');
        setReviewSubmitting(true);
        const result = await reviewAPI.create({
            workId: id,
            decision,
            feedback: reviewFeedback
        });
        if (result.data) {
            setReviewFeedback('');
            fetchWork();
            fetchReviews();
        } else {
            setReviewError(result.error || 'Failed to submit review');
        }
        setReviewSubmitting(false);
    };

    const isOwner = user && (user._id || user.id) === work.authorId;
    const isAdmin = user && user.role === 'admin';
    const isEditor = user && (user.role === 'editor' || user.role === 'admin');
    const canReview = isEditor && work.status === 'submitted';

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

                {isEditor && work.status !== 'published' && (
                    <div style={{
                        marginTop: '20px',
                        padding: '10px 16px',
                        background: work.status === 'approved' ? '#d4edda' : work.status === 'rejected' ? '#f8d7da' : work.status === 'submitted' ? '#fff3cd' : '#e2e3e5',
                        border: `1px solid ${work.status === 'approved' ? '#c3e6cb' : work.status === 'rejected' ? '#f5c6cb' : work.status === 'submitted' ? '#ffc107' : '#d6d8db'}`,
                        borderRadius: '6px',
                        fontSize: '14px'
                    }}>
                        <strong>Status:</strong>{' '}
                        <span style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white',
                            background: work.status === 'approved' ? '#28a745' : work.status === 'rejected' ? '#dc3545' : work.status === 'submitted' ? '#ffc107' : '#6c757d'
                        }}>
                            {work.status}
                        </span>
                    </div>
                )}

                {isEditor && reviews.length > 0 && (
                    <div style={{
                        marginTop: '15px',
                        padding: '20px',
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ marginBottom: '15px' }}>Review History</h3>
                        {reviews.map(review => (
                            <div key={review._id} style={{
                                padding: '12px',
                                borderBottom: '1px solid #eee',
                                marginBottom: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '3px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        background: review.decision === 'approved' ? '#28a745' : '#dc3545'
                                    }}>
                                        {review.decision}
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#333' }}>
                                        by <strong>{review.editor ? `${review.editor.firstname} ${review.editor.lastname} (@${review.editor.username})` : review.editorId}</strong>
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                                {review.feedback && (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                                        {review.feedback}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {canReview && (
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ marginBottom: '15px' }}>Review This Work</h3>
                        <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                            This work is awaiting review. Approve or reject it below.
                        </p>
                        <textarea
                            value={reviewFeedback}
                            onChange={(e) => setReviewFeedback(e.target.value)}
                            placeholder="Add feedback for the author (optional)..."
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                marginBottom: '10px'
                            }}
                        />
                        {reviewError && <p className="error-message">{reviewError}</p>}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-success"
                                onClick={() => handleReview('approved')}
                                disabled={reviewSubmitting}
                            >
                                Approve
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleReview('rejected')}
                                disabled={reviewSubmitting}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )}

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