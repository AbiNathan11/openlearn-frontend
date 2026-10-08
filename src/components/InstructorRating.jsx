import React from 'react';
import { Star, TrendingUp, Users, MessageCircle } from 'lucide-react';

const InstructorRating = ({ instructorId, showStats = true }) => {
    const [ratingData, setRatingData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        const fetchInstructorRatings = async () => {
            try {
                // This would be replaced with actual API call
                const response = await fetch(`/api/ratings/instructor/${instructorId}`);
                const data = await response.json();
                
                if (data.success) {
                    setRatingData(data.data);
                } else {
                    setError(data.message || 'Failed to load ratings');
                }
            } catch (err) {
                setError('Failed to load ratings');
            } finally {
                setLoading(false);
            }
        };

        if (instructorId) {
            fetchInstructorRatings();
        }
    }, [instructorId]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    const renderDistribution = (distribution) => {
        const total = distribution.reduce((sum, count) => sum + count, 0);
        const percentages = distribution.map(count => 
            total > 0 ? ((count / total) * 100).toFixed(1) : 0
        );

        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Rating Distribution</h4>
                <div className="space-y-2">
                    {distribution.map((count, index) => (
                        <div key={index} className="flex items-center">
                            <div className="flex items-center mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={12}
                                        className={`${
                                            star <= 5 - index
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500">{5 - index} stars</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {percentages[index]}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentages[index]}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <MessageCircle size={24} className="mx-auto text-red-500 mb-2" />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!ratingData) {
        return (
            <div className="text-center py-8 text-gray-500">
                No rating data available
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Overall Rating */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full">
                    {renderStars(ratingData.averageRating)}
                </div>
                <div className="mt-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {ratingData.averageRating.toFixed(1)}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Based on {ratingData.totalRatings} {ratingData.totalRatings === 1 ? 'rating' : 'ratings'}
                    </p>
                </div>
            </div>

            {showStats && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <Users size={24} className="text-blue-600 mr-2" />
                                <div>
                                    <p className="text-2xl font-bold text-blue-800">
                                        {ratingData.totalRatings}
                                    </p>
                                    <p className="text-sm text-blue-600">Total Ratings</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <TrendingUp size={24} className="text-green-600 mr-2" />
                                <div>
                                    <p className="text-2xl font-bold text-green-800">
                                        {ratingData.averageRating.toFixed(1)}
                                    </p>
                                    <p className="text-sm text-green-600">Average Rating</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <Star size={24} className="text-purple-600 mr-2" />
                                <div>
                                    <p className="text-2xl font-bold text-purple-800">
                                        {Math.round(ratingData.averageRating * 20)}%
                                    </p>
                                    <p className="text-sm text-purple-600">Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    {ratingData.ratingDistribution && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {renderDistribution(ratingData.ratingDistribution)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InstructorRating;
