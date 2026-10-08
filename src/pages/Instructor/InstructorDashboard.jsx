import toast from 'react-hot-toast';

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Users, TrendingUp, Edit, Trash2, Clock, CheckCircle, FileEdit, XCircle, Star } from "lucide-react"
import { getInstructorCourses, deleteCourse } from "../../services/api"
import ConfirmModal from "../../components/ConfirmModal"

const InstructorDashboard = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getInstructorCourses()
                if (response.success) {
                    setCourses(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCourses()
    }, [])

    const totalStudents = courses.reduce((acc, course) => acc + (course.students?.length || 0), 0)
    const totalRevenue = courses.reduce((acc, course) => acc + (course.students?.length || 0) * (course.price || 0), 0)

    const pendingCourses = courses.filter(course => course.status === 'Pending').length
    const publishedCourses = courses.filter(course => course.status === 'Published').length

    const draftCourses = courses.filter(course => course.status === 'Draft' || !course.status).length
    const rejectedCourses = courses.filter(course => course.status === 'Rejected').length

    const averageRating = courses.length > 0 
        ? (courses.reduce((acc, course) => acc + (course.averageRating || 0), 0) / courses.length).toFixed(1)
        : "0.0"

    const stats = [
        {
            icon: BookOpen,
            label: "Total Courses",
            value: courses.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            shadow: "hover:shadow-blue-100"
        },
        {
            icon: CheckCircle,
            label: "Published",
            value: publishedCourses,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            shadow: "hover:shadow-emerald-100"
        },
        {
            icon: Clock,
            label: "Pending",
            value: pendingCourses,
            color: "text-amber-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
            shadow: "hover:shadow-amber-100"
        },
        {
            icon: FileEdit,
            label: "Drafts",
            value: draftCourses,
            color: "text-gray-500",
            bg: "bg-gray-100",
            border: "border-gray-200",
            shadow: "hover:shadow-gray-200"
        },
        {
            icon: XCircle,
            label: "Rejected",
            value: rejectedCourses,
            color: "text-red-500",
            bg: "bg-red-50",
            border: "border-red-100",
            shadow: "hover:shadow-red-100"
        },
        {
            icon: Users,
            label: "Total Students",
            value: totalStudents.toLocaleString(),
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
            shadow: "hover:shadow-purple-100"
        },
        {
            icon: TrendingUp,
            label: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
            shadow: "hover:shadow-teal-100"
        },
        {
            icon: Star,
            label: "Average Rating",
            value: averageRating,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            border: "border-yellow-100",
            shadow: "hover:shadow-yellow-100"
        },
    ]

    const handleEdit = (courseId) => {
        navigate(`/instructor/edit-course/${courseId}`)
    }

    const handleDelete = (courseId) => {
        setCourseToDelete(courseId)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        try {
            await deleteCourse(courseToDelete)
            setCourses((prev) => prev.filter((course) => course._id !== courseToDelete))
            toast("Course deleted successfully")
        } catch (error) {
            console.error("Delete course failed:", error)
            toast("Failed to delete course: " + error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {user.name || "Instructor"}!</h1>
                    <p className="text-gray-600">Manage your courses and track your performance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl p-6 border ${stat.border} shadow-sm ${stat.shadow} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
                            >
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${stat.bg} opacity-20 group-hover:scale-150 transition-transform duration-500`} />
                            </div>
                        )
                    })}
                </div>

                <div className="bg-white rounded-lg p-6 card-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
                        <a href="/instructor/add-course" className="btn-primary">
                            Add New Course
                        </a>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                            <a href="/instructor/add-course" className="btn-primary">
                                Create Your First Course
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition bg-white flex flex-col">
                                    <div className="h-48 overflow-hidden bg-gray-200 relative">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <BookOpen size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                            {course.level}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{course.title}</h3>

                                        <div className="space-y-2 mb-4 flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-text-secondary">Enrolled Students:</span>
                                                <span className="font-semibold text-foreground">{course.students?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-text-secondary">Price:</span>
                                                <span className="font-semibold text-success">${course.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-text-secondary">Rating:</span>
                                                <span className="font-semibold text-foreground">⭐ {course.averageRating || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleEdit(course._id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Course?"
                message="Are you sure you want to delete this course? This action cannot be undone and all student data will be lost."
                confirmText="Delete Course"
                type="danger"
            />
        </div>
    )
}

export default InstructorDashboard
