import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Posts = () => {
  const { state, actions } = usePost();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    category: '',
    tag: ''
  });

  useEffect(() => {
    loadPosts();
  }, [filters.page, filters.category, filters.tag]);

  useEffect(() => {
    actions.fetchCategories();
  }, []);

  const loadPosts = async () => {
    try {
      await actions.fetchPosts(filters);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm,
      page: 1 
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category,
      page: 1 
    }));
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await actions.deletePost(postId);
        // Reload posts after deletion
        await loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      search: '',
      category: '',
      tag: ''
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.tag;

  return (
    <div className="posts-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>All Blog Posts</h1>
            <p>Discover articles from our community of writers</p>
          </div>
          {isAuthenticated && (
            <Link to="/posts/create" className="btn btn-primary">
              <span className="btn-icon">+</span>
              Create New Post
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-container">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search posts by title or content..."
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-filter">Filter by Category:</label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {state.categories.map(category => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <ErrorMessage 
            message={state.error}
            onClose={actions.clearError}
            retry={loadPosts}
          />
        )}

        {/* Posts Grid */}
        {state.loading ? (
          <LoadingSpinner text="Loading posts..." />
        ) : (
          <>
            {/* Results Info */}
            {state.posts.length > 0 && (
              <div className="results-info">
                <p>
                  Showing {state.posts.length} of {state.pagination?.total || 0} posts
                  {filters.search && ` for "${filters.search}"`}
                  {filters.category && ` in ${state.categories.find(c => c.slug === filters.category)?.name}`}
                </p>
              </div>
            )}

            {/* Posts Grid */}
            <div className="posts-grid">
              {state.posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handleDeletePost}
                />
              ))}
            </div>

            {/* No Posts Message */}
            {state.posts.length === 0 && !state.loading && (
              <div className="no-posts">
                <div className="no-posts-icon">🔍</div>
                <h3>No posts found</h3>
                <p>
                  {hasActiveFilters 
                    ? 'Try adjusting your search or filters to find more posts.'
                    : 'No posts have been published yet.'
                  }
                </p>
                {hasActiveFilters ? (
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                ) : (
                  isAuthenticated && (
                    <Link to="/posts/create" className="btn btn-primary">
                      Create First Post
                    </Link>
                  )
                )}
              </div>
            )}

            {/* Pagination */}
            {state.pagination && state.pagination.pages > 1 && (
              <div className="pagination">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {filters.page} of {state.pagination.pages}
                  {state.pagination.total && (
                    <span className="total-count"> ({state.pagination.total} total)</span>
                  )}
                </div>
                
                <button
                  disabled={filters.page === state.pagination.pages}
                  onClick={() => handlePageChange(filters.page + 1)}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;