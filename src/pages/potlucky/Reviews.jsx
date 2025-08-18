import React, { useState, useEffect } from 'react';
import { 
  Star, 
  User, 
  Calendar, 
  MessageSquare, 
  Edit3, 
  AlertCircle,
  Trash2, 
  Plus,
  X,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { apiGetMealReviews, apiAddReview, apiEditReview } from '../../services/potlucky';

const Reviews = ({ mealId, canAddReview = true, className = '' }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mealId) {
      fetchReviews();
    }
  }, [mealId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await apiGetMealReviews(mealId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const newReview = await apiAddReview(mealId, reviewData);
      setReviews([newReview, ...reviews]);
      setShowAddReview(false);
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  };

  const handleEditReview = async (reviewId, reviewData) => {
    try {
      const updatedReview = await apiEditReview(mealId, reviewId, reviewData);
      setReviews(reviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to edit review:', error);
      throw error;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length}
          </span>
        </div>
        {canAddReview && !showAddReview && (
          <button
            onClick={() => setShowAddReview(true)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{reviews.length} reviews</p>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600 w-2">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Review Form */}
      {showAddReview && (
        <AddReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setShowAddReview(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Be the first to review this meal!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={canAddReview ? () => setEditingReview(review) : null}
              isEditing={editingReview?.id === review.id}
              onCancelEdit={() => setEditingReview(null)}
              onSaveEdit={handleEditReview}
            />
          ))
        )}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewForm
          review={editingReview}
          onSubmit={(reviewData) => handleEditReview(editingReview.id, reviewData)}
          onCancel={() => setEditingReview(null)}
        />
      )}
    </div>
  );
};

// Add Review Form Component
const AddReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ rating, comment: comment.trim() });
      setRating(5);
      setComment('');
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className={`w-8 h-8 transition-colors ${
                  i < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating} star{rating !== 1 ? 's' : ''})</span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this meal..."
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Edit Review Form Component
const EditReviewForm = ({ review, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (error) {
      setError('Failed to update review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Review</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className={`w-8 h-8 transition-colors ${
                    i < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">({rating} star{rating !== 1 ? 's' : ''})</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this meal..."
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review, onEdit, isEditing, onCancelEdit, onSaveEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">
              {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous User'}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Review Actions */}
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

// Format date helper function (defined outside component to avoid recreation)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default Reviews;