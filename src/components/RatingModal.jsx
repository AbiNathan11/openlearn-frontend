import toast from 'react-hot-toast';
import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageCircle, X } from 'lucide-react';
import { submitRating, canRateCourse } from '../services/api';

const RatingModal = ({ isOpen, onClose, courseId, courseTitle, initialRating = 0, initialReview = '' }) => {
    const [Rating, setRating] = useState(initialRating);
    const [Review, setReview] = useState(initialReview);
    const [loading, setLoading] = useState(false);
    const [canRate, setCanRate] = useState(null);
    const [error, setError] = useState('');

    const checkRatingEligibility = useCallback(async () => {
        try {
            const response = await canRateCourse(courseId);
            setCanRate(response.data.canRate);
            setError(response.data.reason || '');
        } catch {
            setError('Failed to check rating eligibility');
        }
    }, [courseId]);

    useEffect(() => {
        if (isOpen && courseId) {
            checkRatingEligibility();
        }
    }, [isOpen, courseId, checkRatingEligibility]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (Rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await submitRating(courseId, { Rating, Review });
            
            if (response.success) {
                onClose();
                // Show success message
                toast('Rating submitted successfully!');
            } else {
                setError(response.message || 'Failed to submit rating');
            }
        } catch {
            setError('Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pt-20">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 p-8 shadow-2xl border-2 border-blue-200 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Star className="text-yellow-400 mr-3" size={24} />
                        Add Your Review
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">{courseTitle}</h3>
                    <div className="text-center text-gray-500 text-sm">Share your detailed feedback about this course</div>
                </div>

                {!canRate && canRate === false && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        <div className="flex items-center">
                            <MessageCircle size={20} className="mr-3" />
                            <span className="font-medium">{error || 'You cannot rate this course'}</span>
                        </div>
                    </div>
                )}

                {canRate && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Review Text */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-3">
                                Your Review (Optional)
                            </label>
                            <textarea
                                value={Review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience with this course... What did you like most? What could be improved?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg"
                                rows="4"
                                maxLength="1000"
                            />
                            <div className="text-right text-sm text-gray-500 mt-2">
                                {Review.length}/1000 characters
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading || !canRate}
                                className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 text-lg ${
                                    loading || !canRate
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-white mr-3"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Star size={20} className="mr-2" />
                                        Submit Review
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RatingModal;
