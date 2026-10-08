import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { getAdminDashboardData } from "../../services/api"

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState({
        totalStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        totalRevenue: 0,
        activeUsers: 0,
        totalEnrollments: 0
    })

    const statsArray = [
        {
            icon: Users,
            label: "Total Students",
            value: statsData.totalStudents.toLocaleString(),
            change: "",
            color: "text-primary",
            bgColor: "bg-blue-100",
        },
        {
            icon: GraduationCap,
            label: "Total Instructors",
            value: statsData.totalInstructors.toLocaleString(),
            change: "",
            color: "text-accent",
            bgColor: "bg-cyan-100",
        },
        {
            icon: BookOpen,
            label: "Total Courses",
            value: statsData.totalCourses.toLocaleString(),
            change: "",
            color: "text-success",
            bgColor: "bg-green-100",
        },
        {
            icon: DollarSign,
            label: "Total Revenue",
            value: `$${statsData.totalRevenue.toLocaleString()}`,
            change: "",
            color: "text-warning",
            bgColor: "bg-yellow-100",
        },
        {
            icon: Users, // Using users for activity
            label: "Active Users",
            value: statsData.activeUsers.toLocaleString(),
            change: "",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            icon: TrendingUp,
            label: "Total Enrollments",
            value: statsData.totalEnrollments.toLocaleString(),
            change: "",
            color: "text-pink-600",
            bgColor: "bg-pink-100",
        },
    ]

    const [recentActivities, setRecentActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAllActivities, setShowAllActivities] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdminDashboardData()
                if (data.activities) {
                    setRecentActivities(data.activities)
                }
                if (data.stats) {
                    setStatsData(data.stats)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)
        
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return `${Math.floor(diffInSeconds / 86400)} days ago`
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-text-secondary">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statsArray.map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <div key={idx} className="bg-white rounded-lg p-6 card-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                        <Icon className={stat.color} size={24} />
                                    </div>
                                    <span className="text-success text-sm font-semibold">{stat.change}</span>
                                </div>
                                <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <h2 className="text-xl font-bold text-foreground mb-6">Recent Activities</h2>
                        <div className="space-y-4">
                            {(showAllActivities ? recentActivities : recentActivities.slice(0, 6)).map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-foreground font-medium">{activity.action}</p>
                                        <p className="text-sm text-text-secondary">{activity.user}</p>
                                    </div>
                                    <span className="text-xs text-text-muted">{formatTime(activity.time)}</span>
                                </div>
                            ))}
                            {recentActivities.length === 0 && <p className="text-text-secondary text-sm">No new activities this week.</p>}
                        </div>
                        {recentActivities.length > 6 && (
                            <button
                                onClick={() => setShowAllActivities(!showAllActivities)}
                                className="text-primary text-sm font-medium hover:underline mt-4 inline-block bg-transparent border-none cursor-pointer p-0"
                            >
                                {showAllActivities ? "Show fewer activities ↑" : "View all activities →"}
                            </button>
                        )}
                    </div>
                </div>


            </div>
        </div>
    )
}

export default AdminDashboard
