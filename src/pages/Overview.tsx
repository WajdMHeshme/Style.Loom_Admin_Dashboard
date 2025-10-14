import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LoadingWave from "../utils/waveLoader/WaveLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
  userId: number;
  user?: User; // optional because POST response may not include it
}

export default function WebReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // add/edit modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);

  // add form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // approval / action states
  const [approvingId, setApprovingId] = useState<number | null>(null);

  // delete modal states (re-using your FAQ modal pattern)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Review[]>("http://localhost:3000/api/dashboard/webReview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data || []);
      setCurrentPage(1); // reset to first page on fresh load
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Helper: decode JWT payload safely ----------
  const decodeTokenPayload = (rawToken?: string | null) => {
    if (!rawToken) return null;
    try {
      const parts = rawToken.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload as any;
    } catch {
      return null;
    }
  };

  // ---------- Add review ----------
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payloadFromToken = decodeTokenPayload(token);
      // Try to extract user id from token payload (common keys: id, userId, sub)
      const userIdFromToken =
        payloadFromToken?.id ?? payloadFromToken?.userId ?? payloadFromToken?.sub ?? null;

      // Build body: include userId if we found it; otherwise omit and let backend infer from token
      const body: any = { rating, comment };
      if (userIdFromToken) body.userId = userIdFromToken;

      const res = await axios.post("http://localhost:3000/api/webSit", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const created: Review = res.data;

      // If server returned the created review with user included -> add locally
      if (created.user) {
        setReviews((prev) => [created, ...prev]);
      } else {
        // Try to build a temporary user from token (for immediate UI feedback)
        if (userIdFromToken && payloadFromToken) {
          const first_name =
            payloadFromToken.first_name ?? payloadFromToken.name?.split?.(" ")?.[0] ?? "User";
          const last_name = payloadFromToken.last_name ?? payloadFromToken.name?.split?.(" ")?.[1] ?? "";
          const email = payloadFromToken.email ?? "";

          const tempWithUser: Review = {
            ...created,
            user: {
              id: Number(userIdFromToken),
              first_name,
              last_name,
              email,
            },
          };
          setReviews((prev) => [tempWithUser, ...prev]);

          // Also request a full refresh in background (so later data is canonical)
          fetchReviews();
        } else {
          // fallback: re-fetch full reviews (safe)
          await fetchReviews();
        }
      }

      toast.success("Review added successfully!");
      setRating(5);
      setComment("");
      setShowAddModal(false);
    } catch (err: any) {
      console.error("Add review error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    if (!editReview) return;
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(
        `http://localhost:3000/api/dashboard/webReview/${editReview.id}`,
        { rating: editReview.rating, comment: editReview.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated successfully!");
      setEditReview(null);
      await fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle approval state (Approve / Unapprove) — now rendered as a switch with moving circle
  const toggleApprove = async (review: Review) => {
    setApprovingId(review.id);
    try {
      await axios.put(
        `http://localhost:3000/api/dashboard/webReview/${review.id}`,
        { isApproved: !review.isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update locally for immediate feedback
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isApproved: !r.isApproved } : r)));

      toast.success(`Review ${!review.isApproved ? "approved" : "unapproved"} successfully.`);
    } catch (err: any) {
      console.error("Approve toggle error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update approval");
    } finally {
      setApprovingId(null);
    }
  };

  // ---------- Delete helpers (uses FAQ modal style) ----------
  function openDeleteModal(review: Review) {
    setSelectedReview(review);
    setShowDeleteModal(true);
    setTimeout(() => setAnimate(true), 20);
  }

  function closeDeleteModal() {
    setAnimate(false);
    setTimeout(() => {
      setShowDeleteModal(false);
      setSelectedReview(null);
      setDeleteStatus("idle");
      setDeletingId(null);
    }, 180);
  }

  const confirmDelete = async () => {
    if (!selectedReview) return;
    setDeleteStatus("loading");
    setDeletingId(selectedReview.id);
    try {
      await axios.delete(`http://localhost:3000/api/dashboard/webReview/${selectedReview.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove locally
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));

      toast.success("Review deleted successfully.");
      setDeleteStatus("done");

      // adjust pagination if needed
      const newTotal = Math.max(0, reviews.length - 1);
      const newTotalPages = Math.max(1, Math.ceil(newTotal / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      setTimeout(() => closeDeleteModal(), 250);
    } catch (err: any) {
      console.error("Delete error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to delete review";
      toast.error(msg);
      setDeleteStatus("error");
      setDeletingId(null);
    }
  };

  // ---------- pagination derived values ----------
  const totalReviews = reviews.length;
  const totalPages = Math.max(1, Math.ceil(totalReviews / itemsPerPage));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(Math.max(1, totalPages));
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = useMemo(() => reviews.slice(startIndex, endIndex), [reviews, startIndex, endIndex]);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Header */}
      <section className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Web Reviews</h1>
          <p className="text-gray50 mt-1">Manage all web reviews here</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
          >
            Add Review
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Total Reviews</div>
          <div className="text-2xl font-bold text-white mt-1">{totalReviews}</div>
        </div>
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Approved</div>
          <div className="text-2xl font-bold text-white mt-1">{reviews.filter((r) => r.isApproved).length}</div>
        </div>
        <div className="bg-black15 border border-black12 rounded-xl p-4">
          <div className="text-sm text-gray50">Pending</div>
          <div className="text-2xl font-bold text-white mt-1">{reviews.filter((r) => !r.isApproved).length}</div>
        </div>
      </section>

      {/* Reviews Grid (paginated) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex justify-center items-center col-span-full min-h-[200px]">
            <LoadingWave />
          </div>
        ) : totalReviews === 0 ? (
          <p className="text-gray50 col-span-full">No reviews found.</p>
        ) : (
          paginatedReviews.map((r) => (
            <div
              key={r.id}
              className="bg-black15 border border-black12 rounded-xl p-5 flex flex-col gap-2 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} size={18} className={i <= r.rating ? "text-yellow-400" : "text-gray-500"} />
                ))}
              </div>

              <p className="text-gray50 flex-1">{r.comment}</p>

              <div className="mt-2 text-xs text-gray50">
                User: {r.user?.first_name ?? "Unknown"} {r.user?.last_name ?? ""} <br />
                Approved: {r.isApproved ? "Yes" : "No"} <br />
                Date: {new Date(r.createdAt).toLocaleString()}
              </div>

              <div className="mt-3 flex items-center gap-3">
                {/* APPROVE SWITCH */}
                <button
                  onClick={() => toggleApprove(r)}
                  disabled={approvingId === r.id}
                  role="switch"
                  aria-checked={r.isApproved}
                  className={`relative inline-flex items-center w-14 h-7 rounded-full p-1 focus:outline-none transition-all ${
                    approvingId === r.id ? "opacity-60 cursor-not-allowed" : r.isApproved ? "bg-green-600" : "bg-gray-600"
                  }`}
                  aria-label={r.isApproved ? "Unapprove review" : "Approve review"}
                >
                  {/* moving circle */}
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ${
                      r.isApproved ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>

                <div className="text-sm text-gray50">{r.isApproved ? "Approved" : "Pending"}</div>

                <button
                  onClick={() => openDeleteModal(r)}
                  className="ml-auto px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-2"
                >
                  <MdDeleteForever />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Pagination controls */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray50">
          Showing{" "}
          <span className="text-white">{totalReviews === 0 ? 0 : Math.min(startIndex + 1, totalReviews)}</span> —{" "}
          <span className="text-white">{Math.min(endIndex, totalReviews)}</span> of <span className="text-white">{totalReviews}</span>
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
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAddModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-black15 rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Add Review</h2>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                Rating:
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={28}
                      className={`cursor-pointer transition ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-500"}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-1">
                Comment:
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="p-3 rounded-lg bg-white/5 text-gray-200 placeholder-gray-400" rows={4} placeholder="Write your review..." required />
              </label>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-white/5 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition">
                  {submitting ? "Submitting..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditReview(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-black15 rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Review</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                Rating:
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={28}
                      className={`cursor-pointer transition ${star <= (hoverRating || editReview.rating) ? "text-yellow-400" : "text-gray-500"}`}
                      onClick={() => setEditReview({ ...editReview, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-1">
                Comment:
                <textarea value={editReview.comment} onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })} className="p-2 rounded bg-white/5 text-gray-200" rows={4} required />
              </label>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setEditReview(null)} className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-white/5 transition" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition" disabled={submitting}>
                  {submitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Modal (re-used from your FAQ example) */}
      {showDeleteModal && selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
          onClick={closeDeleteModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-black12 rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center text-center transform transition-all duration-300 ${
              animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-6"
            }`}
          >
            <div className="rounded-full p-4 mb-4 text-center bg-red-600">
              <MdDeleteForever size={24} color="#ffffff" />
            </div>

            <h2 className="text-lg font-semibold mb-2 text-gray-50">Confirm Delete</h2>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete this review from{" "}
              <span className="font-semibold">{selectedReview.user?.first_name ?? "Unknown"} {selectedReview.user?.last_name ?? ""}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-200 hover:bg-gray-700 transition"
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
