import { GraduationCap, Clock, InfinityIcon, Mail, Phone, MapPin, Send, Star, ArrowRight, Users, CheckCircle, Play } from "lucide-react"

import home5 from "../assets/home5.png"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCourses } from "../services/api"

const Home = () => {
    const navigate = useNavigate();
    const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            try {
                const response = await getCourses();
                // If the response is successful, take the top 3 or first 3 as featured
                if (response.success) {
                    // Sorting by averageRating or just take first 3 for now as "featured"
                    const sorted = response.data
                        .filter(c => c.status === 'Published')
                        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                        .slice(0, 3);
                    setFeaturedCourses(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch featured courses:", error);
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchFeaturedCourses();
    }, []);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus("submitting");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData),
            });
            if (res.ok) {
                setSubmitStatus("success");
                setContactData({ name: "", email: "", message: "" });
                setTimeout(() => setSubmitStatus(null), 3000);
            } else {
                setSubmitStatus("error");
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus("error");
        }
    }

    const features = [
        {
            icon: GraduationCap,
            title: "Expert Instructors",
            description: "Learn from industry professionals who are passionate about teaching.",
        },
        {
            icon: InfinityIcon,
            title: "Lifetime Access",
            description: "Enroll once and have unlimited access to course materials, anytime.",
        },
        {
            icon: Clock,
            title: "Flexible Learning",
            description: "Learn at your own pace with on-demand video lectures and resources.",
        },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-slate-50">
            {/* Hero Section */}
            <section
                className="relative min-h-[600px] flex items-center overflow-hidden bg-[#f0f7ff] md:bg-transparent"
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-center"
                    style={{
                        backgroundImage: `url(${home5})`,
                        backgroundPosition: 'center right',
                        backgroundSize: 'cover'
                    }}
                >
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        <div className="max-w-2xl text-left">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[2px] w-8 bg-red-500"></div>
                                <span className="text-sm font-bold tracking-widest text-gray-700 uppercase">Online E-Learning Courses</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-4">
                                <span className="text-[#0056D2]">Online Education.</span><br />
                                <span className="text-gray-800">Feels Like Real Classroom</span>
                            </h1>

                            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-[#0056D2] rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-semibold">Get Certified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-500 rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-semibold">Gain Job-ready Skills</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-500 rounded-full p-1">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-semibold">Great Life</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-10 py-5 bg-[#0056D2] text-white rounded-lg font-bold text-lg hover:shadow-xl hover:bg-[#0042a5] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    GET STARTED <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate("/courses")}
                                    className="px-10 py-5 bg-[#051922] text-white rounded-lg font-bold text-lg hover:shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    OUR COURSES <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:block relative h-full min-h-[400px]">
                            <div className="absolute top-[20%] left-[-10%] bg-white p-4 rounded-full shadow-2xl flex items-center gap-4 animate-bounce-slow border border-gray-100 z-20">
                                <div className="bg-[#0056D2] p-3 rounded-full">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-extrabold text-gray-900 leading-none">16500+</h4>
                                    <p className="text-sm text-gray-500 font-bold whitespace-nowrap">Active Students</p>
                                </div>
                            </div>

                            <div className="absolute top-[50%] right-[-10%] bg-white p-4 rounded-full shadow-2xl flex items-center gap-4 animate-bounce-delayed border border-gray-100 z-20">
                                <div className="bg-red-500 p-3 rounded-full">
                                    <Play className="w-6 h-6 text-white fill-current" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-extrabold text-gray-900 leading-none">7500+</h4>
                                    <p className="text-sm text-gray-500 font-bold whitespace-nowrap">Online Video Courses</p>
                                </div>
                            </div>

                            <div className="absolute top-[85%] right-[5%] bg-white p-4 rounded-full shadow-2xl flex items-center gap-4 animate-bounce-slow border border-gray-100 z-20">
                                <div className="bg-green-500 p-3 rounded-full">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-extrabold text-gray-900 leading-none">1200+</h4>
                                    <p className="text-sm text-gray-500 font-bold whitespace-nowrap">Expert Instructors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-15 relative">
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                            <p className="text-lg text-gray-600 max-w-2xl">Discover our most popular courses taught by industry experts</p>
                        </div>
                        <a href="/courses" className="group bg-linear-to-r from-[#0066cc] to-[#0052a3] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {isLoadingCourses ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : featuredCourses.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium text-lg italic">No courses available at the moment. Stay tuned!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCourses.map((course) => (
                                <div
                                    key={course._id}
                                    className="group relative cursor-pointer"
                                    onClick={() => navigate(`/course-details/${course._id}`)}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0052a3]/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                    <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider border border-white/20">
                                                {course.category}
                                            </div>
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-0.5 bg-blue-50 text-[#0066cc] text-[10px] font-bold rounded uppercase">
                                                    {course.level}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066cc] transition-colors line-clamp-2">{course.title}</h3>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                    {course.instructor?.name?.charAt(0) || "I"}
                                                </div>
                                                <p className="text-xs text-gray-600 font-medium">{course.instructor?.name || "Expert Instructor"}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(course.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                    <span className="text-sm font-bold text-gray-900 ml-1">{course.averageRating || "0.0"}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">({course.students?.length || 0})</span>
                                                </div>
                                                <div className="text-lg font-bold text-[#0066cc]">
                                                    ${course.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose OpenLearn Section */}
            <section className="py-12 relative bg-gradient-to-br from-white via-gray-50 to-slate-50">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066cc]/5 via-[#0052a3]/5 to-[#0066cc]/5"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white rounded-full px-4 py-2 mb-3">
                            <span className="text-sm font-medium">Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose OpenLearn?</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Our mission is to make high-quality education accessible to everyone, everywhere. We believe in the power of learning to transform lives and are committed to providing an engaging and supportive platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon
                            return (
                                <div key={idx} className="group relative">
                                    <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0052a3]/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                                        <div className="w-20 h-20 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Icon size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="relative min-h-[300px] flex items-center py-8 overflow-hidden">
                {/* Background Cover Image */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: `url('${new URL('../../../../.gemini/antigravity/brain/60136582-19d2-47a9-9e7d-9dced772329d/about_us_cover_v2_1775662889594.png', import.meta.url).href}')`,
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-[#0056D2]/60 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 md:p-8 rounded-2xl shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            {/* Title & Info */}
                            <div className="max-w-4xl">
                                <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 mb-4 border border-white/30">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">About OpenLearn</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                                    Empowering <span className="text-blue-200">Digital Mastery</span>
                                </h2>
                                <p className="text-blue-50/90 leading-relaxed text-lg mb-4">
                                    OpenLearn is your gateway to a professional evolution, meticulously crafted for the digital age. We are committed to democratizing elite education by bridging the gap between ambitious learners and global industry visionaries. Our platform isn't just a collection of courses; it's a vibrant, results-driven ecosystem where theory meets practice.
                                </p>
                                <p className="text-blue-50/80 leading-relaxed text-lg">
                                    Whether you are looking to master the intricacies of software engineering, innovate in digital marketing, or redefine user experiences in design, we provide the cutting-edge tools and mentorship needed to transform your career trajectory. Since 2024, our community has been pioneering a new standard of accessible, high-impact learning that empowers individuals to lead in an ever-evolving global economy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-12 relative bg-linear-to-br from-white via-gray-50 to-slate-50">
                <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 via-[#0052a3]/5 to-[#0066cc]/5"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#0066cc] to-[#0052a3] text-white rounded-full px-4 py-2 mb-3">
                            <span className="text-sm font-medium">Get In Touch</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white/80 backdrop-blur-sm border border-white/50 p-8 rounded-2xl shadow-lg">
                            <form className="space-y-6" onSubmit={handleContactSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={contactData.name}
                                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-[#0066cc] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={contactData.email}
                                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-[#0066cc] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Your message..."
                                        value={contactData.message}
                                        onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-[#0066cc] transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <button type="submit" disabled={submitStatus === "submitting"} className="group bg-linear-to-r from-[#0066cc] to-[#0052a3] text-white w-full px-6 py-4 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                    <Send size={20} />
                                    {submitStatus === "submitting" ? "Sending..." : submitStatus === "success" ? "Message Sent!" : "Send Message"}
                                    {submitStatus !== "submitting" && submitStatus !== "success" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                                {submitStatus === "error" && <p className="text-red-500 text-sm text-center">Failed to send message. Please try again.</p>}
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0052a3]/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                        <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-6 flex items-start gap-4 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-lg flex items-center justify-center shrink-0">
                                                <Mail className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                                                <p className="text-gray-600">support@openlearn.com</p>
                                                <p className="text-gray-600">info@openlearn.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0052a3]/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                        <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-6 flex items-start gap-4 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-lg flex items-center justify-center shrink-0">
                                                <Phone className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                                <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-[#0066cc]/5 to-[#0052a3]/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                                        <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-6 flex items-start gap-4 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <div className="w-12 h-12 bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-lg flex items-center justify-center shrink-0">
                                                <MapPin className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Office</h4>
                                                <p className="text-gray-600">123 Learning Street</p>
                                                <p className="text-gray-600">San Francisco, CA 94102</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
