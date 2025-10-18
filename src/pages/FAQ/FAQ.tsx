// src/pages/FAQList.tsx
import { useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { type Faq, fetchFaqs, deleteFaq, toggleFaqActive } from "../../redux/features/faqSlice";
import FaqCard from "./FaqCard";
import Pagination from "../../components/Pagination";
import DeleteModal from "./DeleteModal";
import FaqListStats from "./FaqListStats";

export default function FAQ(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { items: faqs, loading, error } = useAppSelector((state) => state.faq);

  // pagination (local UI state)
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItems = faqs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedFaqs = useMemo(() => faqs.slice(startIndex, endIndex), [faqs, startIndex, endIndex]);

  // delete modal state
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // fetch on mount
  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  // show toast from navigation state (create/edit pages)
  useEffect(() => {
    const ns = (location.state as any) ?? {};
    if (ns.toast?.message) {
      const { type = "success", message } = ns.toast;
      // call toast[type] if exists else success
      (toast as any)[type] ? (toast as any)[type](message) : toast.success(message);
      // clear nav state
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep currentPage valid if faqs length changed (e.g., after delete)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(Math.max(1, totalPages));
  }, [totalPages, currentPage]);

  const activeCount = faqs.filter((f) => f.isActive).length;
  const inactiveCount = totalItems - activeCount;

  // handlers
  const onAdd = () => navigate("/dashboard/add-faq");

  const onEdit = (faq: Faq) => navigate(`/dashboard/edit-faq/${faq.id}`, { state: { faq } });

  const onRequestDelete = (faq: Faq) => {
    setSelectedFaq(faq);
  };

  const onConfirmDelete = async () => {
    if (!selectedFaq) return;
    setDeleting(true);
    try {
      await dispatch(deleteFaq(selectedFaq.id)).unwrap();
      toast.success("FAQ deleted successfully.");
      // adjust page if needed (items length decreased by 1)
      const newTotalPages = Math.max(1, Math.ceil((totalItems - 1) / itemsPerPage));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    } catch (err) {
      console.error("delete error", err);
      toast.error("Failed to delete FAQ");
    } finally {
      setDeleting(false);
      setSelectedFaq(null);
    }
  };

  const onToggleActive = async (faq: Faq) => {
    try {
      await dispatch(toggleFaqActive({ id: faq.id, isActive: !faq.isActive })).unwrap();
      toast.success("FAQ status updated.");
    } catch (err) {
      console.error("toggle error", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Header */}
      <section className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">FAQs</h1>
          <p className="text-gray50 mt-1">FAQs List Here</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
          >
            Add FAQ
          </button>
        </div>
      </section>

      {/* Stats */}
      <FaqListStats total={totalItems} active={activeCount} inactive={inactiveCount} />

      {/* Cards list */}
      <section className="space-y-4">
        {loading ? (
          <div className="text-gray50">Loading FAQs...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : totalItems === 0 ? (
          <div className="text-gray50">No FAQs yet.</div>
        ) : (
          paginatedFaqs.map((f) => (
            <FaqCard
              key={f.id}
              faq={f}
              onEdit={() => onEdit(f)}
              onDelete={() => onRequestDelete(f)}
              onToggleActive={() => onToggleActive(f)}
              deleting={deleting && selectedFaq?.id === f.id}
            />
          ))
        )}
      </section>

      {/* Pagination (re-using your component) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {/* Delete modal */}
      <DeleteModal
        show={!!selectedFaq}
        itemName={selectedFaq?.question ?? ""}
        onCancel={() => setSelectedFaq(null)}
        onConfirm={onConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
