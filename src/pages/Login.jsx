"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Mail, Lock, X, ArrowLeft, CheckCircle } from "lucide-react"
import { loginUser, forgotPassword, resetPassword } from "../services/api"

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    // Forgot Password States
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
    const [forgotStep, setForgotStep] = useState(1) // 1: Email, 2: Token/NewPass
    const [forgotEmail, setForgotEmail] = useState("")
    const [resetTokenInput, setResetTokenInput] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [forgotLoading, setForgotLoading] = useState(false)
    const [forgotError, setForgotError] = useState("")
    const [forgotSuccess, setForgotSuccess] = useState("")

    // Persistent "Remember Me" initialization
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail")
        if (savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail,
                rememberMe: true
            }))
        }
    }, [])

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message)
            // Clear message from state so it doesn't persist on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSocialLogin = async (provider) => {
        try {
            // For OAuth, we'll redirect to the backend OAuth endpoint
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`
        } catch (err) {
            setError(err?.message || `Failed to login with ${provider}`)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        setIsLoading(true)

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password
            })

            // Handle "Remember Me"
            if (formData.rememberMe) {
                localStorage.setItem("rememberedEmail", formData.email)
            } else {
                localStorage.removeItem("rememberedEmail")
            }

            // Store token, refresh token, and user info (you might want to use a context for this later)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            // Redirect based on role
            const role = response.data.user.role
            if (role === "admin") {
                navigate("/admin")
            } else if (role === "instructor") {
                navigate("/instructor/dashboard")
            } else {
                navigate("/student/dashboard")
            }
        } catch (err) {
            setError(err || "Login failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setForgotError("")
        setForgotLoading(true)
        try {
            const response = await forgotPassword(forgotEmail)
            setForgotStep(2)
            setForgotSuccess(response.message || "A reset code has been sent to your email address.")
        } catch (err) {
            setForgotError(err || "Failed to send reset request")
        } finally {
            setForgotLoading(false)
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        setForgotError("")
        setForgotLoading(true)
        try {
            await resetPassword(resetTokenInput, newPassword)
            setForgotSuccess("Password reset successfully! You can now sign in.")
            setTimeout(() => {
                setIsForgotModalOpen(false)
                setForgotStep(1)
                setForgotEmail("")
                setResetTokenInput("")
                setNewPassword("")
                setForgotSuccess("")
            }, 3000)
        } catch (err) {
            setForgotError(err || "Failed to reset password")
        } finally {
            setForgotLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">OL</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">OpenLearn</h1>
                    <p className="text-text-secondary mt-2">Sign in to your account</p>
                </div>

                {successMessage && (
                    <div className="mb-6 bg-green-50 text-green-600 text-sm p-3 rounded-lg text-center border border-green-200">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-border cursor-pointer"
                                style={{ accentColor: 'var(--primary)' }}
                            />
                            <span className="text-sm text-text-secondary">Remember me</span>
                        </label>
                        <button 
                            type="button"
                            onClick={() => setIsForgotModalOpen(true)}
                            className="text-sm text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-text-muted">Or continue with</span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('facebook')}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-text-secondary">
                    Don't have an account?{" "}
                    <a href="/register" className="text-primary font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>

            {/* Forgot Password Modal */}
            {isForgotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsForgotModalOpen(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Lock className="text-primary" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
                                </h2>
                                <p className="text-text-secondary text-sm mt-1">
                                    {forgotStep === 1 
                                        ? "No worries! Enter your email to get a reset token." 
                                        : "Almost there! Set your new password."}
                                </p>
                            </div>

                            {forgotSuccess && (
                                <div className="mb-4 bg-green-50 text-green-600 text-xs p-3 rounded-lg flex items-start gap-2 border border-green-200">
                                    <CheckCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>{forgotSuccess}</span>
                                </div>
                            )}

                            {forgotError && (
                                <div className="mb-4 bg-red-50 text-red-500 text-xs p-3 rounded-lg border border-red-100 flex items-start gap-2">
                                    <X size={14} className="shrink-0 mt-0.5" />
                                    <span>{forgotError}</span>
                                </div>
                            )}

                            {forgotStep === 1 ? (
                                <form onSubmit={handleForgotPassword} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-text-muted" size={18} />
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                placeholder="Enter your registered email"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="w-full btn-primary h-12 flex items-center justify-center font-bold tracking-wide shadow-xl shadow-primary/20 disabled:opacity-70"
                                    >
                                        {forgotLoading ? "Processing..." : "Send Reset Token"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 ml-1">Reset Token</label>
                                        <input
                                            type="text"
                                            value={resetTokenInput}
                                            onChange={(e) => setResetTokenInput(e.target.value)}
                                            placeholder="Enter 6-digit token"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 ml-1">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="w-full btn-primary h-12 flex items-center justify-center font-bold tracking-wide shadow-xl shadow-primary/20 disabled:opacity-70"
                                    >
                                        {forgotLoading ? "Resetting..." : "Reset Password"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(1)}
                                        className="w-full flex items-center justify-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors font-medium mt-4"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to email entry
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
