"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, BookOpen, Users, Star } from "lucide-react"
import { getCourses } from "../services/api"

const Courses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const categories = [
        "All",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Design",
        "Business",
        "Marketing"
    ]

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses()
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

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
        // Only show published courses in public catalog (if status exists)
        // If course.published is undefined, show it? Better to assume draft unless published=true.
        // But for MVP if published is missing, maybe show all?
        // Let's filter by published === true if the field exists.
        const isPublished = course.published === true
        return matchesSearch && matchesCategory && isPublished
    })

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Explore Our Courses</h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Discover a wide range of courses taught by expert instructors.
                        Start your learning journey today.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                    </div>

                    {/* Categories Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto ">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap transform hover:scale-105 ${selectedCategory === cat
                                        ? "bg-blue-50 text-primary shadow-md"
                                        : "bg-white text-text-secondary hover:bg-blue-50 hover:text-primary "
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                        <p className="mt-2 text-text-secondary">Loading courses...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                        <p className="text-text-secondary">Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                onClick={() => navigate(`/login`)} // For now redirect to login, ideally to course details
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm text-primary">
                                        {course.level}
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        {course.averageRating ? Number(course.averageRating).toFixed(1) : "New"}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{course.category}</span>
                                        <span className="text-lg font-bold text-success">${course.price}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {course.title}
                                    </h3>

                                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {course.instructor?.name?.charAt(0) || "I"}
                                            </div>
                                            <span className="text-sm text-foreground font-medium truncate max-w-[100px]">
                                                {course.instructor?.name || "Instructor"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-text-secondary text-xs">
                                            <Users size={14} />
                                            <span>{course.students?.length || 0} enrolled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Courses
