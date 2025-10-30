import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { state, actions } = usePost();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
      
      // Load user's posts
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const data = await actions.fetchPosts({ limit: 10 });
      // Filter posts by current user (you might want to implement a specific API endpoint for this)
      const userPosts = data.data.filter(post => post.author?._id === user?._id);
      setUserPosts(userPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <LoadingSpinner text="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>Profile Settings</h1>
        </div>

        <div className="profile-container">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3>{user.username}</h3>
              <p className="user-email">{user.email}</p>
              <div className={`user-role ${user.role}`}>
                {user.role}
              </div>
              <p className="member-since">
                Member since {formatDate(user.createdAt)}
              </p>
              
              <div className="user-stats">
                <div className="stat">
                  <span className="stat-number">{userPosts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {message && (
              <div className="alert alert-success">
                <div className="alert-content">
                  {message}
                </div>
                <button 
                  onClick={() => setMessage('')} 
                  className="alert-close"
                >
                  ×
                </button>
              </div>
            )}

            {errors.submit && (
              <ErrorMessage message={errors.submit} />
            )}

            {/* Profile Form */}
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={errors.username ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.username && (
                      <span className="error-text">{errors.username}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      disabled={loading}
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className={errors.bio ? 'error' : ''}
                    disabled={loading}
                  />
                  {errors.bio && (
                    <span className="error-text">{errors.bio}</span>
                  )}
                  <div className="form-hint">
                    {formData.bio.length}/500 characters
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="avatar">Avatar URL</label>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={loading}
                  />
                  <div className="form-hint">
                    Optional: URL for your profile picture
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* User Posts Section */}
            <div className="profile-section">
              <h3>My Posts</h3>
              {userPosts.length === 0 ? (
                <div className="no-posts">
                  <p>You haven't created any posts yet.</p>
                  <a href="/posts/create" className="btn btn-primary">
                    Create Your First Post
                  </a>
                </div>
              ) : (
                <div className="user-posts">
                  {userPosts.map(post => (
                    <div key={post._id} className="user-post-item">
                      <div className="post-info">
                        <h4>
                          <a href={`/posts/${post._id}`}>{post.title}</a>
                        </h4>
                        <div className="post-meta">
                          <span className={`status ${post.status}`}>
                            {post.status}
                          </span>
                          <span className="date">
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="views">
                            {post.views} views
                          </span>
                        </div>
                      </div>
                      <div className="post-actions">
                        <a 
                          href={`/posts/${post._id}/edit`}
                          className="btn btn-sm btn-outline"
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;