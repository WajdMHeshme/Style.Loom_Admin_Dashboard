// src/pages/FAQList.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/Api";
import { MdDeleteForever } from "react-icons/md";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  attachments?: { name: string; url: string }[];
}

export default function FAQList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

  // pagination
  const itemsPerPage = 2; // عرض 2 سكشن لكل صفحة
  const [currentPage, setCurrentPage] = useState<number>(1);

  // show toast from navigation state (like Products.tsx)
  useEffect(() => {
    const anyState = (location.state as any) ?? {};
    if (anyState.toast && anyState.toast.message) {
      const { type = "success", message = "" } = anyState.toast;
      switch (type) {
        case "error":
        case "danger":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        case "warn":
        case "warning":
          toast.warn(message);
          break;
        default:
          toast.success(message);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await api.get<Faq[]>("/dashboard/faq");
        setFaqs(res.data || []);
        setCurrentPage(1); // reset to first page on fresh load
      } catch (err: any) {
        console.error("Fetch FAQs error:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load FAQs");
      } finally {
        setFetching(false);
      }
    };
    fetchFaqs();
  }, []);

  // derived values for pagination and stats
  const totalItems = faqs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ensure currentPage valid when faqs change (e.g., after delete)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = useMemo(() => faqs.slice(startIndex, endIndex), [faqs, startIndex, endIndex]);

  const activeCount = faqs.filter((f) => f.isActive).length;
  const inactiveCount = totalItems - activeCount;

  // --- new modal helpers ---
  function openDeleteModal(faq: Faq) {
    setSelectedFaq(faq);
    setShowDeleteModal(true);
    // start animate in next tick so transition classes apply
    setTimeout(() => setAnimate(true), 20);
  }

  function closeDeleteModal() {
    setAnimate(false);
    // wait for animation to finish
    setTimeout(() => {
      setShowDeleteModal(false);
      setSelectedFaq(null);
      setDeleteStatus("idle");
    }, 180);
  }

  const confirmDelete = async () => {
    if (!selectedFaq) return;
    setDeleteStatus("loading");
    setDeletingId(selectedFaq.id);
    try {
      await api.delete(`/dashboard/faq/${selectedFaq.id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== selectedFaq.id));
      toast.success("FAQ deleted successfully.");
      // adjust page if needed
      const newTotal = totalItems - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      setDeleteStatus("done");
      // close modal after short delay
      setTimeout(() => {
        closeDeleteModal();
      }, 300);
    } catch (err: any) {
      console.error("Delete FAQ error:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to delete FAQ";
      toast.error(msg);
      setDeleteStatus("error");
      setDeletingId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (id: number) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) {
      toast.error("FAQ not found");
      return;
    }
    openDeleteModal(faq);
  };

  const toggleActive = async (f: Faq) => {
    const newVal = !f.isActive;
    // optimistic UI
    setFaqs((prev) => prev.map((x) => (x.id === f.id ? { ...x, isActive: newVal } : x)));
    try {
      await api.put(`/dashboard/faq/${f.id}`, {
        question: f.question,
        answer: f.answer,
        category: f.category,
        isActive: newVal,
      });
      toast.success("FAQ status updated.");
    } catch (err: any) {
      console.error("Toggle active error:", err);
      // rollback
      setFaqs((prev) => prev.map((x) => (x.id === f.id ? { ...x, isActive: f.isActive } : x)));
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Header */}
      <section className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">FAQs</h1>
          <p className="text-gray50 mt-1">FAQs List Here </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/add-faq")}
            className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
          >
            Add FAQ
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Total</div>
          <div className="text-2xl font-bold text-white mt-1">{totalItems}</div>
        </div>
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Active</div>
          <div className="text-2xl font-bold text-white mt-1">{activeCount}</div>
        </div>
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Not Active</div>
          <div className="text-2xl font-bold text-white mt-1">{inactiveCount}</div>
        </div>
      </section>

      {/* Cards list (paginated sections) */}
      <section className="space-y-4">
        {fetching ? (
          <div className="text-gray50">Loading FAQs...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : totalItems === 0 ? (
          <div className="text-gray50">No FAQs yet.</div>
        ) : (
          paginatedFaqs.map((f) => (
            <article
              key={f.id}
              className="bg-black15 border border-black12 rounded-xl p-5 flex flex-col md:flex-row gap-4"
            >
              {/* Left: question + meta */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{f.question}</h3>

                  <div className="text-right">
                    <div className="text-sm text-gray50">#{f.id}</div>
                    <div className="text-xs text-gray50 mt-1">{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <p className="mt-3 text-gray50 whitespace-pre-wrap">{f.answer}</p>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded bg-white/5 text-white">{f.category}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${f.isActive ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}
                  >
                    {f.isActive ? "Active" : "Not Active"}
                  </span>
                </div>

                {f.attachments && f.attachments.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-gray50 mb-1">Attachments:</div>
                    <ul className="flex flex-wrap gap-2">
                      {f.attachments.map((a, i) => (
                        <li key={i}>
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-brown70 underline hover:text-brown65"
                          >
                            {a.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right: actions */}
              <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-stretch gap-2">
                <button
                  onClick={() => navigate(`/dashboard/edit-faq/${f.id}`, { state: { faq: f } })}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id || deleteStatus === "loading"}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm text-white disabled:opacity-50"
                >
                  {deletingId === f.id || (selectedFaq?.id === f.id && deleteStatus === "loading") ? "Deleting..." : "Delete"}
                </button>

                <button
                  onClick={() => toggleActive(f)}
                  className="px-3 py-2 rounded-lg bg-brown70 hover:bg-brown65 text-sm text-white"
                >
                  Toggle Active
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Pagination controls */}
      <section className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray50">
          Showing{" "}
          <span className="text-white">
            {totalItems === 0 ? 0 : Math.min(startIndex + 1, totalItems)}
          </span>
          {" — "}
          <span className="text-white">{Math.min(endIndex, totalItems)}</span>
          {" of "}
          <span className="text-white">{totalItems}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"}`}
          >
            Prev
          </button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === num ? "bg-brown70 text-white" : "bg-transparent text-gray-200 hover:bg-white/5"}`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"}`}
          >
            Next
          </button>
        </div>
      </section>

      {/* Custom Delete Modal */}
      {showDeleteModal && selectedFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
          onClick={closeDeleteModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-black12 rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center text-center transform transition-all duration-300 ${animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-6"
              }`}
          >
            <div className="rounded-full p-4 mb-4 text-center bg-red-600">
              <MdDeleteForever size={24} color="#ffffff" />
            </div>

            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedFaq.question}</span>? This action
              cannot be undone.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled={deleteStatus === "loading"}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition"
                disabled={deleteStatus === "loading"}
              >
                {deleteStatus === "loading" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
