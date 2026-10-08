import toast from 'react-hot-toast';
"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, Plus, FileText, Video, Trash2 } from "lucide-react"
import { createCourse } from "../../services/api"
import axios from "axios"

const AddCourse = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        level: "Beginner",
        published: "false",
    })

    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lessons, setLessons] = useState([])
    const [uploadingFiles, setUploadingFiles] = useState({})
    const formRef = useRef(null)

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

    // Add a new lesson
    const addLesson = () => {
        setLessons([
            ...lessons,
            {
                id: Date.now(),
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

    // Remove a lesson
    const removeLesson = (id) => {
        setLessons(lessons.filter((lesson) => lesson.id !== id))
    }

    // Update lesson field
    const updateLesson = (id, updates) => {
        setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson.id === id ? { ...lesson, ...updates } : lesson
            )
        )
    }

    // Upload file to backend
    const uploadFile = async (file, lessonId, fileType) => {
        const token = localStorage.getItem("token") // Ensure token exists

        // Simple validation
        if (!file) return null;

        const formData = new FormData()
        formData.append("file", file)

        setUploadingFiles((prev) => ({ ...prev, [`${lessonId}-${fileType}`]: true }))

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/upload`,
                formData,
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
            // Show more specific error if available
            const errorMsg = error.response?.data?.message || `Failed to upload ${fileType}`;
            toast(errorMsg);
            return null
        } finally {
            setUploadingFiles((prev) => ({ ...prev, [`${lessonId}-${fileType}`]: false }))
        }
    }

    // Handle video file selection
    const handleVideoUpload = async (lessonId, file) => {
        if (file) {
            updateLesson(lessonId, { videoFile: file }) // Update UI immediately
            const url = await uploadFile(file, lessonId, "video")
            if (url) {
                updateLesson(lessonId, { videoUrl: url })
            } else {
                // If upload failed, clear the file/UI
                updateLesson(lessonId, { videoFile: null, videoUrl: "" })
            }
        }
    }

    // Handle PDF file selection
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

    const handleSubmit = async (e, shouldPublish = false) => {
        e.preventDefault()

        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity()
            return
        }

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

            // Prepare lessons data
            const lessonsData = lessons.map((lesson) => ({
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                pdfUrl: lesson.pdfUrl,
                duration: Number(lesson.duration) || 0,
            }))

            const coursePayload = {
                ...formData,
                price: Number(formData.price),
                duration: Number(formData.duration),
                level: formData.level.charAt(0).toUpperCase() + formData.level.slice(1),
                thumbnail: thumbnailBase64,
                lessons: lessonsData,
                published: shouldPublish,
            }

            await createCourse(coursePayload)
            toast("Course created successfully!")
            navigate("/instructor/dashboard")
        } catch (error) {
            console.error("Course creation failed:", error)
            toast("Failed to create course: " + error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create New Course</h1>
                    <p className="text-text-secondary">Fill in the details to create your course</p>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={(e) => handleSubmit(e, true)} className="bg-white rounded-lg p-8 card-shadow">
                    <div className="space-y-6">
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
                                placeholder="e.g., Complete Web Development Bootcamp"
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
                                placeholder="Describe what students will learn in this course..."
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
                                    placeholder="49.99"
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
                                    placeholder="10"
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
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    required
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>



                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Course Thumbnail *
                            </label>
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
                                            Click to upload course thumbnail
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
                                            Choose File
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
                                    <p className="text-gray-500 mb-2">No lessons added yet</p>
                                    <p className="text-sm text-gray-400">Click "Add Lesson" to create your first lesson</p>
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
                                                        Lesson Video *
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                                                        {lesson.videoFile ? (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-foreground flex items-center gap-2">
                                                                    <Video size={16} />
                                                                    {lesson.videoFile.name}
                                                                    {uploadingFiles[`${lesson.id}-video`] && (
                                                                        <span className="text-blue-500">(Uploading...)</span>
                                                                    )}
                                                                    {lesson.videoUrl && (
                                                                        <span className="text-green-500">✓ Uploaded</span>
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
                                                        {lesson.pdfFile ? (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-foreground flex items-center gap-2">
                                                                    <FileText size={16} />
                                                                    {lesson.pdfFile.name}
                                                                    {uploadingFiles[`${lesson.id}-pdf`] && (
                                                                        <span className="text-blue-500">(Uploading...)</span>
                                                                    )}
                                                                    {lesson.pdfUrl && (
                                                                        <span className="text-green-500">✓ Uploaded</span>
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
                                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Save Draft"}
                            </button>
                            <button
                                type="submit"
                                onClick={(e) => handleSubmit(e, true)}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#0066cc' }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Submit for Approval"}
                            </button>
                            <a href="/instructor/dashboard" className="btn-secondary flex-1 text-center">
                                Cancel
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCourse
