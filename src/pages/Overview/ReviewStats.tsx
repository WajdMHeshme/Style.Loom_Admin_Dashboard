interface Props {
    reviews: any[];
}

export default function ReviewStats({ reviews }: Props) {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.isApproved).length;
    const pending = total - approved;

    return (
        <section className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Total Reviews</div>
                <div className="text-2xl font-bold text-white mt-1">{total}</div>
            </div>

            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Approved</div>
                <div className="text-2xl font-bold text-white mt-1">{approved}</div>
            </div>

            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Pending</div>
                <div className="text-2xl font-bold text-white mt-1">{pending}</div>
            </div>
        </section>
    );
}
