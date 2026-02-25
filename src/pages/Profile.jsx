import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, workAPI } from '../api';
import { Link } from 'react-router-dom';
import theme from '../theme';

function Profile() {
    const { user, checkAuth } = useAuth();
    const [profile, setProfile] = useState(null);
    const [userWorks, setUserWorks] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        bio: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchUserWorks();
        }
    }, [user]);

    const fetchProfile = async () => {
        const userId = user._id || user.id;
        const result = await userAPI.getById(userId);
        if (result.data) {
            setProfile(result.data);
            setFormData({
                firstname: result.data.firstname || '',
                lastname: result.data.lastname || '',
                bio: result.data.bio || ''
            });
        }
        setLoading(false);
    };

    const fetchUserWorks = async () => {
        const userId = user._id || user.id;
        const result = await workAPI.getAll({ authorId: userId, limit: 20 });
        if (result.data) {
            setUserWorks(result.data.works);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const userId = user._id || user.id;
        const result = await userAPI.update(userId, formData);
        if (result.data) {
            setMessage('Profile updated successfully!');
            setEditing(false);
            checkAuth();
        } else {
            setError(result.error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const userId = user._id || user.id;
        const result = await userAPI.update(userId, {
            password: passwordData.newPassword
        });

        if (result.data) {
            setMessage('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
        } else {
            setError(result.error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => (
        <span style={{
            background: theme.status[status] || theme.colors.muted,
            color: 'white',
            padding: '3px 8px',
            borderRadius: '2px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        }}>
            {status}
        </span>
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!profile) {
        return <div className="container">Profile not found</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: theme.fonts.heading }}>My Profile</h2>
                    {!editing && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {editing ? (
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                disabled
                                style={{ background: theme.colors.hoverBg }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                style={{ background: theme.colors.hoverBg }}
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={formData.firstname}
                                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                style={{ minHeight: '100px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <strong>Username:</strong>
                                <p>{profile.username}</p>
                            </div>
                            <div>
                                <strong>Email:</strong>
                                <p>{profile.email}</p>
                            </div>
                            <div>
                                <strong>First Name:</strong>
                                <p>{profile.firstname || '-'}</p>
                            </div>
                            <div>
                                <strong>Last Name:</strong>
                                <p>{profile.lastname || '-'}</p>
                            </div>
                            <div>
                                <strong>Role:</strong>
                                <p>
                                    <span style={{
                                        background: theme.role[profile.role] || theme.colors.muted,
                                        color: 'white',
                                        padding: '3px 8px',
                                        borderRadius: '2px',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                    }}>
                                        {profile.role}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <p>
                                    <span style={{
                                        background: theme.userStatus[profile.status] || theme.colors.muted,
                                        color: 'white',
                                        padding: '3px 8px',
                                        borderRadius: '2px',
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                    }}>
                                        {profile.status}
                                    </span>
                                </p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong>Bio:</strong>
                                <p>{profile.bio || 'No bio yet.'}</p>
                            </div>
                            <div>
                                <strong>Member Since:</strong>
                                <p>{formatDate(profile.createdAt)}</p>
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            style={{ marginTop: '20px' }}
                        >
                            Change Password
                        </button>

                        {showPasswordForm && (
                            <form onSubmit={handleChangePassword} style={{
                                marginTop: '20px',
                                padding: '20px',
                                background: theme.colors.hoverBg,
                                borderRadius: '2px'
                            }}>
                                <h4 style={{ fontFamily: theme.fonts.heading }}>Change Password</h4>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Password</button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: theme.fonts.heading }}>My Works</h3>
                    <Link to="/create-work" className="btn btn-primary">+ Create New Work</Link>
                </div>

                {userWorks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: theme.colors.muted }}>
                        You haven't created any works yet.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${theme.colors.border}` }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Created</th>
                                <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userWorks.map(work => (
                                <tr key={work._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                                    <td style={{ padding: '10px' }}>
                                        <Link to={`/work/${work._id}`} style={{ color: theme.colors.burgundy }}>
                                            {work.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '10px' }}>{getStatusBadge(work.status)}</td>
                                    <td style={{ padding: '10px' }}>{formatDate(work.createdAt)}</td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>
                                        <Link
                                            to={`/edit-work/${work._id}`}
                                            className="btn btn-secondary"
                                            style={{ fontSize: '12px', padding: '5px 10px' }}
                                        >
                                            Edit
                                        </Link>
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

export default Profile;
