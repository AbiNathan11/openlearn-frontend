// Authentication verification utilities

const API_URL = import.meta.env.VITE_API_URL;

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

// Check if user is a student
export const isStudent = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "student";
};

// Get current user info
export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Validate token format (JWT structure)
export const isTokenValidFormat = (token) => {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
};

// Decode JWT payload (for basic validation)
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if token is expired
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};

// Comprehensive authentication check
export const verifyStudentAuth = async () => {
    const token = getToken();
    const user = getCurrentUser();
    
    console.log('=== Student Auth Verification ===');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    console.log('User role:', user?.role);
    console.log('Token format valid:', isTokenValidFormat(token));
    
    if (!token) {
        return {
            valid: false,
            error: 'No token found - user not logged in'
        };
    }
    
    if (!isTokenValidFormat(token)) {
        return {
            valid: false,
            error: 'Invalid token format'
        };
    }
    
    if (!user) {
        return {
            valid: false,
            error: 'No user data found'
        };
    }
    
    if (user.role !== 'student') {
        return {
            valid: false,
            error: 'User is not a student. Current role: ' + user.role
        };
    }
    
    if (isTokenExpired(token)) {
        return {
            valid: false,
            error: 'Token has expired'
        };
    }
    
    // Try to validate token with backend
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return {
                valid: false,
                error: `Backend validation failed: ${response.status} ${response.statusText}`
            };
        }
        
        const data = await response.json();
        console.log('Backend validation successful:', data);
        
        return {
            valid: true,
            user: data,
            token: token
        };
        
    } catch (error) {
        return {
            valid: false,
            error: `Backend validation error: ${error.message}`
        };
    }
};

// Get refresh token
export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// Store tokens
export const storeTokens = (token, refreshToken, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
};

// Refresh access token
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Token refresh failed');
        }

        // Update stored tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        
        return data.token;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

// Check if token needs refresh (expires within 5 minutes)
export const shouldRefreshToken = (token) => {
    if (!token) return false;
    
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return false;
        
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;
        
        // Refresh if token expires within 5 minutes (300 seconds)
        return timeUntilExpiry < 300;
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return false;
    }
};

// Clear authentication data
export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};
