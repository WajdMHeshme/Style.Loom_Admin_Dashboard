interface Metrics {
    totalUsers: number;
    totalFaqs: number;
    totalReviews: number;
    avgRating: number | string | 0;
    approvedReviews: number;
    pendingReviews: number;
    latestReview?: { id?: number; rating?: number; comment?: string; createdAt?: string } | null;
}

interface Props {
    metrics: Metrics;
}

/**
 * KeyMetricsPanel - displays compact metrics grid and approved/pending small cards
 */
export default function KeyMetricsPanel({ metrics }: Props) {
    return (
        <div className="bg-black15 p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Key Metrics</h2>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black10 rounded">
                    <div className="text-sm text-gray-400">Total Users</div>
                    <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                </div>

                <div className="p-3 bg-black10 rounded">
                    <div className="text-sm text-gray-400">Total FAQs</div>
                    <div className="text-2xl font-bold">{metrics.totalFaqs}</div>
                </div>

                <div className="p-3 bg-black10 rounded">
                    <div className="text-sm text-gray-400">Total Reviews</div>
                    <div className="text-2xl font-bold">{metrics.totalReviews}</div>
                </div>

                <div className="p-3 bg-black10 rounded">
                    <div className="text-sm text-gray-400">Avg Rating</div>
                    <div className="text-2xl font-bold">{metrics.avgRating}</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-sm text-gray-400 mb-1">Reviews (approved / pending)</div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-2 bg-black10 rounded">
                        <div className="text-xs text-gray-400">Approved</div>
                        <div className="font-semibold">{metrics.approvedReviews}</div>
                    </div>
                    <div className="px-3 py-2 bg-black10 rounded">
                        <div className="text-xs text-gray-400">Pending</div>
                        <div className="font-semibold">{metrics.pendingReviews}</div>
                    </div>
                </div>
            </div>

            {metrics.latestReview && (
                <div className="mt-4 text-sm text-gray-300">
                    <div className="text-xs text-gray-400 mb-1">Latest review</div>
                    <div className="bg-black10 p-3 rounded">{metrics.latestReview.comment ?? "(no text)"} — <span className="text-xs text-gray-400">#{metrics.latestReview.id}</span></div>
                </div>
            )}
        </div>
    );
}
