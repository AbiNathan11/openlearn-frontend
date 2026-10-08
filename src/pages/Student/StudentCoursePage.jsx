"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Play, CheckCircle, Lock, Star, MessageCircle, FileText, Download } from "lucide-react"

import { getCourseById, getCourseProgress, markLessonComplete, submitRating, canRateCourse } from "../../services/api"

const StudentCoursePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [progress, setProgress] = useState({ completedLessons: [], completedCount: 0 })
    const [currentLesson, setCurrentLesson] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCourseCompleted, setIsCourseCompleted] = useState(false)
    const [Rating, setRating] = useState(0)
    const [RatingError, setRatingError] = useState('')
    const [hasSubmittedRating, setHasSubmittedRating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedRatingData, setSubmittedRatingData] = useState(null)
    const [showRatingBox, setShowRatingBox] = useState(true)

    // Helper to check if lesson is completed
    const isLessonCompleted = (lessonId) => {
        return progress.completedLessons.includes(lessonId)
    }

    // Check if course is completed
    const checkCourseCompletion = useCallback(async () => {
        if (course && progress.completedLessons.length > 0) {
            const totalLessons = course.lessons?.length || 0
            const completedCount = progress.completedLessons.length
            const isCompleted = completedCount === totalLessons && totalLessons > 0
            setIsCourseCompleted(isCompleted)

            if (isCompleted) {
                try {
                    const response = await canRateCourse(id);
                    if (response.success && !response.canRate) {
                        if (response.reason === 'Already rated') {
                            setHasSubmittedRating(true);
                            if (response.rating) {
                                setSubmittedRatingData(response.rating);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to check rating status:", error);
                }
            }
        }
    }, [course, progress.completedLessons, setIsCourseCompleted, id])

    const fetchCourseData = useCallback(async () => {
        try {
            const [courseRes, progressRes] = await Promise.all([
                getCourseById(id),
                getCourseProgress(id)
            ])

            if (courseRes.success) {
                const courseData = courseRes.data
                // Ensure lessons are sorted by order
                if (courseData.lessons) {
                    courseData.lessons.sort((a, b) => a.order - b.order)
                }
                setCourse(courseData)

                // Set initial lesson (first unlocked or last accessed - for now just first or first incomplete)
                if (courseData.lessons && courseData.lessons.length > 0) {
                    // Try to find first incomplete lesson
                    const completedIds = progressRes.success ? progressRes.data.completedLessons : []
                    const firstIncomplete = courseData.lessons.find(l => !completedIds.includes(l._id))
                    setCurrentLesson(firstIncomplete || courseData.lessons[0])
                }
            }

            if (progressRes.success) {
                setProgress(progressRes.data)
            }

            // Check course completion happens in effect dependent on state updates, 
            // but we can trigger it here manually if we want immediate check after data fetch
            // logic is moved to checkCourseCompletion which is called in useEffect

        } catch (error) {
            console.error("Failed to fetch course data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [id]) // Removed checkCourseCompletion dependency to avoid loop if it changes

    useEffect(() => {
        fetchCourseData()
    }, [id, fetchCourseData])

    useEffect(() => {
        checkCourseCompletion()
    }, [course, progress, checkCourseCompletion])

    const handleRatingSubmit = async (e) => {
        e.preventDefault();

        if (Rating === 0) {
            setRatingError('Please select a rating');
            return;
        }

        if (hasSubmittedRating) {
            setRatingError('You have already submitted a rating for this course');
            return;
        }

        setIsSubmitting(true);
        setRatingError('');

        try {
            const response = await submitRating(id, { rating: Rating, review: "" });

            if (response.success) {
                // Show success message
                setHasSubmittedRating(true); // Mark as submitted
                setRatingError('Your rating is submitted');
                
                // Hide the box after a short delay
                setTimeout(() => {
                    setShowRatingBox(false);
                }, 1500);
            } else {
                setRatingError(response.message || 'Failed to submit rating');
            }
        } catch (error) {
            setRatingError(error || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLessonComplete = async (lessonId) => {
        if (!isLessonCompleted(lessonId)) {
            try {
                const response = await markLessonComplete(id, lessonId)
                if (response.success) {
                    // Update local state
                    setProgress(prev => ({
                        ...prev,
                        completedLessons: [...prev.completedLessons, lessonId],
                        completedCount: prev.completedCount + 1
                    }))
                }
            } catch (error) {
                console.error("Failed to mark lesson complete:", error)
            }
        }
    }
    
    const handleView = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            // Create a new blob with the specific type application/pdf 
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error("View failed:", error);
            window.open(url, '_blank');
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `${filename}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(url, '_blank');
        }
    };


    if (isLoading) return <div className="text-center py-12">Loading course content...</div>
    if (!course) return <div className="text-center py-12">Course not found</div>

    const lessons = course.lessons || []

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Course Completion Rating Card */}
                {isCourseCompleted && showRatingBox && !hasSubmittedRating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-sm w-full relative transform transition-all duration-300 border border-gray-100">
                            <div className="p-8 text-center bg-white">
                                <div className="mb-5 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Star size={32} className="text-primary fill-primary/20" />
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Our Service</h2>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    Tell us about your learning experience! Your feedback helps us improve our courses and better serve students.
                                </p>
                                
                                <div className="flex justify-center mb-6 gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors duration-200 ${
                                                    star <= Rating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-gray-200 hover:text-amber-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                
                                {RatingError && (
                                    <p className={`mb-6 text-sm font-medium ${RatingError.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>
                                        {RatingError}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowRatingBox(false)}
                                        className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Later
                                    </button>
                                    <button 
                                        onClick={handleRatingSubmit}
                                        disabled={isSubmitting || Rating === 0}
                                        className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-primary"
                                        style={{ backgroundColor: 'var(--primary)' }}
                                    >
                                        {isSubmitting ? '...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {/* Course Header */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                    <h1 className="text-4xl font-black text-primary tracking-tight leading-tight">{course.title}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lessons Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 card-shadow">
                            <h2 className="text-xl font-bold text-foreground mb-4">Course Lessons</h2>
                            <div className="space-y-2">
                                {lessons.map((lesson, index) => {
                                    const isCompleted = isLessonCompleted(lesson._id)
                                    // Locked if it's not the first lesson AND previous lesson is not completed
                                    const isLocked = index > 0 && !isLessonCompleted(lessons[index - 1]._id)

                                    return (
                                        <button
                                            key={lesson._id}
                                            onClick={() => !isLocked && setCurrentLesson(lesson)}
                                            disabled={isLocked}
                                            className={`w-full text-left p-4 rounded-lg border transition ${currentLesson?._id === lesson._id
                                                ? "border-primary bg-blue-50"
                                                : "border-gray-200 hover:border-primary"
                                                } ${isLocked ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {isCompleted ? (
                                                        <CheckCircle size={20} className="text-success" />
                                                    ) : isLocked ? (
                                                        <Lock size={20} className="text-text-muted" />
                                                    ) : currentLesson?._id === lesson._id ? (
                                                        <Play size={20} className="text-primary fill-primary" />
                                                    ) : (
                                                        <Play size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground text-sm mb-1">
                                                        {index + 1}. {lesson.title}
                                                    </h3>
                                                    <p className="text-xs text-text-secondary">{lesson.duration || "10"} mins</p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="bg-white rounded-lg overflow-hidden card-shadow">
                            <div className="aspect-video bg-black flex items-center justify-center relative">
                                {currentLesson?.videoUrl ? (
                                    <video
                                        src={currentLesson?.videoUrl || undefined}
                                        controls
                                        className="w-full h-full"
                                        poster={course.thumbnail}
                                        onEnded={() => handleLessonComplete(currentLesson._id)}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="text-center text-white p-8">
                                        <Play size={64} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No video available for this lesson</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            {currentLesson ? currentLesson.title : "Select a lesson to start"}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-foreground mb-2">
                                            {currentLesson?.title || "Select a lesson"}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {currentLesson?.description || "No description available."}
                                        </p>

                                        {currentLesson?.pdfUrl && (
                                            <div className="flex items-center gap-3 px-3 py-1.5 bg-red-50/50 border border-red-100 rounded-lg w-fit mt-4">
                                                <div 
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                    onClick={() => handleView(currentLesson.pdfUrl)}
                                                >
                                                    <FileText size={16} className="text-red-600" />
                                                    <span className="text-red-700 text-sm font-bold">
                                                        {currentLesson.title.replace(/\s+/g, '_')}.pdf
                                                    </span>
                                                </div>
                                                <div className="w-px h-4 bg-red-200"></div>
                                                <button
                                                    onClick={() => handleDownload(currentLesson.pdfUrl, currentLesson.title)}
                                                    className="p-1 px-1.5 hover:bg-red-100 rounded transition-colors text-red-600 cursor-pointer border-none bg-transparent"
                                                    title="Download PDF"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )

}

export default StudentCoursePage
