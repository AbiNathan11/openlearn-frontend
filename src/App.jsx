import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AdminLayout from "./components/AdminLayout"
import InstructorLayout from "./components/InstructorLayout"
import StudentLayout from "./components/StudentLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Courses from "./pages/Courses"
import BecomeInstructor from "./pages/BecomeInstructor"
import AuthCallback from "./pages/AuthCallback"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import ManageUsers from "./pages/Admin/ManageUsers"
import ManageCourses from "./pages/Admin/ManageCourses"
import InstructorApproval from "./pages/Admin/InstructorApproval"
import CourseApprovals from "./pages/Admin/CourseApprovals"
import AdminReports from "./pages/Admin/Reports"
import AdminMessages from "./pages/Admin/Messages"
import InstructorDashboard from "./pages/Instructor/InstructorDashboard"
import InstructorMyCourses from "./pages/Instructor/MyCourses"
import AddCourse from "./pages/Instructor/AddCourse"
import EditCourse from "./pages/Instructor/EditCourse"
import InstructorProfile from "./pages/Instructor/InstructorProfile"
import InstructorSettings from "./pages/Instructor/InstructorSettings"
import StudentDashboard from "./pages/Student/StudentDashboard"
import StudentMyCourses from "./pages/Student/MyCourses"
import StudentCoursePage from "./pages/Student/StudentCoursePage"
import StudentProfile from "./pages/Student/StudentProfile"
import StudentQuizPage from "./pages/Student/StudentQuizPage"
import Quiz from "./pages/Student/Quiz"
import AIChat from "./pages/Student/AIChat"
import AISummary from "./pages/Student/AISummary"
import StudentSettings from "./pages/Student/StudentSettings"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentCancel from "./pages/PaymentCancel"
import NotFound from "./pages/NotFound"
import "./index.css"

import { Toaster } from "react-hot-toast"

function App() {
    return (
        <Router>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: 'rgba(0, 102, 204, 0.9)', // theme blue with transparency
                        color: '#fff',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }
                }}
            />
            <Routes>
                {/* Public Routes with Header/Footer */}
                <Route
                    path="/*"
                    element={
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/courses" element={<Courses />} />
                                    <Route path="/become-instructor" element={<BecomeInstructor />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/auth/callback" element={<AuthCallback />} />
                                    <Route path="/payment-success" element={<PaymentSuccess />} />
                                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    }
                />

                {/* Admin Routes with Sidebar Layout */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route path="/users" element={<ManageUsers />} />
                                <Route path="/courses" element={<ManageCourses />} />
                                <Route path="/instructor-approval" element={<InstructorApproval />} />
                                <Route path="/course-approvals" element={<CourseApprovals />} />
                                <Route path="/reports" element={<AdminReports />} />
                                <Route path="/messages" element={<AdminMessages />} />
                            </Routes>
                        </AdminLayout>
                    }
                />

                {/* Instructor Routes with Sidebar Layout */}
                <Route
                    path="/instructor/*"
                    element={
                        <InstructorLayout>
                            <Routes>
                                <Route path="/dashboard" element={<InstructorDashboard />} />
                                <Route path="/my-courses" element={<InstructorMyCourses />} />
                                <Route path="/add-course" element={<AddCourse />} />
                                <Route path="/edit-course/:id" element={<EditCourse />} />
                                <Route path="/profile" element={<InstructorProfile />} />
                                <Route path="/settings" element={<InstructorSettings />} />
                            </Routes>
                        </InstructorLayout>
                    }
                />

                {/* Student Routes with Sidebar Layout */}
                <Route
                    path="/student/*"
                    element={
                        <StudentLayout>
                            <Routes>
                                <Route path="/dashboard" element={<StudentDashboard />} />
                                <Route path="/my-courses" element={<StudentMyCourses />} />
                                <Route path="/course/:id" element={<StudentCoursePage />} />
                                <Route path="/profile" element={<StudentProfile />} />
                                <Route path="/quiz" element={<Quiz />} />
                                <Route path="/ai-chat" element={<AIChat />} />
                                <Route path="/ai-summary" element={<AISummary />} />
                                <Route path="/settings" element={<StudentSettings />} />
                            </Routes>
                        </StudentLayout>
                    }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
