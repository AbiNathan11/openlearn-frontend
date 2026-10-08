"use client"

import { useState } from "react"
import { Brain, Clock, CheckCircle, XCircle } from "lucide-react"

const StudentQuizPage = () => {
    const [quizStarted, setQuizStarted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)

    const quiz = {
        title: "Web Development Fundamentals - Quiz 1",
        description: "Test your knowledge on HTML, CSS, and JavaScript basics",
        timeLimit: 30,
        totalQuestions: 5,
        passingScore: 70,
    }

    const questions = [
        {
            id: 1,
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
            ],
            correctAnswer: 0,
        },
        {
            id: 2,
            question: "Which CSS property is used to change the text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2,
        },
        {
            id: 3,
            question: "What is the correct syntax for referring to an external JavaScript file?",
            options: [
                '<script src="file.js">',
                '<script href="file.js">',
                '<script name="file.js">',
                '<js src="file.js">',
            ],
            correctAnswer: 0,
        },
        {
            id: 4,
            question: "Which HTML tag is used to define an internal style sheet?",
            options: ["<css>", "<script>", "<style>", "<styles>"],
            correctAnswer: 2,
        },
        {
            id: 5,
            question: "How do you create a function in JavaScript?",
            options: [
                "function myFunction()",
                "function:myFunction()",
                "create myFunction()",
                "def myFunction()",
            ],
            correctAnswer: 0,
        },
    ]

    const handleAnswerSelect = (questionId, answerIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerIndex,
        }))
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const handleSubmit = () => {
        setShowResults(true)
    }

    const calculateScore = () => {
        let correct = 0
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correct++
            }
        })
        return (correct / questions.length) * 100
    }

    if (!quizStarted) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg p-8 card-shadow text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Brain className="text-purple-600" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">{quiz.title}</h1>
                        <p className="text-text-secondary mb-8">{quiz.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-text-secondary mb-1">Questions</p>
                                <p className="text-2xl font-bold text-foreground">{quiz.totalQuestions}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-text-secondary mb-1">Time Limit</p>
                                <p className="text-2xl font-bold text-foreground">{quiz.timeLimit} min</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-text-secondary mb-1">Passing Score</p>
                                <p className="text-2xl font-bold text-foreground">{quiz.passingScore}%</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <h3 className="font-semibold text-foreground mb-2">Instructions:</h3>
                            <ul className="text-sm text-text-primary text-left space-y-1">
                                <li>• Read each question carefully</li>
                                <li>• Select the best answer for each question</li>
                                <li>• You can navigate between questions</li>
                                <li>• Submit when you're ready</li>
                            </ul>
                        </div>

                        <button onClick={() => setQuizStarted(true)} className="btn-primary text-lg px-8 py-3">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (showResults) {
        const score = calculateScore()
        const passed = score >= quiz.passingScore

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg p-8 card-shadow text-center">
                        <div
                            className={`w-20 h-20 ${passed ? "bg-green-100" : "bg-red-100"
                                } rounded-full flex items-center justify-center mx-auto mb-6`}
                        >
                            {passed ? (
                                <CheckCircle className="text-success" size={40} />
                            ) : (
                                <XCircle className="text-red-500" size={40} />
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {passed ? "Congratulations!" : "Keep Practicing!"}
                        </h1>
                        <p className="text-text-secondary mb-8">
                            {passed ? "You passed the quiz!" : "You didn't pass this time, but don't give up!"}
                        </p>

                        <div className="bg-gray-50 rounded-lg p-8 mb-8">
                            <p className="text-sm text-text-secondary mb-2">Your Score</p>
                            <p className="text-6xl font-bold text-primary mb-4">{score.toFixed(0)}%</p>
                            <p className="text-text-secondary">
                                {questions.filter((q) => answers[q.id] === q.correctAnswer).length} out of{" "}
                                {questions.length} correct
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {questions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className={`p-4 rounded-lg border-2 ${answers[q.id] === q.correctAnswer
                                            ? "border-success bg-green-50"
                                            : "border-red-500 bg-red-50"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {answers[q.id] === q.correctAnswer ? (
                                            <CheckCircle className="text-success mt-1" size={20} />
                                        ) : (
                                            <XCircle className="text-red-500 mt-1" size={20} />
                                        )}
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-foreground mb-2">
                                                {idx + 1}. {q.question}
                                            </p>
                                            <p className="text-sm text-text-secondary">
                                                Your answer: {q.options[answers[q.id]] || "Not answered"}
                                            </p>
                                            {answers[q.id] !== q.correctAnswer && (
                                                <p className="text-sm text-success mt-1">
                                                    Correct answer: {q.options[q.correctAnswer]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setQuizStarted(false)
                                    setCurrentQuestion(0)
                                    setAnswers({})
                                    setShowResults(false)
                                }}
                                className="btn-primary flex-1"
                            >
                                Retake Quiz
                            </button>
                            <a href="/student/dashboard" className="btn-secondary flex-1 text-center">
                                Back to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const currentQ = questions[currentQuestion]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="bg-white rounded-lg p-4 card-shadow mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                            <Clock size={16} />
                            {quiz.timeLimit} min
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-lg p-8 card-shadow mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">{currentQ.question}</h2>

                    <div className="space-y-3">
                        {currentQ.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(currentQ.id, idx)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition ${answers[currentQ.id] === idx
                                        ? "border-primary bg-blue-50"
                                        : "border-gray-200 hover:border-primary"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQ.id] === idx
                                                ? "border-primary bg-primary"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {answers[currentQ.id] === idx && (
                                            <div className="w-3 h-3 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-foreground">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button onClick={handleSubmit} className="btn-primary">
                            Submit Quiz
                        </button>
                    ) : (
                        <button onClick={handleNext} className="btn-primary">
                            Next Question
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudentQuizPage
