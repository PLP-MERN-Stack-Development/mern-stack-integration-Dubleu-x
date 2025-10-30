import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePost } from '../context/PostContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { state, actions } = usePost();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        const data = await actions.fetchPosts({ limit: 6 });
        setFeaturedPosts(data.data || []);
      } catch (error) {
        console.error('Error loading featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await actions.deletePost(postId);
        setFeaturedPosts(prev => prev.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MERN Blog</h1>
          <p>A modern, full-stack blog application built with MongoDB, Express, React, and Node.js</p>
          <div className="hero-actions">
            <Link to="/posts" className="btn btn-primary btn-large">
              Browse All Posts
            </Link>
            <Link to="/posts/create" className="btn btn-secondary btn-large">
              Write a Post
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="featured-posts">
        <div className="container">
          <h2>Featured Posts</h2>
          <p className="section-subtitle">Discover the latest articles from our community</p>
          
          {loading ? (
            <LoadingSpinner text="Loading featured posts..." />
          ) : (
            <>
              <div className="posts-grid">
                {featuredPosts.map(post => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>

              {featuredPosts.length === 0 && (
                <div className="no-posts">
                  <div className="no-posts-icon">📝</div>
                  <h3>No posts yet</h3>
                  <p>Be the first to share your thoughts with the community!</p>
                  <Link to="/posts/create" className="btn btn-primary">
                    Create First Post
                  </Link>
                </div>
              )}

              {featuredPosts.length > 0 && (
                <div className="section-footer">
                  <Link to="/posts" className="btn btn-outline">
                    View All Posts
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose MERN Blog?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Modern Technology</h3>
              <p>Built with the latest MERN stack technologies for optimal performance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Perfect reading experience on all devices - desktop, tablet, and mobile</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>JWT authentication and secure API endpoints to protect your data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface for writing, editing, and managing your blog posts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;