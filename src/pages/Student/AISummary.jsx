import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Sparkles, BookOpen, Loader2 } from "lucide-react"
import { getStudentCourses, generateAISummary } from "../../services/api"
import jsPDF from "jspdf"

const AISummary = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState("")
    const [selectedLesson, setSelectedLesson] = useState("")
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fetchingCourses, setFetchingCourses] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getStudentCourses()
                if (response.success) {
                    setCourses(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error)
            } finally {
                setFetchingCourses(false)
            }
        }

        fetchCourses()
    }, [])

    const handleDownloadPDF = () => {
        if (!summary) return

        const doc = new jsPDF();
        let yPos = 20;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        const checkPageBreak = (addedHeight) => {
            if (yPos + addedHeight > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
        };

        // Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(`AI Summary: ${summary.title}`, 170);
        doc.text(titleLines, margin, yPos);
        yPos += (titleLines.length * 7) + 5;

        // Key Points
        doc.setFontSize(14);
        doc.text("Key Takeaways:", margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        summary.keyPoints.forEach((point, idx) => {
            const pointText = `${idx + 1}. ${point}`;
            const lines = doc.splitTextToSize(pointText, 170);
            checkPageBreak(lines.length * 7);
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 7) + 3;
        });
        yPos += 5;

        // Detailed Summary
        checkPageBreak(25);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Summary:", margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const summaryLines = doc.splitTextToSize(summary.detailedSummary, 170);
        
        summaryLines.forEach(line => {
            checkPageBreak(7);
            doc.text(line, margin, yPos);
            yPos += 7;
        });
        yPos += 5;

        // Resources
        checkPageBreak(25);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Recommended Resources:", margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        summary.resources.forEach((resource, idx) => {
            const resText = `${idx + 1}. ${resource}`;
            const lines = doc.splitTextToSize(resText, 170);
            checkPageBreak(lines.length * 7);
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 7) + 3;
        });

        // Date
        yPos += 10;
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);

        // Download
        const filename = `${summary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`;
        doc.save(filename);
    }

    const handleGenerateSummary = async () => {
        console.log('=== AI Summary Button Clicked ===');
        
        if (!selectedCourse || !selectedLesson) {
            toast("Please select both a course and a lesson")
            return
        }

        console.log('=== Starting AI Summary Generation ===');
        setLoading(true)
        
        try {
            console.log('=== Frontend AI Summary Request ===');
            console.log('Selected Course:', selectedCourse);
            console.log('Selected Lesson:', selectedLesson);
            
            const token = localStorage.getItem("token");
            console.log('Token exists:', !!token);
            console.log('Token length:', token?.length);
            
            if (!token) {
                toast("Please log in to generate AI summaries")
                return
            }
            
            console.log('=== Making API Call ===');
            const response = await generateAISummary(selectedCourse, selectedLesson)
            console.log('=== Frontend Response ===');
            console.log('Response:', response);
            
            if (response.success) {
                setSummary(response.data)
            } else {
                if (response.hasMediaContent === false) {
                    toast("This lesson does not contain video or PDF materials to summarize. Please select a lesson that has video or PDF content.")
                } else {
                    toast(response.message || "Failed to generate summary")
                }
            }
        } catch (error) {
            console.error("=== Frontend Error ===");
            console.error("Error:", error);
            console.error("Error response:", error.response);
            toast("Failed to generate summary. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const getSelectedCourse = () => courses.find(course => course._id === selectedCourse)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="text-success" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">AI Lesson Summary</h1>
                            <p className="text-sm text-text-secondary">
                                Generate AI-powered summaries of your lessons
                            </p>
                        </div>
                    </div>
                </div>

                {/* Selection Form */}
                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <h2 className="text-lg font-bold text-foreground mb-4">Select Lesson</h2>
                    <div className="space-y-4">
                        {/* Course Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Course</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => {
                                    setSelectedCourse(e.target.value)
                                    setSelectedLesson("")
                                    setSummary(null)
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                disabled={fetchingCourses}
                            >
                                <option value="">Select a course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lesson Selection */}
                        {selectedCourse && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Lesson</label>
                                <select
                                    value={selectedLesson}
                                    onChange={(e) => {
                                        setSelectedLesson(e.target.value)
                                        setSummary(null)
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                >
                                    <option value="">Select a lesson</option>
                                    {getSelectedCourse()?.lessons?.map((lesson) => (
                                        <option key={lesson._id} value={lesson._id}>
                                            {lesson.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerateSummary}
                            disabled={!selectedCourse || !selectedLesson || loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating Summary...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate AI Summary
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Summary Display */}
                {summary && (
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">{summary.title}</h2>
                            <button 
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 text-primary hover:text-primary-dark transition"
                            >
                                <Download size={20} />
                                <span className="text-sm font-medium">Download PDF</span>
                            </button>
                        </div>

                        {/* Key Points */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" />
                                Key Takeaways
                            </h3>
                            <ul className="space-y-2">
                                {summary.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-success text-sm font-bold">{idx + 1}</span>
                                        </div>
                                        <span className="text-text-primary">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Detailed Summary */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-foreground mb-3">Detailed Summary</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-text-primary leading-relaxed">{summary.detailedSummary}</p>
                            </div>
                        </div>

                        {/* Additional Resources */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">Recommended Resources</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {summary.resources.map((resource, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary transition"
                                    >
                                        <FileText size={20} className="text-primary" />
                                        <span className="text-sm text-foreground">{resource}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* Info Box */}
                {!summary && !loading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Sparkles className="mx-auto text-primary mb-3" size={48} />
                        <h3 className="font-semibold text-foreground mb-2">AI-Powered Summaries</h3>
                        <p className="text-sm text-text-secondary">
                            Select a course and lesson above to generate an AI summary. Our AI will analyze the
                            content and provide you with key takeaways, detailed explanations, and additional
                            resources.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AISummary
