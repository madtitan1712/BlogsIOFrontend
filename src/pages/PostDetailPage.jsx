import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PostService from '../services/PostService';
import CommentService from '../services/CommentService';
import AuthUtils from '../utils/AuthUtils';

// Components
import { Spinner } from '../components/ui';
import ErrorAlert from '../components/ui/ErrorAlert';
import CommentList from '../components/comments/CommentList';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const data = await PostService.getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        setCommentsLoading(true);
        const data = await CommentService.getCommentsByPostId(id);
        

        
        // Ensure all comments have proper user IDs
        const processedComments = data.map(comment => {
          // If comment doesn't have a user property or user.id, it might be the current user's comment
          if (!comment.user || !comment.user.id) {
            // Use the currentUser info if this appears to be a comment by the current user
            return {
              ...comment,
              user: comment.user || { id: user?.id, name: user?.name }
            };
          }
          return comment;
        });
        
        setComments(processedComments);
        setCommentsError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setCommentsError('Failed to load comments. Please try again later.');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id, user]);

  // Handle adding a new comment
  const handleAddComment = async (commentText) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    
    try {
      const newComment = await CommentService.addComment(id, commentText);
      
      // Get stored numeric user ID
      const numericUserId = AuthUtils.getStoredUserId();
      

      
      // Ensure the comment has the correct user ID attached (using numeric ID)
      const commentWithUser = {
        ...newComment,
        user: newComment.user || { 
          id: numericUserId || user.id,
          name: user.name 
        }
      };
      
      setComments(prevComments => [...prevComments, commentWithUser]);
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  // Handle editing a comment
  const handleEditComment = async (commentId, newText) => {
    try {
      const updatedComment = await CommentService.updateComment(commentId, newText);
      setComments(prevComments => prevComments.map(c => c.id === commentId ? { ...c, commentText: updatedComment.commentText } : c));
      return true;
    } catch (err) {
      console.error('Error editing comment:', err);
      return false;
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await CommentService.deleteComment(commentId);
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      return false;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] fade-in">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return <ErrorAlert message={error || "Post not found"} />;
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 dark:text-primary-dark fade-in-down">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-4 mb-4 fade-in-left" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <span className="text-sm font-medium">By {post.author?.name || 'Unknown Author'}</span>
          </div>
          <span className="text-sm">•</span>
          <div className="text-sm">
            {post.createdAt && formatDate(post.createdAt)}
          </div>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 fade-in-left" style={{animationDelay: '0.2s'}}>
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-secondary/10 text-secondary dark:bg-secondary-dark/20 dark:text-secondary-dark px-3 py-1 rounded-full text-xs font-medium"
                style={{animationDelay: `${0.1 * index}s`}}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="mb-12 fade-in-up" style={{animationDelay: '0.3s'}}>
        <div 
          className="post-content" 
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 fade-in-up" style={{animationDelay: '0.5s'}}>
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark fade-in-left" style={{animationDelay: '0.6s'}}>
          Comments
        </h2>
        
        {/* Comments List */}
        {commentsLoading ? (
          <div className="flex justify-center py-8 fade-in">
            <Spinner size="md" />
          </div>
        ) : commentsError ? (
          <ErrorAlert message={commentsError} />
        ) : (
          <div className="fade-in-up" style={{animationDelay: '0.7s'}}>

            <CommentList 
              comments={comments} 
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              isAuthenticated={!!user}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;