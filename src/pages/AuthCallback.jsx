import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const userStr = searchParams.get("user");

        if (token && refreshToken && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                
                // Store tokens and user info
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                // Redirect based on role
                const role = user.role;
                if (role === "admin") {
                    navigate("/admin");
                } else if (role === "instructor") {
                    navigate("/instructor/dashboard");
                } else {
                    navigate("/student/dashboard");
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login?error=invalid_data");
            }
        } else {
            navigate("/login?error=missing_data");
        }
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-text-secondary">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
