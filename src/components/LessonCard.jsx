import { Play, BookOpen, CheckCircle } from "lucide-react"

const LessonCard = ({ title, type = "video", duration, completed = false }) => {
    const getIcon = () => {
        if (completed) return <CheckCircle className="text-success" size={20} />
        if (type === "video") return <Play className="text-primary" size={20} />
        return <BookOpen className="text-primary" size={20} />
    }

    return (
        <div className="p-4 bg-surface rounded-lg border border-border hover:border-primary transition flex items-start gap-4">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-sm text-text-secondary">
                    {type === "video" ? "Video" : "Reading"} • {duration}
                </p>
            </div>
            {completed && <span className="text-xs font-bold text-success">Completed</span>}
        </div>
    )
}

export default LessonCard
