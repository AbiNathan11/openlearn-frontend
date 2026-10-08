import axios from "axios";
import { refreshAccessToken, clearAuth } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue the request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                processQueue(null, newToken);
                
                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Refresh failed, clear auth and redirect to login
                clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", {
            name: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: userData.userType,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to process forgot password request";
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post("/auth/reset-password", { token, newPassword });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to reset password";
    }
};

export const getProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch profile";
    }
};

export const updateProfile = async (userData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await api.put("/auth/me", userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update profile";
    }
};



// Course Services
export const createCourse = async (courseData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/courses", courseData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || error.response?.data?.message || "Failed to create course";
    }
};

export const getCourses = async () => {
    try {
        const response = await api.get("/courses");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch courses";
    }
};

export const getInstructorCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/my-courses", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch instructor courses";
    }
};

export const getCourseById = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch course";
    }
};

export const updateCourse = async (id, courseData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/courses/${id}`, courseData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update course";
    }
};

export const deleteCourse = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete course";
    }
};

export const enrollCourse = async (courseId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/courses/${courseId}/enroll`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to enroll in course";
    }
};

export const confirmCoursePayment = async (sessionId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/payment/confirm", { sessionId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to confirm payment";
    }
};

export const getEnrolledCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/enrolled", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch enrolled courses";
    }
};

export const getCourseProgress = async (courseId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/courses/${courseId}/progress`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch course progress";
    }
};

export const getStudentDashboardStats = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/student/dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch student dashboard statistics";
    }
};

export const markLessonComplete = async (courseId, lessonId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to mark lesson complete";
    }
};

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch users";
    }
};

export const deactivateAccount = async (reason) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/auth/deactivate-account", { reason }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to deactivate account";
    }
};

export const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete user";
    }
};


// Admin Course Approval Services
export const getAllCoursesAdmin = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/admin/all", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch admin courses";
    }
};

export const getPendingCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/admin/pending", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch pending courses";
    }
};

export const approveCourse = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/courses/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to approve course";
    }
};

export const rejectCourse = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/courses/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to reject course";
    }
};

// Get all courses for the authenticated student
export const getStudentCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/courses/enrolled", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch courses";
    }
};

// Generate AI Summary
export const generateAISummary = async (courseId, lessonId) => {
    try {
        console.log('=== API Service generateAISummary ===');
        console.log('Course ID:', courseId);
        console.log('Lesson ID:', lessonId);

        const token = localStorage.getItem("token");
        console.log('Token in API service:', !!token);

        const response = await api.post("/ai-summary/generate", {
            courseId,
            lessonId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error('=== API Service Error ===');
        console.error('Error:', error);
        console.error('Error response:', error.response);
        throw error.response?.data?.message || "Failed to generate AI summary";
    }
};

// Generate Quiz Questions
export const generateQuizQuestions = async (courseId, questionCount = 5) => {
    try {
        console.log('=== API Service generateQuizQuestions ===');
        console.log('Course ID:', courseId);
        console.log('Question Count:', questionCount);

        const token = localStorage.getItem("token");
        console.log('Token in API service:', !!token);

        const response = await api.post("/quiz/generate", {
            courseId,
            questionCount
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Quiz API Response:', response);
        return response.data;
    } catch (error) {
        console.error('=== Quiz API Service Error ===');
        console.error('Error:', error);
        console.error('Error response:', error.response);
        throw error.response?.data?.message || "Failed to generate quiz questions";
    }
};

// Rating Service
export const submitRating = async (courseId, ratingData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/ratings/submit", {
            courseId,
            ...ratingData
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data; // Corrected: return .data directly as axios wraps it
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to submit rating";
    }
};

export const getInstructorRatings = async (instructorId) => {
    try {
        const response = await api.get(`/ratings/instructor/${instructorId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to get instructor ratings";
    }
};

export const getCourseRatings = async (courseId, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/ratings/course/${courseId}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to get course ratings";
    }
};

export const canRateCourse = async (courseId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/ratings/can-rate/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to check rating eligibility";
    }
};

export const getStudentRatingHistory = async (page = 1, limit = 10) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/ratings/my-history?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to get rating history";
    }
};

export const updateRating = async (ratingId, ratingData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/ratings/${ratingId}`, ratingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to update rating";
    }
};

export const deleteRating = async (ratingId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/ratings/${ratingId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || "Failed to delete rating";
    }
};

// AI Chat Service
export const sendAIChatMessage = async (message, courseId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post("/chat", {
            message,
            courseId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to send message";
    }
};

export const checkAIChatHealth = async () => {
    try {
        const response = await api.get("/chat/health");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to check AI service";
    }
};

export const getAdminDashboardData = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch dashboard data";
    }
};

export const getAdminReportsData = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/reports", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch reports data";
    }
};

export default api;
