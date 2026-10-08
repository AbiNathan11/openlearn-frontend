import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react'
import { Brain, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { generateQuizQuestions, getStudentCourses } from "../../services/api"

const Quiz = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState('')
    const [quizQuestions, setQuizQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchingCourses, setFetchingCourses] = useState(true)
    const [quizStarted, setQuizStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300)
    const [timerActive, setTimerActive] = useState(false)

    useEffect(() => {
        fetchCourses()
    }, [])

    useEffect(() => {
        let interval = null
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleSubmitQuiz()
        }
        return () => clearInterval(interval)
    }, [timerActive, timeLeft])

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

    const handleGenerateQuiz = async () => {
        if (!selectedCourse) {
            toast("Please select a course")
            return
        }

        setLoading(true)
        try {
            const response = await generateQuizQuestions(selectedCourse, 5)
            if (response.success) {
                setQuizQuestions(response.data.questions)
                setQuizStarted(true)
                setTimerActive(true)
                setTimeLeft(300)
            } else {
                toast(response.message || "Failed to generate quiz questions")
            }
        } catch (error) {
            console.error("Error generating quiz:", error)
            toast("Failed to generate quiz questions. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerSelect = (answerIndex) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestion] = answerIndex
        setSelectedAnswers(newAnswers)
    }

    const handleNextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            handleSubmitQuiz()
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const handleSubmitQuiz = () => {
        setTimerActive(false)
        setShowResults(true)
    }

    const calculateScore = () => {
        let correct = 0
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++
            }
        })
        return correct
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getScoreColor = (score) => {
        const percentage = (score / quizQuestions.length) * 100
        if (percentage >= 80) return 'text-green-600'
        if (percentage >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const resetQuiz = () => {
        setCurrentQuestion(0)
        setSelectedAnswers([])
        setShowResults(false)
        setQuizStarted(false)
        setTimeLeft(300)
        setTimerActive(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="text-primary" size={48} />
                        <h1 className="text-3xl font-bold text-foreground">AI Quiz</h1>
                    </div>
                    <p className="text-text-secondary">
                        Test your knowledge with AI-generated quizzes based on your completed lessons
                    </p>
                </div>

                {/* Course Selection */}
                {!quizStarted && (
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <h2 className="text-xl font-semibold mb-4">Select Course</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Choose a course to generate quiz questions
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                disabled={fetchingCourses}
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateQuiz}
                            disabled={!selectedCourse || loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating Quiz...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Start Quiz
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Quiz Interface */}
                {quizStarted && !showResults && (
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        {/* Quiz Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Clock className="text-primary" size={20} />
                                <span className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-foreground'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <div className="text-sm text-text-secondary">
                                Question {currentQuestion + 1} of {quizQuestions.length}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {quizQuestions[currentQuestion]?.question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {quizQuestions[currentQuestion]?.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                            selectedAnswers[currentQuestion] === index
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                selectedAnswers[currentQuestion] === index
                                                    ? 'border-primary bg-primary'
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedAnswers[currentQuestion] === index && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span className="text-foreground">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3">
                            <button
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestion === 0}
                                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextQuestion}
                                disabled={selectedAnswers[currentQuestion] === undefined}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentQuestion === quizQuestions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {showResults && (
                    <div className="bg-white rounded-lg p-6 card-shadow text-center">
                        <div className="mb-6">
                            {calculateScore() >= quizQuestions.length * 0.8 ? (
                                <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
                            ) : (
                                <AlertCircle className="text-yellow-600 mx-auto mb-4" size={64} />
                            )}
                            <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
                            <p className={`text-lg font-semibold ${getScoreColor(calculateScore())}`}>
                                Your Score: {calculateScore()} out of {quizQuestions.length}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-foreground mb-4">Question Review</h3>
                            <div className="space-y-4">
                                {quizQuestions.map((question, index) => (
                                    <div key={index} className="text-left p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold">Q{index + 1}:</span>
                                            <span>{question.question}</span>
                                            {selectedAnswers[index] === question.correctAnswer ? (
                                                <CheckCircle className="text-green-600" size={16} />
                                            ) : (
                                                <AlertCircle className="text-red-600" size={16} />
                                            )}
                                        </div>
                                        <div className="text-sm text-text-secondary ml-8">
                                            <p>Your answer: {question.options[selectedAnswers[index]]}</p>
                                            {selectedAnswers[index] !== question.correctAnswer && (
                                                <p className="text-green-600">
                                                    Correct answer: {question.options[question.correctAnswer]}
                                                </p>
                                            )}
                                            <p className="text-gray-600 mt-1">{question.explanation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={resetQuiz} className="btn-secondary flex-1">
                                Try Another Quiz
                            </button>
                            <button onClick={() => window.history.back()} className="btn-primary flex-1">
                                Back to Courses
                            </button>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                {!quizStarted && !loading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Brain className="mx-auto text-primary mb-3" size={48} />
                        <h3 className="font-semibold text-foreground mb-2">AI-Powered Quizzes</h3>
                        <p className="text-sm text-text-secondary">
                            Select a course above to generate a quiz. Our AI will create questions based on the lessons you've completed in that course.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Quiz
