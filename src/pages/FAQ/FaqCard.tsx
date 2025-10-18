import type { Faq } from "../../redux/features/faqSlice";

interface Props {
    faq: Faq;
    onEdit: (faq: Faq) => void;
    onDelete: (faq: Faq) => void;
    onToggleActive: (faq: Faq) => void;
    deleting?: boolean;
}

export default function FaqCard({ faq, onEdit, onDelete, onToggleActive, deleting }: Props) {
    return (
        <article className="bg-black15 border border-black12 rounded-xl p-5 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <div className="text-right text-xs text-gray50">
                        <div>#{faq.id}</div>
                        <div>{new Date(faq.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <p className="mt-3 text-gray50 whitespace-pre-wrap">{faq.answer}</p>
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-white">{faq.category}</span>
                    <span className={`text-xs px-2 py-1 rounded ${faq.isActive ? "bg-green-700" : "bg-red-700"} text-white`}>
                        {faq.isActive ? "Active" : "Not Active"}
                    </span>
                </div>
                {faq.attachments?.length && (
                    <div className="mt-3 text-sm text-gray50">
                        Attachments:{" "}
                        {faq.attachments.map((a) => (
                            <a key={a.url} href={a.url} target="_blank" rel="noreferrer" className="underline text-brown70 mr-2">
                                {a.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-stretch gap-2">
                <button onClick={() => onEdit(faq)} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white">
                    Edit
                </button>
                <button
                    onClick={() => onDelete(faq)}
                    disabled={deleting}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm text-white disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                    onClick={() => onToggleActive(faq)}
                    className="px-3 py-2 rounded-lg bg-brown70 hover:bg-brown65 text-sm text-white"
                >
                    Toggle Active
                </button>
            </div>
        </article>
    );
}
