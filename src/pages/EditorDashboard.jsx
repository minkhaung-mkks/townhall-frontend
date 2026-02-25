import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI, reviewAPI } from '../api';
import { useAuth } from '../context/AuthContext';

function EditorDashboard() {
    const [submittedWorks, setSubmittedWorks] = useState([]);
    const [reviewHistory, setReviewHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        decision: 'approved',
        feedback: ''
    });
    const [error, setError] = useState('');
    
    const { user } = useAuth();

    useEffect(() => {
        fetchSubmittedWorks();
        fetchReviewHistory();
    }, []);

    const fetchSubmittedWorks = async () => {
        const result = await workAPI.getAll({ status: 'submitted', limit: 50 });
        if (result.data) {
            setSubmittedWorks(result.data.works);
        }
        setLoading(false);
    };

    const fetchReviewHistory = async () => {
        const result = await reviewAPI.getAll();
        if (result.data) {
            setReviewHistory(result.data.reviews);
        }
    };

    const openReviewModal = (work) => {
        setSelectedWork(work);
        setModalData({ decision: 'approved', feedback: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedWork(null);
        setModalData({ decision: 'approved', feedback: '' });
    };

    const handleSubmitReview = async () => {
        if (!selectedWork) return;
        setError('');

        const result = await reviewAPI.create({
            workId: selectedWork._id,
            decision: modalData.decision,
            feedback: modalData.feedback
        });

        if (result.data) {
            closeModal();
            fetchSubmittedWorks();
            fetchReviewHistory();
        } else {
            setError(result.error || 'Failed to submit review');
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

    return (
        <div className="container">
            <h1 style={{ marginBottom: '30px' }}>Editor Dashboard</h1>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>
                    Pending Reviews ({submittedWorks.length})
                </h2>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : submittedWorks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No works pending review.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Author</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Submitted</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submittedWorks.map(work => (
                                <tr key={work._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/work/${work._id}`} style={{ color: '#007bff', fontWeight: '500' }}>
                                            {work.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px' }}>{work.authorId}</td>
                                    <td style={{ padding: '12px' }}>{formatDate(work.submittedAt)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-success"
                                            style={{ fontSize: '12px', padding: '6px 12px', marginRight: '5px' }}
                                            onClick={() => openReviewModal(work)}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '20px' }}>My Review History</h2>

                {reviewHistory.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No reviews yet.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Work</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Decision</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Feedback</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewHistory.map(review => (
                                <tr key={review._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{review.workId}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            background: review.decision === 'approved' ? '#28a745' : '#dc3545',
                                            color: 'white',
                                            padding: '3px 10px',
                                            borderRadius: '3px',
                                            fontSize: '12px'
                                        }}>
                                            {review.decision}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            display: 'block'
                                        }}>
                                            {review.feedback || '-'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>{formatDate(review.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && selectedWork && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Review Work</h3>
                        
                        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                            <h4>{selectedWork.title}</h4>
                            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                By: {selectedWork.authorId}
                            </p>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="form-group">
                            <label>Decision</label>
                            <select
                                value={modalData.decision}
                                onChange={(e) => setModalData({ ...modalData, decision: e.target.value })}
                                style={{ width: '100%', padding: '10px' }}
                            >
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Feedback (optional)</label>
                            <textarea
                                value={modalData.feedback}
                                onChange={(e) => setModalData({ ...modalData, feedback: e.target.value })}
                                placeholder="Add feedback for the author..."
                                style={{ width: '100%', minHeight: '100px', padding: '10px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button 
                                className={`btn ${modalData.decision === 'approved' ? 'btn-success' : 'btn-danger'}`}
                                onClick={handleSubmitReview}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditorDashboard;