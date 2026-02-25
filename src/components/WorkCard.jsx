import { Link } from 'react-router-dom';

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
                height: '100%'
            }}>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>
                    {work.title}
                </h3>
                
                <p style={{ 
                    color: '#666', 
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
                    color: '#888'
                }}>
                    <span>By {work.authorId}</span>
                    <span>{formatDate(work.publishedAt || work.createdAt)}</span>
                </div>
                
                {work.tags && work.tags.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        {work.tags.map((tag, index) => (
                            <span
                                key={index}
                                style={{
                                    background: '#e9ecef',
                                    padding: '3px 8px',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                    marginRight: '5px'
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