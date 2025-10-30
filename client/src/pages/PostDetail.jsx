import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PostDetail = () => {
  const { id } = useParams();
  const { actions } = usePost();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await actions.fetchPost(id);
        setPost(postData);
      } catch (err) {
        setError('Post not found or failed to load');
        console.error('Error loading post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await actions.deletePost(id);
        navigate('/posts', { 
          state: { message: 'Post deleted successfully' }
        });
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const canEditPost = () => {
    return isAuthenticated && (user?.role === 'admin' || post?.author?._id === user?._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <LoadingSpinner text="Loading post..." />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>{error || 'Post Not Found'}</h2>
            <p>The post you're looking for doesn't exist or may have been removed.</p>
            <div className="error-actions">
              <Link to="/posts" className="btn btn-primary">
                Browse All Posts
              </Link>
              <button onClick={() => window.location.reload()} className="btn btn-outline">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="container">
        <article className="post-detail">
          {/* Post Header */}
          <header className="post-header">
            <nav className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="separator">/</span>
              <Link to="/posts">Posts</Link>
              <span className="separator">/</span>
              <span>Post</span>
            </nav>

            <div className="post-meta-header">
              <div className="author-info">
                <div className="author-avatar">
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt={post.author.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {post.author?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="author-details">
                  <span className="author-name">{post.author?.username}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
              </div>
              
              <div className="post-stats">
                <span className="views">{post.views} views</span>
                {post.updatedAt !== post.createdAt && (
                  <span className="updated">
                    Updated {formatDate(post.updatedAt)}
                  </span>
                )}
              </div>
            </div>

            <h1 className="post-title">{post.title}</h1>

            {post.excerpt && (
              <p className="post-excerpt">{post.excerpt}</p>
            )}

            <div className="post-tags-categories">
              {post.categories && post.categories.length > 0 && (
                <div className="post-categories">
                  {post.categories.map(category => (
                    <Link 
                      key={category._id} 
                      to={`/posts?category=${category.slug}`}
                      className="category-tag"
                      style={{ backgroundColor: category.color || '#3498db' }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="post-hero-image">
              <img src={`/uploads/${post.featuredImage}`} alt={post.title} />
            </div>
          )}

          {/* Post Content */}
          <div className="post-content">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index}>{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>

          {/* Post Footer */}
          <footer className="post-footer">
            <div className="post-actions">
              <div className="action-group">
                <Link to="/posts" className="btn btn-outline">
                  ← Back to Posts
                </Link>
              </div>
              
              {canEditPost() && (
                <div className="action-group">
                  <Link 
                    to={`/posts/${post._id}/edit`} 
                    className="btn btn-primary"
                  >
                    Edit Post
                  </Link>
                  <button 
                    onClick={handleDelete} 
                    className="btn btn-danger"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>

            <div className="post-meta-footer">
              <div className="meta-item">
                <strong>Published:</strong> {formatDate(post.createdAt)}
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="meta-item">
                  <strong>Last Updated:</strong> {formatDate(post.updatedAt)}
                </div>
              )}
              <div className="meta-item">
                <strong>Status:</strong> 
                <span className={`status-badge ${post.status}`}>
                  {post.status}
                </span>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Posts Section */}
        <section className="related-posts">
          <h3>More Posts You Might Like</h3>
          <div className="related-actions">
            <Link to="/posts" className="btn btn-outline">
              Browse All Posts
            </Link>
            {isAuthenticated && (
              <Link to="/posts/create" className="btn btn-primary">
                Write Your Own Post
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;