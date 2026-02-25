import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workAPI } from '../api';
import { useAuth } from '../context/AuthContext';

function MyWorks() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { user } = useAuth();

    const fetchWorks = async () => {
        setLoading(true);
        const params = { authorId: user._id || user.id, limit: 50 };
        if (filter) {
            params.status = filter;
        }
        
        const result = await workAPI.getAll(params);
        if (result.data) {
            setWorks(result.data.works);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWorks();
    }, [filter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this work?')) {
            const result = await workAPI.delete(id);
            if (result.data) {
                setWorks(works.filter(w => w._id !== id));
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

    const getStatusBadge = (status) => {
        const colors = {
            draft: '#6c757d',
            submitted: '#ffc107',
            approved: '#28a745',
            rejected: '#dc3545',
            published: '#007bff',
            hidden: '#333'
        };
        return (
            <span style={{
                background: colors[status] || '#6c757d',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '3px',
                fontSize: '12px'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>My Works</h1>
                <Link to="/create-work" className="btn btn-primary">+ Create New Work</Link>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="published">Published</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : works.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>You haven't created any works yet.</p>
                    <Link to="/create-work" className="btn btn-primary" style={{ marginTop: '15px' }}>
                        Create Your First Work
                    </Link>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Created</th>
                                <th style={{ textAlign: 'left', padding: '15px' }}>Updated</th>
                                <th style={{ textAlign: 'right', padding: '15px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map(work => (
                                <tr key={work._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>
                                        <Link to={`/work/${work._id}`} style={{ color: '#333', fontWeight: '500' }}>
                                            {work.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '15px' }}>{getStatusBadge(work.status)}</td>
                                    <td style={{ padding: '15px' }}>{formatDate(work.createdAt)}</td>
                                    <td style={{ padding: '15px' }}>{formatDate(work.updatedAt)}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <Link 
                                            to={`/edit-work/${work._id}`}
                                            className="btn btn-secondary"
                                            style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px' }}
                                        >
                                            Edit
                                        </Link>
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
                </div>
            )}
        </div>
    );
}

export default MyWorks;