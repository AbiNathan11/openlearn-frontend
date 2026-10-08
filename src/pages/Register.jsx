"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"
import { registerUser } from "../services/api"

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "student",
        agreeTerms: false,
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}

        if (!formData.fullName) newErrors.fullName = "Full name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            try {
                await registerUser(formData)
                // Registration successful, redirect to login
                navigate("/login", { state: { message: "Registration successful! Please sign in." } })
            } catch (error) {
                setErrors({ submit: error })
            } finally {
                setIsLoading(false)
            }
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">OL</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                    <p className="text-text-secondary mt-2">Join OpenLearn today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
                    </div>

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
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* User Type */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Join as</label>
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                        </select>
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
                            />
                        </div>
                        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-border mt-1 cursor-pointer"
                            style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-sm text-text-secondary">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                    {errors.agreeTerms && <p className="text-destructive text-sm mt-1">{errors.agreeTerms}</p>}

                    {/* General Error Message */}
                    {errors.submit && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {errors.submit}
                        </div>
                    )}

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="text-center text-text-secondary mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Register
