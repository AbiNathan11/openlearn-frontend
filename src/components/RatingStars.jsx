"use client"

import React from "react"
import { Star } from "lucide-react"

const RatingStars = ({ rating, onRate, interactive = false }) => {
    const [hoverRating, setHoverRating] = React.useState(0)

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => interactive && onRate?.(star)}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    className={`transition ${interactive ? "cursor-pointer" : "cursor-default"}`}
                >
                    <Star
                        size={20}
                        className={`${star <= (hoverRating || rating) ? "fill-warning text-warning" : "text-border"}`}
                    />
                </button>
            ))}
        </div>
    )
}

export default RatingStars
