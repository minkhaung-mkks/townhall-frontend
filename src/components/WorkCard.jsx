import { Link } from 'react-router-dom';
import theme from '../theme';

function WorkCard({ work }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <Link to={`/work/${work._id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                height: '100%',
                borderLeft: `4px solid ${theme.colors.burgundy}`,
            }}>
                <h3 style={{
                    marginBottom: '10px',
                    color: theme.colors.ink,
                    fontFamily: theme.fonts.heading,
                    fontSize: '18px',
                }}>
                    {work.title}
                </h3>

                <p style={{
                    color: theme.colors.secondary,
                    marginBottom: '15px',
                    lineHeight: '1.5'
                }}>
                    {truncateText(work.content)}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: theme.colors.muted,
                }}>
                    <span style={{ fontFamily: theme.fonts.accent, fontSize: '16px' }}>
                        By {work.author ? `${work.author.firstname} ${work.author.lastname}` : work.authorId}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {work.likeCount > 0 && (
                            <span style={{ color: theme.colors.rust, fontWeight: '500' }}>
                                {'\u2665'} {work.likeCount}
                            </span>
                        )}
                        <span>{formatDate(work.publishedAt || work.createdAt)}</span>
                    </div>
                </div>

                {work.tags && work.tags.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        {work.tags.map((tag, index) => (
                            <span
                                key={index}
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${theme.colors.border}`,
                                    padding: '3px 8px',
                                    borderRadius: '2px',
                                    fontSize: '12px',
                                    marginRight: '5px',
                                    color: theme.colors.muted,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default WorkCard;
