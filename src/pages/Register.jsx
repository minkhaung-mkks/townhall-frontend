import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

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

        if (!formData.username || !formData.email || !formData.password) {
            setError('Username, email, and password are required');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await authAPI.register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstname: formData.firstname,
            lastname: formData.lastname
        });

        if (result.data) {
            navigate('/login');
        } else {
            setError(result.error || 'Registration failed');
        }
        
        setLoading(false);
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className="card">
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
                
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="Your first name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Your last name"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;