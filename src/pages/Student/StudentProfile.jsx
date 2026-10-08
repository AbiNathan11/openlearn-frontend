import toast from 'react-hot-toast';
"use client"

import { useState, useRef, useEffect } from "react"
import { User, Mail, Phone, MapPin, Camera, BookOpen, Award } from "lucide-react"
import { getProfile, updateProfile } from "../../services/api"

const StudentProfile = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        fullName: user.name || "",
        email: user.email || "",
        phone: "",
        bio: "",
        location: "",
        interests: "",
        linkedin: "",
        twitter: "",
    })

    const [isEditing, setIsEditing] = useState(false)
    const [profileImage, setProfileImage] = useState(user.avatar || null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile()
                if (response.data) {
                    const userData = response.data
                    setFormData(prev => ({
                        ...prev,
                        fullName: userData.name || prev.fullName,
                        email: userData.email || prev.email,
                        phone: userData.phone || "",
                        bio: userData.bio || "",
                        location: userData.location || "",
                        interests: userData.expertise || "", // Mapping database 'expertise' to 'interests' for students
                        linkedin: userData.linkedin || "",
                        twitter: userData.twitter || "",
                    }))
                    if (userData.avatar) {
                        setProfileImage(userData.avatar)
                    }
                    localStorage.setItem("user", JSON.stringify(userData))
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current.click()
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const updatePayload = {
                name: formData.fullName,
                phone: formData.phone,
                bio: formData.bio,
                expertise: formData.interests, // Saving 'interests' to 'expertise' field
                location: formData.location,
                linkedin: formData.linkedin,
                twitter: formData.twitter,
                avatar: profileImage
            }

            const response = await updateProfile(updatePayload)

            if (response.success) {
                const updatedUser = response.data
                localStorage.setItem("user", JSON.stringify(updatedUser))
                setIsEditing(false)
                toast("Profile updated successfully!")
            }
        } catch (error) {
            console.error("Update failed:", error)
            toast("Failed to update profile: " + error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
                    <p className="text-text-secondary">Manage your personal information</p>
                </div>

                <div className="bg-white rounded-lg card-shadow overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-linear-to-r from-primary to-accent p-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-4xl font-bold text-primary">
                                            {formData.fullName.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleImageClick}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition cursor-pointer"
                                    type="button"
                                >
                                    <Camera size={20} className="text-primary" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="text-black">
                                <h2 className="text-2xl font-bold mb-1">{formData.fullName || "Student Name"}</h2>
                                <p className="text-gray-600 mb-2">Student</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="btn-primary"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn-primary disabled:opacity-70"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="btn-secondary"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-text-secondary" size={20} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Full Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-text-secondary" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Phone and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-text-secondary" size={20} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-text-secondary" size={20} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="City, Country"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-50"
                                />
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Learning Interests
                                </label>
                                <input
                                    type="text"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="e.g., Web Development, Data Science"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                />
                            </div>

                            {/* Social Links */}
                            <div>
                                <h4 className="text-lg font-semibold text-foreground mb-4">Social Links</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Twitter
                                        </label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="https://twitter.com/yourhandle"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default StudentProfile
