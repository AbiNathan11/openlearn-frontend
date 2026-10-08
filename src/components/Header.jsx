"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <Logo className="w-10 h-10 text-primary" />
                        <h1 className="text-xl font-bold text-foreground">OpenLearn</h1>
                    </a>

                    {/* Desktop Navigation & Auth Buttons */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-text-primary hover:text-primary transition font-medium">
                            Home
                        </a>
                        <a href="/courses" className="text-text-primary hover:text-primary transition font-medium">
                            Courses
                        </a>
                        <a href="/become-instructor" className="text-text-primary hover:text-primary transition font-medium">
                            Become an Instructor
                        </a>
                        <a href="/login" className="text-text-primary hover:text-primary font-medium transition">
                            Log In
                        </a>
                        <a href="/register" className="btn-primary">
                            Sign Up
                        </a>
                    </div>


                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-text-primary"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>


                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
                        <a href="/" className="block text-text-primary hover:text-primary font-medium">
                            Home
                        </a>
                        <a href="/courses" className="block text-text-primary hover:text-primary font-medium">
                            Courses
                        </a>
                        <a href="/become-instructor" className="block text-text-primary hover:text-primary font-medium">
                            Become an Instructor
                        </a>
                        <div className="pt-3 space-y-2 border-t border-gray-200">
                            <a href="/login" className="block text-text-primary hover:text-primary font-medium">
                                Log In
                            </a>
                            <a href="/register" className="btn-primary w-full text-center block">
                                Sign Up
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
