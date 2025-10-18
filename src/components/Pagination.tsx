interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    startIndex?: number;
    endIndex?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex }: Props) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {totalItems !== undefined && startIndex !== undefined && endIndex !== undefined && (
                <div className="text-sm text-gray-400">
                    Showing <span className="text-white">{Math.min(startIndex + 1, totalItems)}</span>
                    {" — "}
                    <span className="text-white">{Math.min(endIndex, totalItems)}</span>
                    {" of "}
                    <span className="text-white">{totalItems}</span>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
                        }`}
                >
                    Prev
                </button>

                <div className="flex items-center gap-1">
                    {pageNumbers.map((num) => (
                        <button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === num ? "bg-brown70 text-white" : "bg-transparent text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
