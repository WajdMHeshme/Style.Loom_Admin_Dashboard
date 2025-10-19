import { FaStar } from "react-icons/fa";

interface User {
    first_name?: string;
    last_name?: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    isApproved: boolean;
    user?: User;
}

interface Props {
    review: Review;
    approvingId: number | null;
    onToggleApprove: () => void;
}

export default function ReviewCard({ review, approvingId, onToggleApprove }: Props) {
    return (
        <div className="bg-black15 border border-black12 rounded-xl p-5 flex flex-col gap-2 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} size={18} className={i <= review.rating ? "text-yellow-400" : "text-gray-500"} />
                ))}
            </div>

            <p className="text-gray50 flex-1 break-words">{review.comment}</p>

            <div className="mt-2 text-xs text-gray50">
                User: {review.user?.first_name ?? "Unknown"} {review.user?.last_name ?? ""} <br />
                Approved: {review.isApproved ? "Yes" : "No"} <br />
                Date: {new Date(review.createdAt).toLocaleString()}
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    onClick={onToggleApprove}
                    disabled={approvingId === review.id}
                    role="switch"
                    aria-checked={review.isApproved}
                    className={`relative inline-flex items-center w-14 h-7 rounded-full p-1 focus:outline-none transition-all ${approvingId === review.id ? "opacity-60 cursor-not-allowed" : review.isApproved ? "bg-green-600" : "bg-gray-600"
                        }`}
                >
                    <span
                        className={`block w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${review.isApproved ? "translate-x-7" : "translate-x-0"
                            }`}
                    />
                </button>

                <div className="text-sm text-gray50">{review.isApproved ? "Approved" : "Pending"}</div>
            </div>
        </div>
    );
}
