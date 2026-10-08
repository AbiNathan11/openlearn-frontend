"use client"

import { useNavigate } from "react-router-dom"
import { CheckCircle, Users, DollarSign, Globe, ArrowRight, Star, TrendingUp } from "lucide-react"
import instructorImg from "../assets/instructor.png"

const BecomeInstructor = () => {
    const navigate = useNavigate()

    const benefits = [
        {
            icon: Users,
            title: "Reach Millions",
            description: "Teach students from all around the world and share your knowledge."
        },
        {
            icon: DollarSign,
            title: "Earn Money",
            description: "Get paid for every student who enrolls in your course. Limitless potential."
        },
        {
            icon: Globe,
            title: "Work from Anywhere",
            description: "Manage your courses and interact with students from the comfort of your home."
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-slate-50">
            {/* Hero Section */}
            <div
                className="relative min-h-[500px] flex items-center text-white overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${instructorImg})` }}
            >
                {/* Background Overlay for readability */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Background decoration */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center w-full py-12 md:py-16">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30 transform hover:scale-105 transition-transform duration-300">
                        <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                        <span className="text-xs md:text-sm font-semibold tracking-wide">Join 50,000+ instructors worldwide</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                        Become an <span className="text-[#0066cc]">Instructor</span>
                    </h1>
                    <p className="text-base md:text-lg opacity-95 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                        Share your knowledge, inspire students, and earn money by teaching on OpenLearn.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate("/register")}
                            className="group bg-[#0066cc] text-white px-8 py-3 rounded-full font-bold text-base hover:shadow-2xl hover:bg-[#0052a3] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            Start Teaching Today
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3 text-base font-semibold bg-white/05 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
                            <TrendingUp className="w-4 h-4 text-blue-300" />
                            <span>No experience needed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 relative">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0066cc]/5 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Teach on OpenLearn?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the benefits of joining our global instructor community</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon
                            return (
                                <div key={idx} className="group relative">
                                    <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0066cc]/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                                        <div className="w-20 h-20 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Icon size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* How it Works / CTA */}
            <div className="relative bg-linear-to-br from-white via-gray-50 to-slate-50 py-16 border-t border-gray-100">
                <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 via-[#0066cc]/3 to-[#0066cc]/5"></div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 gap-8 text-left max-w-2xl mx-auto">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/10 to-[#0052a3]/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold text-lg">1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Plan your curriculum</h4>
                                        <p className="text-gray-600">Structure your course content effectively for your students.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/10 to-[#0052a3]/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold text-lg">2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Record your video</h4>
                                        <p className="text-gray-600">Use basic tools to record professional-quality videos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/10 to-[#0052a3]/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold text-lg">3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Launch your course</h4>
                                        <p className="text-gray-600">Publish your course and start gathering students.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BecomeInstructor
