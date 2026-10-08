import { useState, useEffect } from "react"
import { BookOpen, Star } from "lucide-react"
import { getStudentCourses } from "../../services/api"

const MyCourses = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getStudentCourses()
                if (response.success) {
                    // Backend now includes progress data directly
                    const coursesWithProgress = response.data.map(course => ({
                        id: course._id,
                        title: course.title,
                        instructor: course.instructor?.name || "Unknown Instructor",
                        progress: course.progress || 0,
                        rating: course.averageRating || 0,
                        totalLessons: course.lessons?.length || 0,
                        completedLessons: course.completedCount || 0,
                        image: course.thumbnail
                    }))
                    setCourses(coursesWithProgress)
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Courses</h1>
                    <p className="text-text-secondary">Continue learning from where you left off</p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-12">Loading courses...</div>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary">
                                        {course.progress}% Complete
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                                    <p className="text-sm text-text-secondary mb-4">by {course.instructor}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-text-secondary">Progress</span>
                                            <span className="text-sm font-bold text-primary">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{ backgroundColor: '#0066cc', width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm mb-4">
                                        <div className="flex items-center gap-1 text-text-secondary">
                                            <BookOpen size={16} />
                                            <span>
                                                {course.completedLessons}/{course.totalLessons} Lessons
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-0.5 text-text-secondary">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="text-sm font-semibold text-foreground ml-1">{course.rating || "0.0"}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <a
                                        href={`/student/course/${course.id}`}
                                        className={`w-full text-center block py-2 rounded-lg transition-colors ${
                                            course.progress === 100 
                                                ? 'bg-transparent text-primary border border-primary hover:bg-primary/5 font-semibold' 
                                                : 'btn-primary'
                                        }`}
                                    >
                                        {course.progress === 100 ? 'Completed' : 'Continue Learning'}
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Empty State (if no courses) */}
                {!isLoading && courses.length === 0 && (
                    <div className="bg-white rounded-lg p-12 card-shadow text-center">
                        <BookOpen className="mx-auto text-text-muted mb-4" size={64} />
                        <h3 className="text-xl font-bold text-foreground mb-2">No Courses Yet</h3>
                        <p className="text-text-secondary mb-6">
                            Start your learning journey by enrolling in a course
                        </p>
                        <a href="/" className="btn-primary inline-block">
                            Browse Courses
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyCourses
