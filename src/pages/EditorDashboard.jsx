import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, reviewAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

const STATUS_TABS = [
    { key: 'submitted', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'draft', label: 'Draft' },
    { key: 'published', label: 'Published' },
];

function EditorDashboard() {
    const [reviewHistory, setReviewHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('submitted');
    const [works, setWorks] = useState([]);
    const [worksLoading, setWorksLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        fetchReviewHistory();
    }, []);

    useEffect(() => {
        fetchWorksByStatus();
    }, [activeTab]);

    const fetchWorksByStatus = async () => {
        setWorksLoading(true);
        const result = await workAPI.getAll({ status: activeTab, limit: 50 });
        if (result.data) {
            setWorks(result.data.works);
        }
        setWorksLoading(false);
    };

    const fetchReviewHistory = async () => {
        const result = await reviewAPI.getAll();
        if (result.data) {
            setReviewHistory(result.data.reviews);
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

    const statusColor = (status) => theme.status[status] || theme.colors.muted;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '30px', fontFamily: theme.fonts.heading }}>Editor Dashboard</h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h2 style={{ marginBottom: '20px', fontFamily: theme.fonts.heading }}>All Works</h2>

                <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: `2px solid ${theme.colors.border}` }}>
                    {STATUS_TABS.filter(tab => tab.key !== 'draft' || user?.role === 'admin').map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                                color: activeTab === tab.key ? statusColor(tab.key) : theme.colors.muted,
                                borderBottom: activeTab === tab.key ? `3px solid ${statusColor(tab.key)}` : '3px solid transparent',
                                marginBottom: '-2px',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontFamily: theme.fonts.body,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {worksLoading ? (
                    <div className="loading">Loading...</div>
                ) : works.length === 0 ? (
                    <p style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                        No {STATUS_TABS.find(t => t.key === activeTab)?.label.toLowerCase()} works.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: theme.colors.hoverBg }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Author</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map(work => (
                                <tr key={work._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/work/${work._id}`} style={{ color: theme.colors.burgundy, fontWeight: '500' }}>
                                            {work.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{work.author ? `${work.author.firstname} ${work.author.lastname}` : work.authorId}</td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{formatDate(work.submittedAt || work.createdAt)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <Link
                                            to={`/work/${work._id}`}
                                            className="btn btn-primary"
                                            style={{ fontSize: '12px', padding: '6px 12px', textDecoration: 'none' }}
                                        >
                                            {activeTab === 'submitted' ? 'Review' : 'View'}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '20px', fontFamily: theme.fonts.heading }}>My Review History</h2>

                {reviewHistory.length === 0 ? (
                    <p style={{ textAlign: 'center', color: theme.colors.muted, padding: '20px' }}>
                        No reviews yet.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: theme.colors.hoverBg }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Work</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Decision</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Feedback</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewHistory.map(review => (
                                <tr key={review._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/work/${review.workId}`} style={{ color: theme.colors.burgundy }}>
                                            {review.workId}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            background: review.decision === 'approved' ? theme.colors.forest : theme.colors.rust,
                                            color: 'white',
                                            padding: '3px 10px',
                                            borderRadius: '2px',
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                        }}>
                                            {review.decision}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            display: 'block',
                                            color: theme.colors.secondary,
                                        }}>
                                            {review.feedback || '-'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', color: theme.colors.secondary }}>{formatDate(review.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default EditorDashboard;
