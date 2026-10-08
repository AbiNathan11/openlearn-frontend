import toast from 'react-hot-toast';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, Users, DollarSign, BookOpen } from "lucide-react"
import { getInstructorCourses, deleteCourse } from "../../services/api"
import ConfirmModal from "../../components/ConfirmModal"

const MyCourses = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState("grid") // 'grid' or 'list'
    const [statusFilter, setStatusFilter] = useState("All")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)

    const navigate = useNavigate()

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const response = await getInstructorCourses()
            if (response.success) {
                const mappedCourses = response.data.map(course => ({
                    ...course,
                    id: course._id,
                    enrolledStudents: course.students?.length || 0,
                    revenue: `$${((course.students?.length || 0) * (course.price || 0)).toLocaleString()}`,
                    rating: course.averageRating || 0,
                    status: course.status === "Pending" ? "Approval Pending" : (course.status || "Draft"),
                    image: course.thumbnail
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

    const handleEdit = (courseId, courseStatus) => {
        if (courseStatus === "Rejected") {
            toast("This course has been rejected and cannot be edited. Please contact support for assistance.");
            return;
        }
        navigate(`/instructor/edit-course/${courseId}`)
    }

    const isEditDisabled = (courseStatus) => courseStatus === "Rejected";

    const handleDelete = (courseId) => {
        setCourseToDelete(courseId)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        try {
            await deleteCourse(courseToDelete)
            setCourses((prev) => prev.filter((course) => course.id !== courseToDelete))
            toast("Course deleted successfully")
        } catch (error) {
            console.error("Delete course failed:", error)
            toast("Failed to delete course: " + (error.response?.data?.message || error.message))
        }
    }

    const filteredCourses = statusFilter === "All"
        ? courses
        : courses.filter(course => course.status === statusFilter)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
                        <p className="text-text-secondary">Manage and edit your courses</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Approval Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="grid">Grid View</option>
                            <option value="list">List View</option>
                        </select>
                        <a href="/instructor/add-course" className="btn-primary">
                            Add New Course
                        </a>
                    </div>
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
                    <>
                        {viewMode === "grid" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition flex flex-col"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-gray-200">
                                            {course.image ? (
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <BookOpen size={48} />
                                                </div>
                                            )}
                                            <span
                                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                                                    ? "bg-green-100 text-green-700"
                                                    : course.status === "Approval Pending"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : course.status === "Rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {course.status}
                                            </span>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                                                {course.title}
                                            </h3>

                                            <div className="space-y-2 mb-4 flex-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-text-secondary flex items-center gap-1">
                                                        <Users size={16} />
                                                        Students:
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {course.enrolledStudents}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-text-secondary flex items-center gap-1">
                                                        <DollarSign size={16} />
                                                        Revenue:
                                                    </span>
                                                    <span className="font-semibold text-success">{course.revenue}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-text-secondary">Rating:</span>
                                                    <span className="font-semibold text-foreground">⭐ {course.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    onClick={() => handleEdit(course.id, course.status)}
                                                    disabled={isEditDisabled(course.status)}
                                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition text-sm ${
                                                        isEditDisabled(course.status)
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-100 text-text-primary hover:bg-gray-200"
                                                    }`}
                                                >
                                                    <Edit size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {viewMode === "list" && (
                            <div className="bg-white rounded-lg card-shadow overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Course</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Students</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Revenue</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Rating</th>
                                            <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCourses.map((course) => (
                                            <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                                            {course.image ? (
                                                                <img
                                                                    src={course.image}
                                                                    alt={course.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <BookOpen size={24} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-foreground">{course.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                                                            ? "bg-green-100 text-green-700"
                                                            : course.status === "Approval Pending"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : course.status === "Rejected"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                            }`}
                                                    >
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-foreground">{course.enrolledStudents}</td>
                                                <td className="px-6 py-4 text-success font-semibold">{course.revenue}</td>
                                                <td className="px-6 py-4 text-foreground">⭐ {course.rating}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(course.id, course.status)}
                                                            disabled={isEditDisabled(course.status)}
                                                            className={`p-2 transition ${
                                                                isEditDisabled(course.status)
                                                                    ? "text-gray-400 cursor-not-allowed"
                                                                    : "text-text-secondary hover:text-primary"
                                                            }`}
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
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
                    </>
                )}
            </div>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Course?"
                message="Are you sure you want to delete this course? This action cannot be undone and all student progress will be lost."
                confirmText="Delete Course"
                type="danger"
            />
        </div>
    )
}

export default MyCourses
