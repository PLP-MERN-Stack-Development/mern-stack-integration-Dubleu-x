import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { isAuthenticated, user } = useAuth();

  const canEditPost = () => {
    return isAuthenticated && (user?.role === 'admin' || post.author?._id === user?._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="post-card">
      {post.featuredImage && (
        <div className="post-image">
          <img src={`/uploads/${post.featuredImage}`} alt={post.title} />
        </div>
      )}
      
      <div className="post-content">
        <h3>
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>
        
        {post.excerpt && (
          <p className="post-excerpt">{post.excerpt}</p>
        )}
        
        <p className="post-preview">
          {truncateContent(post.content)}
        </p>
        
        <div className="post-meta">
          <div className="meta-left">
            <span className="author">By {post.author?.username}</span>
            <span className="date">{formatDate(post.createdAt)}</span>
          </div>
          <div className="meta-right">
            <span className="views">{post.views} views</span>
          </div>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="post-categories">
            {post.categories.map(category => (
              <span 
                key={category._id} 
                className="category-tag"
                style={{ 
                  backgroundColor: category.color || '#3498db',
                  color: 'white'
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
            {post.tags.length > 3 && (
              <span className="tag-more">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}

        {canEditPost() && (
          <div className="post-actions">
            <Link 
              to={`/posts/${post._id}/edit`} 
              className="btn btn-sm btn-secondary"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(post._id)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;