import toast from 'react-hot-toast';
"use client"

import { useState } from "react"
import { AlertTriangle, Shield, Lock, BookOpen } from "lucide-react"
import { deactivateAccount } from "../../services/api"
import { clearAuth } from "../../utils/auth"
import ConfirmModal from "../../components/ConfirmModal"

const StudentSettings = () => {
    const [deleteReason, setDeleteReason] = useState("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const handleDeleteAccount = () => {
        if (!deleteReason.trim()) {
            toast("Please select a reason for account deletion")
            return
        }
        setIsConfirmOpen(true)
    }

    const confirmDelete = async () => {
        try {
            await deactivateAccount(deleteReason)
            clearAuth()
            window.location.href = "/login"
        } catch (error) {
            console.error("Delete account failed:", error)
            toast("Failed to delete account: " + error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg card-shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Shield size={20} />
                                Account Settings
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Email Notifications</h3>
                                    <p className="text-sm text-gray-600">Receive updates about your courses and progress</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Language</h3>
                                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                                </div>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Learning Reminders</h3>
                                    <p className="text-sm text-gray-600">Get reminded to continue your courses</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg card-shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <BookOpen size={20} />
                                Learning Preferences
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Video Quality</h3>
                                    <p className="text-sm text-gray-600">Choose video playback quality</p>
                                </div>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Auto</option>
                                    <option>1080p</option>
                                    <option>720p</option>
                                    <option>480p</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Playback Speed</h3>
                                    <p className="text-sm text-gray-600">Default video playback speed</p>
                                </div>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>1x</option>
                                    <option>1.25x</option>
                                    <option>1.5x</option>
                                    <option>2x</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Auto-play Next Lesson</h3>
                                    <p className="text-sm text-gray-600">Automatically play next lesson when current ends</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg card-shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Lock size={20} />
                                Privacy Settings
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Profile Visibility</h3>
                                    <p className="text-sm text-gray-600">Control who can see your profile information</p>
                                </div>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Public</option>
                                    <option>Private</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="font-medium text-foreground">Show Progress</h3>
                                    <p className="text-sm text-gray-600">Display your learning progress publicly</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg card-shadow border border-red-200">
                        <div className="p-6 border-b border-red-200">
                            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                <AlertTriangle size={20} />
                                Danger Zone
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="border border-red-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </p>
                                        <ul className="text-xs text-gray-500 space-y-1">
                                            <li>• All your course progress will be removed</li>
                                            <li>• Certificates and achievements will be deleted</li>
                                            <li>• All personal information will be erased</li>
                                            <li>• This action is irreversible</li>
                                        </ul>
                                        
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Please select a reason for deletion:
                                            </label>
                                            <select
                                                value={deleteReason}
                                                onChange={(e) => setDeleteReason(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="">Select a reason...</option>
                                                <option value="No longer using platform">No longer using platform</option>
                                                <option value="Found a better alternative">Found a better alternative</option>
                                                <option value="Privacy concerns">Privacy concerns</option>
                                                <option value="Too expensive">Too expensive</option>
                                                <option value="Technical issues">Technical issues</option>
                                                <option value="Not satisfied with courses">Not satisfied with courses</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={!deleteReason.trim()}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <AlertTriangle size={16} />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Your Account?"
                message="Are you sure you want to permanently delete your account? This action cannot be undone and all your learning progress will be lost forever."
                confirmText="Delete Account"
                type="danger"
            />
        </div>
    )
}

export default StudentSettings
