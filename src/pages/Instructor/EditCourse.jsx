import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Upload, X, ArrowLeft, Plus, Trash2, Video, FileText } from "lucide-react"
import axios from "axios"
import { getCourseById, updateCourse } from "../../services/api"

const EditCourse = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        level: "Beginner",
        published: "false",
    })

    const [lessons, setLessons] = useState([])
    const [uploadingFiles, setUploadingFiles] = useState({})
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [existingThumbnail, setExistingThumbnail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const isPublished = formData.status === "Published" || formData.status === "Pending"; // Treat pending as published for locking purposes? Or just Published? User said "published". Let's stick to Published status check from backend, but formData might only have 'published' boolean. 

    // Let's rely on the actual status string from the backend which I mapped to state in lines 46-53? 
    // Wait, the state only has 'published' boolean string "true"/"false".
    // I need to store the actual status.
    const [courseStatus, setCourseStatus] = useState("")

    const categories = [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "Design",
        "Business",
        "Marketing",
        "Photography",
    ]

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await getCourseById(id)
                if (response.success) {
                    const course = response.data
                    setFormData({
                        title: course.title || "",
                        description: course.description || "",
                        category: course.category || "",
                        price: course.price || "",
                        duration: course.duration || "",
                        level: course.level || "Beginner",
                        published: course.published ? "true" : "false",
                    })
                    setCourseStatus(course.status)
                    setExistingThumbnail(course.thumbnail || "")

                    // Populate lessons
                    if (course.lessons && Array.isArray(course.lessons)) {
                        const mappedLessons = course.lessons.map(lesson => ({
                            id: lesson._id, // Keep original ID for updates
                            title: lesson.title,
                            description: lesson.description || "",
                            videoUrl: lesson.videoUrl || "",
                            pdfUrl: lesson.pdfUrl || "",
                            duration: lesson.duration || "",
                            videoFile: null,
                            pdfFile: null
                        }));
                        setLessons(mappedLessons);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch course:", error)
                toast("Failed to load course details")
                navigate("/instructor/my-courses")
            } finally {
                setIsFetching(false)
            }
        }
        fetchCourse()
    }, [id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbnailFile(file)
        }
    }

    // --- Lesson Management ---

    const addLesson = () => {
        setLessons([
            ...lessons,
            {
                id: `new-${Date.now()}`, // Temporary ID for new lessons
                title: "",
                description: "",
                videoFile: null,
                videoUrl: "",
                pdfFile: null,
                pdfUrl: "",
                duration: "",
            },
        ])
    }

    const removeLesson = (lessonId) => {
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId))
    }

    // Update lesson field with object syntax support
    const updateLesson = (id, updates) => {
        setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, ...updates } : lesson
            )
        )
    }

    const uploadFile = async (file, lessonId, fileType) => {
        const token = localStorage.getItem("token")
        if (!file) return null;

        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        setUploadingFiles((prev) => ({ ...prev, [`${lessonId}-${fileType}`]: true }))

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/upload`,
                uploadFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            if (response.data.success) {
                return response.data.data.url
            }
        } catch (error) {
            console.error(`Failed to upload ${fileType}:`, error)
            const errorMsg = error.response?.data?.message || `Failed to upload ${fileType}`;
            toast(errorMsg);
            return null
        } finally {
            setUploadingFiles((prev) => ({ ...prev, [`${lessonId}-${fileType}`]: false }))
        }
    }

    const handleVideoUpload = async (lessonId, file) => {
        if (file) {
            updateLesson(lessonId, { videoFile: file })
            const url = await uploadFile(file, lessonId, "video")
            if (url) {
                updateLesson(lessonId, { videoUrl: url })
            } else {
                updateLesson(lessonId, { videoFile: null, videoUrl: "" })
            }
        }
    }

    const handlePdfUpload = async (lessonId, file) => {
        if (file) {
            updateLesson(lessonId, { pdfFile: file })
            const url = await uploadFile(file, lessonId, "pdf")
            if (url) {
                updateLesson(lessonId, { pdfUrl: url })
            } else {
                updateLesson(lessonId, { pdfFile: null, pdfUrl: "" })
            }
        }
    }

    // --- Submit ---

    const handleSubmit = async (e, shouldPublish = false) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let thumbnailBase64 = ""
            if (thumbnailFile) {
                thumbnailBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(thumbnailFile)
                })
            }

            // Prepare lessons payload
            const lessonsData = lessons.map(lesson => {
                const lessonPayload = {
                    title: lesson.title,
                    description: lesson.description,
                    videoUrl: lesson.videoUrl,
                    pdfUrl: lesson.pdfUrl,
                    duration: Number(lesson.duration) || 0,
                };

                // If ID is not a temp "new-" ID, include it as _id for update
                if (!lesson.id.toString().startsWith("new-")) {
                    lessonPayload._id = lesson.id;
                }

                return lessonPayload;
            });

            const coursePayload = {
                ...formData,
                price: Number(formData.price),
                duration: Number(formData.duration),
                level: formData.level.charAt(0).toUpperCase() + formData.level.slice(1),
                published: shouldPublish,
                lessons: lessonsData
            }

            if (thumbnailBase64) {
                coursePayload.thumbnail = thumbnailBase64
            }

            await updateCourse(id, coursePayload)
            toast("Course updated successfully!")
            navigate("/instructor/my-courses")

        } catch (error) {
            console.error("Course update failed:", error)
            toast("Failed to update course: " + error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600">Loading course details...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate("/instructor/my-courses")}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Edit Course</h1>
                        <p className="text-text-secondary">Update your course information</p>
                    </div>
                </div>

                {courseStatus === 'Published' && (
                    <div className="bg-yellow-50 border-1-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    This course is published and cannot be edited. Please contact support if you need to make changes.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form className="bg-white rounded-lg p-8 card-shadow">
                    <fieldset disabled={courseStatus === 'Published'} className="space-y-6">
                        {/* Course Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Course Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                required
                            />
                        </div>

                        {/* Category and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Price (USD) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Duration and Level */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Duration (hours) *
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Level *
                                </label>
                                <select
                                    name="level"
                                    value={formData.level.toLowerCase()}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    required
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Status */}


                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Course Thumbnail
                            </label>
                            {existingThumbnail && !thumbnailFile && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Current Thumbnail:</p>
                                    <img src={existingThumbnail} alt="Current" className="h-32 rounded-lg object-cover border" />
                                </div>
                            )}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
                                {thumbnailFile ? (
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
                                        <span className="text-sm text-foreground">{thumbnailFile.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setThumbnailFile(null)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                        <p className="text-text-secondary mb-2">
                                            Click to update course thumbnail
                                        </p>
                                        <p className="text-sm text-text-muted">PNG, JPG, or JPEG (max. 5MB)</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                            id="thumbnail-upload"
                                        />
                                        <label
                                            htmlFor="thumbnail-upload"
                                            className="btn-primary inline-block mt-4 cursor-pointer"
                                        >
                                            Choose New File
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lessons Section */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-foreground">Course Lessons</h2>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                                    style={{ backgroundColor: '#0066cc' }}
                                >
                                    <Plus size={20} />
                                    Add Lesson
                                </button>
                            </div>

                            {lessons.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500">No lessons added yet. Click "Add Lesson" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-semibold text-foreground">
                                                    Lesson {index + 1}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLesson(lesson.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Lesson Title */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Lesson Title *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) =>
                                                            updateLesson(lesson.id, { title: e.target.value })
                                                        }
                                                        placeholder="e.g., Introduction to React"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                                        required
                                                    />
                                                </div>

                                                {/* Lesson Description */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Lesson Description
                                                    </label>
                                                    <textarea
                                                        value={lesson.description}
                                                        onChange={(e) =>
                                                            updateLesson(lesson.id, { description: e.target.value })
                                                        }
                                                        placeholder="Brief description of this lesson..."
                                                        rows="3"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-white"
                                                    />
                                                </div>

                                                {/* Duration */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Duration (minutes)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={lesson.duration}
                                                        onChange={(e) =>
                                                            updateLesson(lesson.id, { duration: e.target.value })
                                                        }
                                                        placeholder="30"
                                                        min="0"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                                    />
                                                </div>

                                                {/* Video Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        <Video className="inline mr-2" size={16} />
                                                        Lesson Video
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                                                        {lesson.videoUrl || lesson.videoFile ? (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-foreground flex items-center gap-2">
                                                                    <Video size={16} />
                                                                    {lesson.videoFile ? lesson.videoFile.name : "Current Video"}
                                                                    {uploadingFiles[`${lesson.id}-video`] && (
                                                                        <span className="text-blue-500">(Uploading...)</span>
                                                                    )}
                                                                    {lesson.videoUrl && !uploadingFiles[`${lesson.id}-video`] && (
                                                                        <span className="text-green-500">✓ Ready</span>
                                                                    )}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateLesson(lesson.id, { videoFile: null, videoUrl: "" })
                                                                    }}
                                                                    className="text-red-500 hover:text-red-600"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) =>
                                                                        handleVideoUpload(lesson.id, e.target.files[0])
                                                                    }
                                                                    className="hidden"
                                                                    id={`video-${lesson.id}`}
                                                                />
                                                                <label
                                                                    htmlFor={`video-${lesson.id}`}
                                                                    className="btn-secondary inline-block cursor-pointer text-sm"
                                                                >
                                                                    Choose Video File
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* PDF Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        <FileText className="inline mr-2" size={16} />
                                                        Lesson PDF (Optional)
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                                                        {lesson.pdfUrl || lesson.pdfFile ? (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-foreground flex items-center gap-2">
                                                                    <FileText size={16} />
                                                                    {lesson.pdfFile ? lesson.pdfFile.name : "Current PDF"}
                                                                    {uploadingFiles[`${lesson.id}-pdf`] && (
                                                                        <span className="text-blue-500">(Uploading...)</span>
                                                                    )}
                                                                    {lesson.pdfUrl && !uploadingFiles[`${lesson.id}-pdf`] && (
                                                                        <span className="text-green-500">✓ Ready</span>
                                                                    )}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateLesson(lesson.id, { pdfFile: null, pdfUrl: "" })
                                                                    }}
                                                                    className="text-red-500 hover:text-red-600"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <input
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    onChange={(e) =>
                                                                        handlePdfUpload(lesson.id, e.target.files[0])
                                                                    }
                                                                    className="hidden"
                                                                    id={`pdf-${lesson.id}`}
                                                                />
                                                                <label
                                                                    htmlFor={`pdf-${lesson.id}`}
                                                                    className="btn-secondary inline-block cursor-pointer text-sm"
                                                                >
                                                                    Choose PDF File
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false)}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: isLoading ? '#94a3b8' : '#0066cc' }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>

                            {courseStatus !== 'Published' && courseStatus !== 'Pending' && (
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Submit for Approval"}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => navigate("/instructor/my-courses")}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default EditCourse
