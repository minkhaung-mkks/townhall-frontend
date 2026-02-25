import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { workAPI, commentAPI, reviewAPI, likeAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import CommentCard from '../components/CommentCard';
import theme from '../theme';

const calculateReadingTime = (text) => {
    if (!text) return 0;
    return Math.ceil(text.trim().split(/\s+/).length / 200);
};

const markdownComponents = {
    a: ({ href, children, ...props }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    ),
    img: ({ src, alt, ...props }) => (
        <img src={src} alt={alt} loading="lazy" {...props} />
    ),
};

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
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [linkCopied, setLinkCopied] = useState(false);

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

    const fetchLikeStatus = async () => {
        const result = await likeAPI.getForWork(id);
        if (result.data) {
            setLikeCount(result.data.likeCount);
            setLiked(result.data.liked);
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const result = await likeAPI.toggle(id);
        if (result.data) {
            setLiked(result.data.liked);
            setLikeCount(result.data.likeCount);
        }
    };

    useEffect(() => {
        fetchWork();
        fetchComments();
        fetchLikeStatus();
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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!work) {
        return (
            <div className="container article-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
                <h2 style={{ fontFamily: theme.fonts.heading, marginBottom: '20px' }}>Work not found</h2>
                <Link to="/" className="btn btn-primary">
                    Go Back Home
                </Link>
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
    const canPublish = isEditor && work.status === 'approved';
    const readingTime = calculateReadingTime(work.content);

    const statusBannerBg = {
        approved: theme.toast.success.bg,
        rejected: theme.toast.error.bg,
        submitted: theme.toast.warning.bg,
    };
    const statusBannerBorder = {
        approved: theme.colors.forest,
        rejected: theme.colors.rust,
        submitted: theme.colors.gold,
    };

    return (
        <div className="container article-container">

            <Link to="/" className="article-back-link">
                &larr; Back to all articles
            </Link>

            <header className="article-header">
                {work.categoryId && (
                    <span className="article-category-label">
                        {work.categoryId}
                    </span>
                )}

                <h1 className="article-title">{work.title}</h1>

                <div className="article-meta">
                    <span className="article-byline">
                        By {work.author
                            ? `${work.author.firstname} ${work.author.lastname}`
                            : work.authorId}
                    </span>
                    <span className="article-meta-separator" />
                    <time className="article-date">
                        {formatDate(work.publishedAt || work.createdAt)}
                    </time>
                    <span className="article-meta-separator" />
                    <span className="article-reading-time">
                        {readingTime} min read
                    </span>
                </div>

                {work.tags && work.tags.length > 0 && (
                    <div className="article-tags">
                        {work.tags.map((tag, index) => (
                            <span key={index} className="article-tag">{tag}</span>
                        ))}
                    </div>
                )}
            </header>

            <hr className="divider-ornament" />

            <article className="article-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                >
                    {work.content}
                </ReactMarkdown>
            </article>

            <div className="article-actions-bar">
                <button
                    className={`article-like-btn${liked ? ' liked' : ''}`}
                    onClick={handleToggleLike}
                >
                    {liked ? '\u2665' : '\u2661'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                </button>

                <div className="article-owner-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleCopyLink}
                        style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                        {linkCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                    {isOwner && (
                        <>
                            <Link to={`/edit-work/${id}`} className="btn btn-primary">
                                Edit
                            </Link>
                            <button className="btn btn-danger" onClick={handleDeleteWork}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditor && work.status !== 'published' && (
                <div className="editor-panel" style={{
                    background: statusBannerBg[work.status] || theme.colors.hoverBg,
                    borderColor: statusBannerBorder[work.status] || theme.colors.border,
                }}>
                    <strong>Status:</strong>{' '}
                    <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '2px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: theme.status[work.status] || theme.colors.muted,
                    }}>
                        {work.status}
                    </span>
                </div>
            )}

            {isEditor && reviews.length > 0 && (
                <div className="editor-panel" style={{ background: theme.colors.hoverBg }}>
                    <h3>Review History</h3>
                    {reviews.map(review => (
                        <div key={review._id} className="review-history-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <span style={{
                                    padding: '2px 10px',
                                    borderRadius: '2px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    background: review.decision === 'approved' ? theme.colors.forest : theme.colors.rust,
                                }}>
                                    {review.decision}
                                </span>
                                <span style={{ fontSize: '14px', color: theme.colors.ink }}>
                                    by <strong>{review.editor ? `${review.editor.firstname} ${review.editor.lastname} (@${review.editor.username})` : review.editorId}</strong>
                                </span>
                                <span style={{ fontSize: '12px', color: theme.colors.muted }}>
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>
                            {review.feedback && (
                                <p style={{ margin: 0, fontSize: '14px', color: theme.colors.secondary }}>
                                    {review.feedback}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {canReview && (
                <div className="editor-panel" style={{
                    background: theme.toast.warning.bg,
                    borderColor: theme.colors.gold,
                }}>
                    <h3>Review This Work</h3>
                    <p style={{ marginBottom: '15px', color: theme.colors.secondary, fontSize: '14px' }}>
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
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: '2px',
                            marginBottom: '10px',
                            background: theme.colors.cardBg,
                            fontFamily: theme.fonts.body,
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

            {canPublish && (
                <div className="editor-panel" style={{
                    background: theme.toast.success.bg,
                    borderColor: theme.colors.forest,
                }}>
                    <h3>Ready to Publish</h3>
                    <p style={{ marginBottom: '15px', color: theme.colors.secondary, fontSize: '14px' }}>
                        This work has been approved and can now be published.
                    </p>
                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            const result = await workAPI.update(id, { status: 'published' });
                            if (result.data) {
                                fetchWork();
                            }
                        }}
                    >
                        Publish Now
                    </button>
                </div>
            )}

            <hr className="divider-ornament" />

            <section className="article-comments-section">
                <h2 className="article-comments-heading">
                    Discussion ({comments.length})
                </h2>

                {user ? (
                    <div className="comment-form-card">
                        <h4 style={{ marginBottom: '15px', fontFamily: theme.fonts.heading }}>
                            Join the conversation
                        </h4>
                        <form onSubmit={handleAddComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment here..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '10px',
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '2px',
                                    marginBottom: '10px',
                                    background: theme.colors.pageBg,
                                    fontFamily: theme.fonts.body,
                                }}
                            />
                            {commentError && <p className="error-message">{commentError}</p>}
                            <button type="submit" className="btn btn-primary">
                                Post Comment
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="comment-form-card" style={{ textAlign: 'center' }}>
                        <p>
                            <Link to="/login" style={{ color: theme.colors.burgundy, textDecoration: 'underline' }}>
                                Sign in
                            </Link>{' '}
                            to join the discussion.
                        </p>
                    </div>
                )}

                <div className="article-comments-list">
                    {comments.length === 0 ? (
                        <p style={{ textAlign: 'center', color: theme.colors.muted, padding: '30px 0' }}>
                            No comments yet. Be the first to share your thoughts.
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
            </section>
        </div>
    );
}

export default WorkDetail;
