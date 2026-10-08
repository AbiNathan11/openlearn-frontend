import { AlertCircle, Home } from "lucide-react"

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center px-4">
                <AlertCircle className="text-warning mx-auto mb-6" size={80} />
                <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
                <p className="text-2xl text-text-secondary mb-4">Page Not Found</p>
                <p className="text-text-muted mb-8 max-w-md">
                    Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <a href="/" className="btn-primary inline-flex items-center gap-2">
                    <Home size={20} />
                    Back to Home
                </a>
            </div>
        </div>
    )
}

export default NotFound
