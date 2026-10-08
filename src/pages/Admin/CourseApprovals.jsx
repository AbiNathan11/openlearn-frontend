import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { Check, X, BookOpen, AlertCircle, Eye, Clock, Layers, Play } from "lucide-react"
import { getPendingCourses, approveCourse, rejectCourse, getCourseById } from "../../services/api"
import ConfirmModal from "../../components/ConfirmModal"

const CourseApprovals = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFetchingCourse, setIsFetchingCourse] = useState(false)

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Confirm",
        type: "danger"
    })

    const fetchPendingCourses = async () => {
        try {
            const response = await getPendingCourses()
            if (response.success) {
                setCourses(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch pending courses:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPendingCourses()
    }, [])

    const handleApprove = (courseId) => {
        setConfirmModal({
            isOpen: true,
            title: "Approve Course?",
            message: "Are you sure you want to approve this course? It will be published immediately and made visible to all students.",
            confirmText: "Approve Course",
            type: "info",
            onConfirm: async () => {
                setActionLoading(courseId)
                try {
                    await approveCourse(courseId)
                    setCourses(prev => prev.filter(c => c._id !== courseId))
                    toast("Course approved successfully!")
                } catch (error) {
                    console.error("Approval failed:", error)
                    toast("Failed to approve course")
                } finally {
                    setActionLoading(null)
                }
            }
        });
    }

    const handleReject = (courseId) => {
        setConfirmModal({
            isOpen: true,
            title: "Reject Course?",
            message: "Are you sure you want to reject this course? The instructor will be notified to make changes.",
            confirmText: "Reject Course",
            type: "danger",
            onConfirm: async () => {
                setActionLoading(courseId)
                try {
                    await rejectCourse(courseId)
                    setCourses(prev => prev.filter(c => c._id !== courseId))
                    toast("Course rejected.")
                } catch (error) {
                    console.error("Rejection failed:", error)
                    toast("Failed to reject course")
                } finally {
                    setActionLoading(null)
                }
            }
        });
    }

    const handleView = async (courseId) => {
        setIsFetchingCourse(true)
        setIsModalOpen(true)
        setSelectedLesson(null)
        try {
            const response = await getCourseById(courseId)
            if (response.success) {
                setSelectedCourse(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch course details:", error)
        } finally {
            setIsFetchingCourse(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading pending courses...</p>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Course Approvals</h1>
                <p className="text-text-secondary">Review and approve courses submitted by instructors.</p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="text-green-500" size={32} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">All Caught Up!</h2>
                    <p className="text-text-secondary">No pending courses to review at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition">
                            <div className="w-full md:w-64 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="text-gray-400" size={32} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">{course.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                                            <span className="flex items-center gap-1">
                                                By: <span className="font-semibold text-primary">{course.instructor?.name || "Unknown"}</span>
                                            </span>
                                            <span>•</span>
                                            <span>{course.category}</span>
                                            <span>•</span>
                                            <span>{course.level}</span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                        {course.status}
                                    </span>
                                </div>

                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="px-3 py-1 bg-gray-100 rounded text-gray-700">
                                        Price: <span className="font-semibold">${course.price}</span>
                                    </div>
                                    <div className="px-3 py-1 bg-gray-100 rounded text-gray-700">
                                        Duration: <span className="font-semibold">{course.duration}h</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-100">
                                <button
                                    onClick={() => handleView(course._id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition shadow-sm w-full md:w-auto font-semibold"
                                >
                                    <Eye size={18} />
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleApprove(course._id)}
                                    disabled={actionLoading === course._id}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm w-full md:w-auto font-semibold"
                                >
                                    <Check size={18} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(course._id)}
                                    disabled={actionLoading === course._id}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm w-full md:w-auto font-semibold"
                                >
                                    <X size={18} />
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative group">
                        <button 
                            onClick={() => {
                                setIsModalOpen(false)
                                setSelectedLesson(null)
                            }}
                            className="absolute top-6 right-6 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all border border-white/20"
                        >
                            <X size={24} />
                        </button>

                        {isFetchingCourse ? (
                            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-text-secondary font-bold text-lg tracking-wide uppercase">Inspecting course architecture...</p>
                            </div>
                        ) : selectedCourse ? (
                            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col border-r border-gray-200">
                                    {selectedLesson ? (
                                        <div className="flex-1 flex flex-col">
                                            <div className="aspect-video bg-black relative flex-shrink-0 group/video">
                                                {selectedLesson.videoUrl ? (
                                                    <video 
                                                        src={selectedLesson.videoUrl} 
                                                        className="w-full h-full object-contain"
                                                        controls
                                                        autoPlay
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/50">
                                                        <Play size={48} className="opacity-20" />
                                                        <p className="font-semibold text-sm">No video available</p>
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedLesson(null)}
                                                    className="absolute top-4 left-4 px-2 py-1 bg-black/40 hover:bg-black/60 text-white rounded text-[10px] font-bold transition-all border border-white/20"
                                                >
                                                    Back to Overview
                                                </button>
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {selectedCourse.lessons.indexOf(selectedLesson) + 1}
                                                    </span>
                                                    <h2 className="text-xl font-bold text-foreground leading-tight">{selectedLesson.title}</h2>
                                                </div>
                                                <p className="text-text-secondary leading-relaxed text-base">
                                                    {selectedLesson.description || "The instructor hasn't provided a detailed breakdown for this module yet."}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col">
                                            <div className="relative h-60 flex-shrink-0 border-b border-gray-200 overflow-hidden">
                                                <img 
                                                    src={selectedCourse.thumbnail} 
                                                    alt={selectedCourse.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="px-3 py-1 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                                                {selectedCourse.category}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider border border-white/10">
                                                                {selectedCourse.level}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">{selectedCourse.title}</h2>
                                                </div>
                                            </div>

                                            <div className="p-8 space-y-8">
                                                <section>
                                                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-widest text-primary border-b border-gray-100 pb-2">
                                                        <BookOpen size={20} />
                                                        Course Description
                                                    </h3>
                                                    <div className="text-text-secondary leading-relaxed text-base">
                                                        {selectedCourse.description}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:w-[360px] bg-white overflow-y-auto flex flex-col border-l border-gray-100">
                                    <div className="p-8 flex-1">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                                <Layers className="text-primary" size={24} />
                                                Course Lessons
                                            </h3>
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                                                {selectedCourse.lessons?.length || 0} Modules
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {selectedCourse.lessons?.map((lesson, idx) => {
                                                const isSelected = (selectedLesson?.id && selectedLesson.id === lesson.id) || 
                                                                 (selectedLesson?._id && selectedLesson._id === lesson._id);
                                                return (
                                                    <button 
                                                        key={lesson._id || idx} 
                                                        onClick={() => setSelectedLesson(lesson)}
                                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                                                            isSelected 
                                                                ? "bg-primary border-primary shadow-md" 
                                                                : "bg-white border-gray-200 hover:border-primary/50 hover:bg-blue-50"
                                                        }`}
                                                        style={{ backgroundColor: isSelected ? '#0066cc' : '#ffffff', color: isSelected ? '#ffffff' : '#111827' }}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? "bg-white text-primary" : "bg-blue-50 text-primary"}`}>
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="font-bold text-sm" style={{ color: isSelected ? '#ffffff' : '#111827', margin: 0 }}>
                                                                {lesson?.title || `Lesson ${idx + 1}`}
                                                            </p>
                                                            <p className="text-xs mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280', margin: 0 }}>
                                                                {lesson?.duration || 0} min
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 text-center text-text-secondary font-bold text-lg italic tracking-wide">Course data is currently out of reach or doesn't exist.</div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
            />
        </div>
    )
}

export default CourseApprovals
