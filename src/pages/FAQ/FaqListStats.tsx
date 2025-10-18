interface Props {
    total: number;
    active: number;
    inactive: number;
}

export default function FaqListStats({ total, active, inactive }: Props) {
    return (
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Total</div>
                <div className="text-2xl font-bold text-white mt-1">{total}</div>
            </div>
            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Active</div>
                <div className="text-2xl font-bold text-white mt-1">{active}</div>
            </div>
            <div className="bg-black15 border border-black12 rounded-xl p-4">
                <div className="text-sm text-gray50">Not Active</div>
                <div className="text-2xl font-bold text-white mt-1">{inactive}</div>
            </div>
        </section>
    );
}
