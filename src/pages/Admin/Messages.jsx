import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Clock, Trash2 } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const API_URL = import.meta.env.VITE_API_URL;

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/contacts/${id}/read`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMessages(messages.map(m => m._id === id ? { ...m, status: "read" } : m));
            }
        } catch (error) {
            console.error("Error updating message", error);
        }
    };

    const handleDelete = (id) => {
        setMessageToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/contacts/${messageToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMessages(messages.filter(m => m._id !== messageToDelete));
            }
        } catch (error) {
            console.error("Error deleting message", error);
        }
    };

    const activeMessages = messages.filter(msg => {
        const createdAt = new Date(msg.createdAt);
        const now = new Date();
        const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
        return diffInDays <= 14;
    });

    if (loading) return <div className="p-8">Loading messages...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">User Messages</h1>
            <div className="grid gap-6">
                {activeMessages.length === 0 ? (
                    <p className="text-gray-500">No recent messages found (last 14 days).</p>
                ) : (
                    activeMessages.map((msg) => (
                        <div key={msg._id} className={`p-6 rounded-2xl border shadow-sm transition-all ${msg.status === "unread" ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        {msg.name}
                                    </h3>
                                    <a href={`mailto:${msg.email}`} className="text-[#0066cc] hover:underline text-sm">{msg.email}</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${msg.status === "unread" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                                        {msg.status === "unread" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                        {msg.status === "unread" ? "Unread" : "Read"}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">{msg.message}</p>
                            {msg.status === "unread" && (
                                <button 
                                    onClick={() => handleMarkAsRead(msg._id)}
                                    className="mt-4 text-sm font-medium text-[#0066cc] hover:text-[#0052a3] flex items-center gap-1"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Message?"
                message="Are you sure you want to delete this support message? This action cannot be undone."
                confirmText="Delete Message"
                type="danger"
            />
        </div>
    );
};

export default Messages;
