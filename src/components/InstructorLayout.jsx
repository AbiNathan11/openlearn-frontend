"use client"

import { useState } from "react"
import { LayoutDashboard, BookOpen, PlusCircle, User, Settings, Menu, X } from "lucide-react"

const InstructorLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/instructor/dashboard" },
        { icon: BookOpen, label: "My Courses", href: "/instructor/my-courses" },
        { icon: PlusCircle, label: "Add Course", href: "/instructor/add-course" },
        { icon: User, label: "Profile", href: "/instructor/profile" },
        { icon: Settings, label: "Settings", href: "/instructor/settings" },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-20 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 shadow-lg z-40 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
                style={{ backgroundColor: 'rgba(0, 102, 204, 0.2)' }}
            >
                <div className="p-6 border-b border-gray-200" style={{ borderBottomColor: 'rgba(0, 102, 204, 0.2)' }}>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Instructor Panel</h2>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <li key={idx}>
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition"
                                        style={{ 
                                            color: 'var(--text-primary)',
                                            backgroundColor: 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'rgba(0, 102, 204, 0.1)'
                                            e.target.style.color = 'var(--primary)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent'
                                            e.target.style.color = 'var(--text-primary)'
                                        }}
                                    >
                                        <Icon size={20} style={{ color: 'var(--text-secondary)' }} />
                                        <span className="font-medium">{item.label}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200" style={{ borderTopColor: 'rgba(0, 102, 204, 0.2)' }}>
                    <a
                        href="/"
                        className="flex items-center justify-center gap-2 px-4 py-2 transition"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                            e.target.style.color = 'var(--primary)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'var(--text-secondary)'
                        }}
                    >
                        ← Logout
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-68 min-h-screen">
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {children}
            </div>
        </div>
    )
}

export default InstructorLayout
