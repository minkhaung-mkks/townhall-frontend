import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workAPI, categoryAPI, draftAPI } from '../api';
import { useAuth } from '../context/AuthContext';

function EditWork() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [work, setWork] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        tags: ''
    });
    const [categories, setCategories] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWork();
        fetchCategories();
        fetchDrafts();
    }, [id]);

    const fetchWork = async () => {
        const result = await workAPI.getById(id);
        if (result.data) {
            setWork(result.data);
            setFormData({
                title: result.data.title,
                content: result.data.content,
                categoryId: result.data.categoryId || '',
                tags: result.data.tags ? result.data.tags.join(', ') : ''
            });
        } else {
            setError('Work not found');
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        const result = await categoryAPI.getAll();
        if (result.data) {
            setCategories(result.data.categories);
        }
    };

    const fetchDrafts = async () => {
        const result = await draftAPI.getAll(id);
        if (result.data) {
            setDrafts(result.data.drafts);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const data = {
            title: formData.title,
            content: formData.content,
            categoryId: formData.categoryId || null,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
        };

        const result = await workAPI.update(id, data);
        
        if (result.data) {
            setMessage('Work updated successfully!');
            fetchWork();
        } else {
            setError(result.error);
        }
    };

    const handleSubmitForReview = async () => {
        if (work.status !== 'draft') {
            setError('Only draft works can be submitted for review');
            return;
        }

        const result = await workAPI.update(id, { status: 'submitted' });
        
        if (result.data) {
            setMessage('Work submitted for review!');
            fetchWork();
        } else {
            setError(result.error);
        }
    };

    const handleSaveDraft = async () => {
        const result = await draftAPI.create({
            title: formData.title,
            content: formData.content,
            workId: id
        });

        if (result.data) {
            setMessage('Draft saved!');
            fetchDrafts();
        } else {
            setError(result.error || 'Failed to save draft');
        }
    };

    const handleLoadDraft = async (draft) => {
        setFormData({
            ...formData,
            title: draft.title,
            content: draft.content
        });
        setMessage('Draft loaded!');
    };

    const handleDeleteDraft = async (draftId) => {
        if (window.confirm('Delete this draft?')) {
            const result = await draftAPI.delete(draftId);
            if (result.data) {
                fetchDrafts();
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!work) {
        return <div className="container">Work not found</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/my-works">&larr; Back to My Works</Link>
            </div>

            <h1 style={{ marginBottom: '10px' }}>Edit Work</h1>
            
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>Status: </span>
                <span style={{
                    background: work.status === 'published' ? '#28a745' : 
                               work.status === 'submitted' ? '#ffc107' : '#6c757d',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '3px'
                }}>
                    {work.status}
                </span>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div className="card">
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    style={{ minHeight: '300px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={handleSaveDraft}
                                >
                                    Save as Draft
                                </button>
                                {work.status === 'draft' && (
                                    <button 
                                        type="button" 
                                        className="btn btn-success"
                                        onClick={handleSubmitForReview}
                                    >
                                        Submit for Review
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div className="card">
                        <h4 style={{ marginBottom: '15px' }}>Saved Drafts ({drafts.length}/5)</h4>
                        
                        {drafts.length === 0 ? (
                            <p style={{ color: '#888', fontSize: '14px' }}>No saved drafts</p>
                        ) : (
                            drafts.map(draft => (
                                <div 
                                    key={draft._id}
                                    style={{ 
                                        padding: '10px', 
                                        background: '#f8f9fa', 
                                        marginBottom: '10px',
                                        borderRadius: '5px'
                                    }}
                                >
                                    <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
                                        {draft.title}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                                        {new Date(draft.createdAt).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ fontSize: '11px', padding: '4px 8px' }}
                                            onClick={() => handleLoadDraft(draft)}
                                        >
                                            Load
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '11px', padding: '4px 8px' }}
                                            onClick={() => handleDeleteDraft(draft._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditWork;