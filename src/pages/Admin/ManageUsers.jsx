import toast from 'react-hot-toast';
"use client"

import { useState, useEffect } from "react"
import { Search, Trash2, Mail, Phone, Power } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getAllUsers, deleteUser } from "../../services/api"
import api from "../../services/api"
import ConfirmModal from "../../components/ConfirmModal"

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const navigate = useNavigate()
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        confirmText: "Confirm",
        type: "danger"
    })

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const response = await getAllUsers()
            if (response.success) {
                const mappedUsers = response.data.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.avatar,
                    phone: user.phone || "-",
                    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
                    status: user.isActive ? "Active" : "Inactive",
                    joinDate: new Date(user.createdAt).toLocaleDateString(),
                }))
                setUsers(mappedUsers)
            }
        } catch (error) {
            console.error("Failed to fetch users:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])


    const handleToggleStatus = (userId, currentStatus) => {
        const newStatus = currentStatus === "Active" ? false : true;
        const action = newStatus ? "activate" : "deactivate";
        
        setConfirmModal({
            isOpen: true,
            title: `${newStatus ? 'Activate' : 'Deactivate'} User?`,
            message: `Are you sure you want to ${action} this user?`,
            confirmText: newStatus ? "Activate" : "Deactivate",
            type: "info",
            onConfirm: async () => {
                try {
                    await api.put(`/users/${userId}/toggle-status`, { isActive: newStatus });
                    setUsers(prevUsers => prevUsers.map(user => 
                        user.id === userId 
                            ? { ...user, status: newStatus ? "Active" : "Inactive" }
                            : user
                    ));
                    toast(`User ${action}d successfully`);
                } catch (error) {
                    console.error(`Failed to ${action} user:`, error);
                    toast(`Failed to ${action} user: ` + (error.response?.data?.message || error.message));
                }
            }
        });
    }

    const handleDelete = (userId) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete User?",
            message: "Are you sure you want to delete this user? This action cannot be undone and they will lose access to all courses.",
            confirmText: "Delete User",
            type: "danger",
            onConfirm: async () => {
                try {
                    await deleteUser(userId);
                    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
                    toast("User deleted successfully");
                } catch (error) {
                    console.error("Delete user failed:", error);
                    toast("Failed to delete user: " + (error.response?.data?.message || error.message || error));
                }
            }
        });
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase()
        return matchesSearch && matchesRole
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterRole])

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

    const colors = [
        "bg-red-500", "bg-blue-500", "bg-green-500", "bg-amber-500",
        "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
        "bg-orange-500", "bg-cyan-500", "bg-lime-600", "bg-rose-500"
    ]

    const getColorFromName = (name) => {
        if (!name) return "bg-gray-400"
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        const index = Math.abs(hash % colors.length)
        return colors[index]
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Manage Users</h1>
                    <p className="text-text-secondary">View and manage all platform users</p>
                </div>

                <div className="bg-white rounded-lg p-6 card-shadow mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="instructor">Instructors</option>
                            <option value="admin">Admins</option>
                        </select>

                        <button className="btn-primary whitespace-nowrap" onClick={() => navigate("/register")}>Add New User</button>
                    </div>
                </div>

                <div className="bg-white rounded-lg card-shadow overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Contact</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Join Date</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden text-white font-bold ${user.profileImage ? "" : getColorFromName(user.name)}`}>
                                                        {user.profileImage ? (
                                                            <img
                                                                src={user.profileImage}
                                                                alt={user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            user.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{user.name}</p>
                                                        <p className="text-sm text-text-secondary">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                        <Mail size={14} />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                        <Phone size={14} />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "Instructor"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : user.role === "Admin"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary text-sm">{user.joinDate}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.status)}
                                                        className={`p-2 transition ${
                                                            user.status === "Active"
                                                                ? "text-text-secondary hover:text-orange-500"
                                                                : "text-text-secondary hover:text-green-500"
                                                        }`}
                                                        title={user.status === "Active" ? "Deactivate User" : "Activate User"}
                                                    >
                                                        <Power size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-text-secondary hover:text-red-500 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoading && filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">No users found matching your criteria</p>
                        </div>
                    )}

                    {!isLoading && filteredUsers.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
                            <div className="text-sm text-text-secondary">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 text-sm font-medium rounded-lg transition ${
                                                currentPage === i + 1
                                                    ? "bg-primary text-white"
                                                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
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

export default ManageUsers
