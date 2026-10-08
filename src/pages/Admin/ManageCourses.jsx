import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { Search, Trash2, Eye, Users, DollarSign, X, BookOpen, Clock, Layers, Play } from "lucide-react"
import { getAllCoursesAdmin, deleteCourse, getCourseById } from "../../services/api"
import { useNavigate } from "react-router-dom"
import ConfirmModal from "../../components/ConfirmModal"

const ManageCourses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFetchingCourse, setIsFetchingCourse] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Confirm",
        type: "danger"
    })

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const response = await getAllCoursesAdmin()
            if (response.success) {
                const mappedCourses = response.data.map(course => ({
                    id: course._id,
                    title: course.title,
                    instructor: course.instructor?.name || "Unknown",
                    category: course.category,
                    students: course.students?.length || 0,
                    revenue: `$${((course.students?.length || 0) * course.price).toLocaleString()}`,
                    status: course.status || (course.published ? "Published" : "Draft"),
                    rating: course.averageRating || 0,
                    image: course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                    price: course.price
                }))
                setCourses(mappedCourses)
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const categories = ["Web Development", "Data Science", "Design", "Business", "Marketing"]


    const handleDelete = (courseId) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Course?",
            message: "Are you sure you want to delete this course? This action cannot be undone and all student data will be lost.",
            confirmText: "Delete Course",
            type: "danger",
            onConfirm: async () => {
                try {
                    await deleteCourse(courseId)
                    setCourses(prev => prev.filter(c => c.id !== courseId))
                    toast("Course deleted successfully")
                } catch (error) {
                    toast("Failed to delete course: " + error)
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
            toast("Failed to load course details")
            setIsModalOpen(false)
        } finally {
            setIsFetchingCourse(false)
        }
    }

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "all" || course.category === filterCategory
        const matchesStatus = filterStatus === "all" || course.status.toLowerCase() === filterStatus.toLowerCase()
        return matchesSearch && matchesCategory && matchesStatus
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterCategory, filterStatus])

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCoursesList = filteredCourses.slice(indexOfFirstItem, indexOfLastItem)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Manage Courses</h1>
                    <p className="text-text-secondary">View and manage all platform courses</p>
                </div>

                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title or instructor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-lg card-shadow overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">Loading courses...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Course</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Instructor</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Category</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Students</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Revenue</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Rating</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCoursesList.map((course) => (
                                        <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={course.image}
                                                        alt={course.title}
                                                        className="w-16 h-16 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-foreground max-w-xs truncate">
                                                            {course.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">{course.instructor}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                    {course.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published" ? "bg-green-100 text-green-700" :
                                                            course.status === "Pending" ? "bg-orange-100 text-orange-700" :
                                                                "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-foreground">
                                                    <Users size={16} className="text-text-secondary" />
                                                    {course.students}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-success font-semibold">
                                                    <DollarSign size={16} />
                                                    {course.revenue.replace("$", "")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground">⭐ {course.rating}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleView(course.id)}
                                                        className="p-2 text-text-secondary hover:text-primary transition"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="p-2 text-text-secondary hover:text-red-500 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoading && filteredCourses.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
                            <div className="text-sm text-text-secondary">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredCourses.length)}</span> of <span className="font-medium">{filteredCourses.length}</span> courses
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 text-sm font-medium rounded-lg transition ${
                                                currentPage === i + 1
                                                    ? "bg-primary text-white"
                                                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Details Modal */}
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
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                        {selectedCourse.lessons.indexOf(selectedLesson) + 1}
                                                    </span>
                                                    <h2 className="text-lg font-bold text-foreground leading-tight">{selectedLesson.title}</h2>
                                                </div>
                                                <p className="text-text-secondary leading-relaxed text-sm">
                                                    {selectedLesson.description || "No description provided."}
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

export default ManageCourses
