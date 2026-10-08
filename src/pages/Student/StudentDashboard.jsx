import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { BookOpen, Clock, Award, TrendingUp, User, Star, PlayCircle, CheckCircle } from "lucide-react"
import { getEnrolledCourses, getCourses, getCourseProgress, enrollCourse, getStudentDashboardStats } from "../../services/api"
import { verifyStudentAuth } from "../../utils/auth"

const StudentDashboard = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [availableCourses, setAvailableCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [statsData, setStatsData] = useState({
        enrolledCourses: 0,
        learningHours: 0,
        completedCourses: 0,
        overallProgress: 0
    })

    const fetchData = async () => {
        setIsLoading(true)
        try {
            // Fetch enrolled, all courses, and stats in parallel
            const [enrolledRes, allRes, statsRes] = await Promise.all([
                getEnrolledCourses(),
                getCourses(),
                getStudentDashboardStats()
            ])

            let enrolled = []
            if (enrolledRes.success) {
                // Fetch progress for each enrolled course
                enrolled = await Promise.all(
                    enrolledRes.data.map(async (course) => {
                        try {
                            const progressResponse = await getCourseProgress(course._id)
                            const progressData = progressResponse.success ? progressResponse.data : { completedLessons: [], completedCount: 0 }
                            
                            return {
                                ...course,
                                instructorName: course.instructor?.name || "Instructor",
                                image: course.thumbnail,
                                progress: course.lessons?.length ? Math.round((progressData.completedCount / course.lessons.length) * 100) : 0,
                                completedLessons: progressData.completedCount,
                                totalLessons: course.lessons?.length || 0
                            }
                        } catch (error) {
                            console.error(`Failed to fetch progress for course ${course._id}:`, error)
                            return {
                                ...course,
                                instructorName: course.instructor?.name || "Instructor",
                                image: course.thumbnail,
                                progress: 0,
                                completedLessons: 0,
                                totalLessons: course.lessons?.length || 0
                            }
                        }
                    })
                )
                setEnrolledCourses(enrolled)
            }

            if (allRes.success) {
                // Filter out courses user is already enrolled in
                const enrolledIds = new Set(enrolled.map(c => c._id))
                const available = allRes.data
                    .filter(c => !enrolledIds.has(c._id) && c.published)
                    .map(c => ({
                        ...c,
                        instructorName: c.instructor?.name || "Instructor",
                        image: c.thumbnail,
                        totalLessons: c.lessons?.length || 0
                    }))
                setAvailableCourses(available)
            }

            if (statsRes.success) {
                setStatsData(statsRes.data)
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Verify student authentication first
        verifyStudentAuth().then(result => {
            console.log('Student Auth Verification Result:', result);
            if (!result.valid) {
                console.error('Authentication Error:', result.error);
                toast('Authentication Error: ' + result.error);
            }
        });
        
        fetchData();
    }, [])

    const handleEnroll = async (courseId) => {
        try {
            const res = await enrollCourse(courseId)
            if (res?.url) {
                window.location.href = res.url
                return
            }
            toast(res?.message || "Unable to start checkout")
        } catch (error) {
            console.error(error)
            toast("Enrollment failed: " + error)
        }
    }


    const stats = [
        { icon: BookOpen, label: "Enrolled Courses", value: statsData.enrolledCourses, color: "text-primary" },
        { icon: Clock, label: "Learning Hours", value: statsData.learningHours, color: "text-primary" },
        { icon: Award, label: "Completed Courses", value: statsData.completedCourses, color: "text-primary" },
        { icon: TrendingUp, label: "Overall Progress", value: `${statsData.overallProgress}%`, color: "text-primary" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name || "Student"}!</h1>
                            <p className="text-text-secondary">Continue your learning journey</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <div key={idx} className="bg-white rounded-lg p-6 card-shadow">
                                <div className={`${stat.color} mb-3`}>
                                    <Icon size={32} />
                                </div>
                                <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Enrolled Courses Section */}
                <div className="bg-white rounded-lg p-6 card-shadow mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">My Enrolled Courses</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : enrolledCourses.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary border-2 border-dashed rounded-lg">
                            You haven't enrolled in any courses yet. Check out the available courses below!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => (
                                <div
                                    key={course._id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden bg-gray-100">
                                        {course.image ? (
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <BookOpen size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div 
                                        className="p-5 flex-1 flex flex-col cursor-pointer"
                                        onClick={() => navigate(`/student/course/${course._id}`)}
                                    >
                                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">{course.title}</h3>
                                        <p className="text-sm text-text-secondary">by {course.instructorName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Explore Courses Section (New) */}
                <div className="bg-white rounded-lg p-6 card-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Explore New Courses</h2>
                        <button onClick={() => navigate("/courses")} className="text-primary hover:underline font-medium">
                            View All
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : availableCourses.length === 0 ? (
                        <p className="text-text-secondary">No new courses available at the moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableCourses.slice(0, 3).map((course) => ( // Show top 3
                                <div
                                    key={course._id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden bg-gray-100 relative">
                                        {course.image ? (
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <BookOpen size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-primary shadow-sm">
                                            {course.level}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-text-secondary">by {course.instructorName}</p>
                                            <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded shadow-sm border border-yellow-100">
                                                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                                {course.averageRating || 0}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{course.title}</h3>
                                        <div className="text-lg font-bold text-success mb-3">${course.price}</div>

                                        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{course.description}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => handleEnroll(course._id)}
                                                className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-medium"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
