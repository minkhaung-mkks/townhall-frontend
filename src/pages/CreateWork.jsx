import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workAPI, categoryAPI } from '../api';

function CreateWork() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        tags: ''
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const result = await categoryAPI.getAll();
        if (result.data) {
            setCategories(result.data.categories);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.title || !formData.content) {
            setError('Title and content are required');
            setLoading(false);
            return;
        }

        const data = {
            title: formData.title,
            content: formData.content,
            categoryId: formData.categoryId || null,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
        };

        const result = await workAPI.create(data);
        
        if (result.data) {
            navigate(`/edit-work/${result.data.id}`);
        } else {
            setError(result.error || 'Failed to create work');
        }
        
        setLoading(false);
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '20px' }}>Create New Work</h1>

            {error && <p className="error-message">{error}</p>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter your work title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your content here..."
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
                            placeholder="e.g., fiction, romance, adventure"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Work'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/my-works')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateWork;