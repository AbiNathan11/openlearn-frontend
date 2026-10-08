import { useState } from "react"
import { Search, Check, X, Eye, Mail, Calendar, FileText } from "lucide-react"
import ConfirmModal from "../../components/ConfirmModal"

const InstructorApproval = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("pending")
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Confirm",
        type: "danger"
    })

    const instructors = [
        {
            id: 1,
            name: "David Lee",
            email: "david.lee@example.com",
            phone: "+1 (555) 678-9012",
            expertise: "Web Development, JavaScript, React",
            experience: "8 years",
            education: "Master's in Computer Science",
            appliedDate: "Mar 15, 2024",
            status: "Pending",
            bio: "Experienced full-stack developer with a passion for teaching. Worked at major tech companies and now want to share my knowledge.",
        },
        {
            id: 2,
            name: "Lisa Wang",
            email: "lisa.wang@example.com",
            phone: "+1 (555) 789-0123",
            expertise: "Data Science, Python, Machine Learning",
            experience: "6 years",
            education: "PhD in Data Science",
            appliedDate: "Mar 18, 2024",
            status: "Pending",
            bio: "Data scientist with extensive experience in ML and AI. Published researcher looking to educate the next generation.",
        },
        {
            id: 3,
            name: "James Rodriguez",
            email: "james.r@example.com",
            phone: "+1 (555) 890-1234",
            expertise: "UI/UX Design, Figma, Adobe XD",
            experience: "5 years",
            education: "Bachelor's in Design",
            appliedDate: "Mar 20, 2024",
            status: "Pending",
            bio: "Creative designer with a track record of successful projects. Eager to help students master design principles.",
        },
        {
            id: 4,
            name: "Maria Garcia",
            email: "maria.g@example.com",
            phone: "+1 (555) 901-2345",
            expertise: "Digital Marketing, SEO, Content Strategy",
            experience: "7 years",
            education: "MBA in Marketing",
            appliedDate: "Feb 28, 2024",
            status: "Approved",
            bio: "Marketing professional with proven results. Want to teach practical marketing skills.",
        },
        {
            id: 5,
            name: "Robert Kim",
            email: "robert.kim@example.com",
            phone: "+1 (555) 012-3456",
            expertise: "Mobile Development, iOS, Swift",
            experience: "4 years",
            education: "Bachelor's in Software Engineering",
            appliedDate: "Mar 1, 2024",
            status: "Rejected",
            bio: "iOS developer looking to share mobile development knowledge.",
        },
    ]

    const handleApprove = (instructorId) => {
        setConfirmModal({
            isOpen: true,
            title: "Approve Instructor?",
            message: "Are you sure you want to approve this instructor application? They will gain access to instructor features immediately.",
            confirmText: "Approve Instructor",
            type: "info",
            onConfirm: () => {
                console.log("Approve instructor:", instructorId)
            }
        });
    }

    const handleReject = (instructorId) => {
        setConfirmModal({
            isOpen: true,
            title: "Reject Instructor?",
            message: "Are you sure you want to reject this instructor application? They will be notified of the decision.",
            confirmText: "Reject instructor",
            type: "danger",
            onConfirm: () => {
                console.log("Reject instructor:", instructorId)
            }
        });
    }

    const handleViewDetails = (instructorId) => {
        console.log("View details for instructor:", instructorId)
    }

    const filteredInstructors = instructors.filter((instructor) => {
        const matchesSearch =
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.expertise.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
            filterStatus === "all" || instructor.status.toLowerCase() === filterStatus.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const pendingCount = instructors.filter((i) => i.status === "Pending").length
    const approvedCount = instructors.filter((i) => i.status === "Approved").length
    const rejectedCount = instructors.filter((i) => i.status === "Rejected").length

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Instructor Approvals</h1>
                    <p className="text-text-secondary">Review and approve instructor applications</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <p className="text-text-secondary text-sm mb-1">Pending Applications</p>
                        <p className="text-3xl font-bold text-warning">{pendingCount}</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <p className="text-text-secondary text-sm mb-1">Approved</p>
                        <p className="text-3xl font-bold text-success">{approvedCount}</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 card-shadow">
                        <p className="text-text-secondary text-sm mb-1">Rejected</p>
                        <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or expertise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredInstructors.map((instructor) => (
                        <div key={instructor.id} className="bg-white rounded-lg p-6 card-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                                        {instructor.name.charAt(0)}
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${instructor.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : instructor.status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {instructor.status}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-2">{instructor.name}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Mail size={16} />
                                            <span>{instructor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Calendar size={16} />
                                            <span>Applied: {instructor.appliedDate}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div>
                                            <span className="text-sm font-semibold text-foreground">Expertise: </span>
                                            <span className="text-sm text-text-secondary">{instructor.expertise}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-foreground">Experience: </span>
                                            <span className="text-sm text-text-secondary">{instructor.experience}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-foreground">Education: </span>
                                            <span className="text-sm text-text-secondary">{instructor.education}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <FileText size={16} className="text-text-secondary mt-1" />
                                            <span className="text-sm font-semibold text-foreground">Bio:</span>
                                        </div>
                                        <p className="text-sm text-text-secondary">{instructor.bio}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 lg:w-48">
                                    <button
                                        onClick={() => handleViewDetails(instructor.id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <Eye size={18} />
                                        View Details
                                    </button>

                                    {instructor.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(instructor.id)}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition"
                                            >
                                                <Check size={18} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(instructor.id)}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                <X size={18} />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredInstructors.length === 0 && (
                    <div className="bg-white rounded-lg p-12 card-shadow text-center">
                        <p className="text-text-secondary">No instructor applications found matching your criteria</p>
                    </div>
                )}

                {filteredInstructors.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                            Showing {filteredInstructors.length} of {instructors.length} applications
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                                1
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
            />
        </div>
    )
}

export default InstructorApproval
