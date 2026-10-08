const ProgressBar = ({ label, percentage, color = "bg-primary" }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <span className="text-sm font-bold text-primary">{percentage}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}

export default ProgressBar
