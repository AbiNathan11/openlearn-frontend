"use client"

import { useState, useEffect } from "react"
import { Send, Bot, User, BookOpen } from "lucide-react"
import { sendAIChatMessage, getStudentCourses } from "../../services/api"

const AIChat = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            message: "Hello! I'm your AI learning assistant. I can answer questions based on lessons you've completed. Select a course to get started!"
        }
    ])
    const [currentMessage, setCurrentMessage] = useState('')
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStudentCourses()
    }, [])

    const fetchStudentCourses = async () => {
        try {
            const response = await getStudentCourses()
            if (response.success) {
                setCourses(response.data)
                if (response.data.length > 0) {
                    setSelectedCourse(response.data[0])
                }
            }
        } catch (error) {
            console.error('Failed to fetch courses:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || isSendingMessage || !selectedCourse) return

        const userMessage = currentMessage.trim()
        setCurrentMessage('')
        setIsSendingMessage(true)

        // Add user message to chat
        setMessages(prev => [...prev, { type: 'user', message: userMessage }])

        try {
            const response = await sendAIChatMessage(userMessage, selectedCourse._id)
            
            if (response.success) {
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    message: response.answer,
                    sources: response.sources 
                }])
            } else {
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    message: response.error || 'Sorry, I encountered an error. Please try again.' 
                }])
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setMessages(prev => [...prev, { 
                type: 'ai', 
                message: 'Sorry, I encountered an error. Please try again.' 
            }])
        } finally {
            setIsSendingMessage(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (isLoading) return <div className="text-center py-12">Loading courses...</div>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-6">AI Learning Assistant</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Course Selection */}
                        <div className="lg:col-span-1">
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" />
                                Your Courses
                            </h2>
                            <div className="space-y-2">
                                {courses.map(course => (
                                    <button
                                        key={course._id}
                                        onClick={() => setSelectedCourse(course)}
                                        className={`w-full text-left p-3 rounded-lg border transition ${
                                            selectedCourse?._id === course._id
                                                ? "border-primary bg-blue-50"
                                                : "border-gray-200 hover:border-primary"
                                        }`}
                                    >
                                        <h3 className="font-medium text-sm text-foreground">{course.title}</h3>
                                        <p className="text-xs text-text-secondary mt-1">
                                            {course.lessons?.length || 0} lessons • {course.progress || 0}% completed
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 rounded-lg p-6 h-[600px] flex flex-col">
                                {selectedCourse ? (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-foreground">
                                                Chat about: {selectedCourse.title}
                                            </h2>
                                            <div className="text-sm text-text-secondary">
                                                Ask questions about lessons you've completed
                                            </div>
                                        </div>
                                        
                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                                            {messages.map((msg, index) => (
                                                <div key={index} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                                                    {msg.type === 'ai' && (
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                            <Bot size={16} />
                                                        </div>
                                                    )}
                                                    <div className={`max-w-xs ${msg.type === 'user' ? 'order-1' : 'flex-1'}`}>
                                                        <div className={`p-3 rounded-lg shadow-sm ${
                                                            msg.type === 'user' 
                                                                ? 'bg-gray-100 text-black' 
                                                                : 'bg-white'
                                                        }`}>
                                                            <p className={`text-sm ${msg.type === 'user' ? 'text-black' : 'text-foreground'}`}>
                                                                {msg.message}
                                                            </p>
                                                            {msg.sources && msg.sources.length > 0 && (
                                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                                    <p className="text-xs text-text-secondary mb-1">Sources:</p>
                                                                    {msg.sources.map((source, idx) => (
                                                                        <p key={idx} className="text-xs text-primary">
                                                                            • {source.lessonTitle}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {msg.type === 'user' && (
                                                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                            <User size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {isSendingMessage && (
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        <Bot size={16} />
                                                    </div>
                                                    <div className="flex-1 bg-white p-3 rounded-lg shadow-sm">
                                                        <div className="flex space-x-1">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Ask about your completed lessons..."
                                                value={currentMessage}
                                                onChange={(e) => setCurrentMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                disabled={isSendingMessage}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                            />
                                            <button 
                                                onClick={handleSendMessage}
                                                disabled={isSendingMessage || !currentMessage.trim() || !selectedCourse}
                                                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Send size={16} />
                                                {isSendingMessage ? 'Sending...' : 'Send'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                                            <p className="text-lg text-gray-600 mb-2">Select a course to start chatting</p>
                                            <p className="text-sm text-gray-500">I can answer questions about lessons you've completed in your enrolled courses.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIChat
