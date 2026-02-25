import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../api';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const result = await categoryAPI.getAll(1, 100);
        if (result.data) {
            setCategories(result.data.categories);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        let result;
        if (editingId) {
            result = await categoryAPI.update(editingId, formData);
        } else {
            result = await categoryAPI.create(formData);
        }

        if (result.data) {
            setMessage(editingId ? 'Category updated' : 'Category created');
            setFormData({ name: '', description: '' });
            setShowForm(false);
            setEditingId(null);
            fetchCategories();
        } else {
            setError(result.error);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setEditingId(category._id);
        setShowForm(true);
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const result = await categoryAPI.delete(categoryId);
            if (result.data) {
                setMessage('Category deleted');
                fetchCategories();
            } else {
                setError(result.error);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <Link to="/admin/users" style={{ marginRight: '15px' }}>Manage Users</Link>
                <Link to="/admin/works" style={{ marginRight: '15px' }}>Manage Works</Link>
                <Link to="/admin/comments" style={{ marginRight: '15px' }}>Manage Comments</Link>
                <Link to="/admin/categories" style={{ fontWeight: 'bold' }}>Manage Categories</Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Admin - Category Management</h1>
                {!showForm && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Category
                    </button>
                )}
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            {showForm && (
                <div className="card" style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Category description (optional)"
                                style={{ minHeight: '80px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div className="loading">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No categories found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Description</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                        <strong>{category.name}</strong>
                                    </td>
                                    <td style={{ padding: '12px', color: '#666' }}>
                                        {category.description || '-'}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px' }}
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminCategories;