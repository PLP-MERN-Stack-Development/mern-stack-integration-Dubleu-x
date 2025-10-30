import React, { createContext, useContext, useReducer } from 'react';
import { postService, categoryService } from '../services/api';

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_POSTS':
      return { 
        ...state, 
        posts: action.payload.posts,
        pagination: action.payload.pagination,
        loading: false 
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_POST':
      return { 
        ...state, 
        posts: [action.payload, ...state.posts] 
      };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        )
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  posts: [],
  categories: [],
  pagination: {},
  loading: false,
  error: null
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const actions = {
    // Fetch posts with filters
    fetchPosts: async (params = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await postService.getAllPosts(
          params.page || 1,
          params.limit || 10,
          params.category || null
        );
        
        // Adjust based on your API response structure
        const posts = response.data || response.posts;
        const pagination = response.pagination || {
          page: params.page || 1,
          pages: Math.ceil(response.total / (params.limit || 10)),
          total: response.total
        };

        dispatch({
          type: 'SET_POSTS',
          payload: {
            posts,
            pagination
          }
        });
        return { data: posts, pagination };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch posts';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Fetch single post
    fetchPost: async (id) => {
      try {
        const response = await postService.getPost(id);
        return response.data; // Adjust based on your API response
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch post';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Create new post
    createPost: async (postData) => {
      try {
        const response = await postService.createPost(postData);
        const newPost = response.data;
        dispatch({ type: 'ADD_POST', payload: newPost });
        return newPost;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to create post';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Update post
    updatePost: async (id, postData) => {
      try {
        const response = await postService.updatePost(id, postData);
        const updatedPost = response.data;
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        return updatedPost;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to update post';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Delete post
    deletePost: async (id) => {
      try {
        await postService.deletePost(id);
        dispatch({ type: 'DELETE_POST', payload: id });
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete post';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Fetch categories
    fetchCategories: async () => {
      try {
        const response = await categoryService.getAllCategories();
        const categories = response.data || response.categories;
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        return categories;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      }
    },

    // Clear error
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  };

  return (
    <PostContext.Provider value={{ state, actions }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};