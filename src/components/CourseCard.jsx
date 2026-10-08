import { Star, Users } from "lucide-react"

const CourseCard = ({ id, title, description, instructor, rating, students, image, price }) => {
    return (
        <div className="card-shadow bg-white rounded-lg overflow-hidden hover:scale-105 transition-transform">
            {/* Course Image */}
            <div className="h-48 bg-surface relative overflow-hidden">
                <img
                    src={image || "/placeholder.svg?height=192&width=100%&query=course-thumbnail"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${price}
                </div>
            </div>

            {/* Course Info */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{title}</h3>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">{description}</p>

                {/* Instructor */}
                <p className="text-sm text-text-muted mb-3">by {instructor}</p>

                {/* Rating and Students */}
                <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-warning text-warning" />
                        <span className="font-medium">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-secondary">
                        <Users size={16} />
                        <span>{students} students</span>
                    </div>
                </div>

                {/* Enroll Button */}
                <button className="btn-primary w-full">Enroll Now</button>
            </div>
        </div>
    )
}

export default CourseCard
