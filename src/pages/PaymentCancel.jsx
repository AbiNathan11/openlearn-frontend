import { useNavigate } from "react-router-dom"

const PaymentCancel = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg p-8 card-shadow">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h1>
                    <p className="text-text-secondary mb-6">You cancelled the payment. You have not been enrolled in the course.</p>

                    <div className="flex gap-3">
                        <button
                            className="btn-primary"
                            onClick={() => navigate("/student/dashboard")}
                        >
                            Back to Dashboard
                        </button>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                            onClick={() => navigate("/courses")}
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentCancel
