import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../context/PostContext';
import ErrorMessage from '../components/ErrorMessage';

const CreatePost = () => {
  const { state, actions } = usePost();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: [],
    tags: '',
    status: 'draft',
    featuredImage: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    actions.fetchCategories();
  }, []);

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.length > 200) {
          newErrors.title = 'Title cannot exceed 200 characters';
        } else {
          delete newErrors.title;
        }
        break;
      
      case 'excerpt':
        if (value.length > 300) {
          newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
        } else {
          delete newErrors.excerpt;
        }
        break;
      
      case 'content':
        if (!value.trim()) {
          newErrors.content = 'Content is required';
        } else {
          delete newErrors.content;
        }
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    setTouched({
      title: true,
      excerpt: true,
      content: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await actions.createPost(postData);
      navigate('/posts', { 
        state: { message: 'Post created successfully!' }
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.path] = err.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Failed to create post' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
  };

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Create New Post</h1>
            <p>Share your thoughts and ideas with the community</p>
          </div>
          <button 
            onClick={() => navigate('/posts')} 
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>

        {state.error && (
          <ErrorMessage 
            message={state.error}
            onClose={actions.clearError}
          />
        )}

        {errors.submit && (
          <ErrorMessage message={errors.submit} />
        )}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title" className="required">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldError('title') ? 'error' : ''}
                placeholder="Enter a compelling title for your post"
                disabled={submitting}
              />
              {getFieldError('title') && (
                <span className="error-text">{errors.title}</span>
              )}
              <div className="form-hint">
                {formData.title.length}/200 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">
                Excerpt (Optional)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className={getFieldError('excerpt') ? 'error' : ''}
                placeholder="Brief summary of your post (appears in post listings)"
                disabled={submitting}
              />
              {getFieldError('excerpt') && (
                <span className="error-text">{errors.excerpt}</span>
              )}
              <div className="form-hint">
                {formData.excerpt.length}/300 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content" className="required">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="15"
                className={getFieldError('content') ? 'error' : ''}
                placeholder="Write your post content here... You can use markdown formatting."
                disabled={submitting}
              />
              {getFieldError('content') && (
                <span className="error-text">{errors.content}</span>
              )}
              <div className="form-hint">
                {formData.content.length} characters
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Post Settings</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categories">Categories</label>
                <select
                  multiple
                  id="categories"
                  name="categories"
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  size="4"
                  disabled={submitting}
                >
                  {state.categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="form-hint">
                  Hold Ctrl/Cmd to select multiple categories
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">Publication Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <div className="form-hint">
                  {formData.status === 'draft' 
                    ? 'Post will be saved as draft'
                    : 'Post will be published immediately'
                  }
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, javascript, web-development"
                disabled={submitting}
              />
              <div className="form-hint">
                Separate tags with commas
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image URL</label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={submitting}
              />
              <div className="form-hint">
                Optional: URL for the post's featured image
              </div>
            </div>
          </div>

          <div className="form-actions">
            <div className="action-group">
              <button 
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-outline"
                disabled={submitting}
              >
                Save Draft
              </button>
              <button 
                type="button"
                onClick={handlePublish}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Set to Publish
              </button>
            </div>
            
            <div className="action-group">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    {formData.status === 'draft' ? 'Saving...' : 'Publishing...'}
                  </>
                ) : (
                  formData.status === 'draft' ? 'Save as Draft' : 'Publish Post'
                )}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/posts')}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;