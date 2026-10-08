import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { confirmCoursePayment } from "../services/api"

const PaymentSuccess = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("Confirming your payment...")

    useEffect(() => {
        const run = async () => {
            const sessionId = searchParams.get("session_id")

            if (!sessionId) {
                setStatus("error")
                setMessage("Missing session_id. Please contact support.")
                return
            }

            const token = localStorage.getItem("token")
            if (!token) {
                setStatus("error")
                setMessage("You must be logged in to confirm payment.")
                return
            }

            try {
                await confirmCoursePayment(sessionId)
                setStatus("success")
                setMessage("Payment successful. You are now enrolled!")

                setTimeout(() => {
                    navigate("/student/dashboard")
                }, 1200)
            } catch (err) {
                setStatus("error")
                setMessage(typeof err === "string" ? err : "Failed to confirm payment")
            }
        }

        run()
    }, [navigate, searchParams])

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg p-8 card-shadow">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Payment Status</h1>
                    <p className="text-text-secondary mb-6">{message}</p>

                    {status === "error" && (
                        <div className="flex gap-3">
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/student/dashboard")}
                            >
                                Go to Dashboard
                            </button>
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                                onClick={() => navigate("/courses")}
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
