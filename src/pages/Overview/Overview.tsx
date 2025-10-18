import { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchReviews, toggleApproveReview } from "../../redux/features/reviewsSlice";
import LoadingWave from "../../utils/waveLoader/WaveLoader";
import ReviewCard from "./ReviewCard";
import Pagination from "../../components/Pagination";
import ReviewStats from "./ReviewStats"; 

export default function WebReviewDashboard() {
  const dispatch = useAppDispatch();
  const { list: reviews, loading, approvingId } = useAppSelector((state) => state.reviews);

  // Pagination
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = useMemo(() => reviews.slice(startIndex, endIndex), [reviews, startIndex, endIndex]);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleToggleApprove = async (review: any) => {
    try {
      await dispatch(toggleApproveReview(review)).unwrap();
    } catch (err: any) {
      console.error("Approve toggle error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <section className="mb-4">
        <h1 className="text-2xl font-semibold text-white">Web Reviews</h1>
        <p className="text-gray50 mt-1">Manage all web reviews here</p>
      </section>

      {/* Stats (component) */}
      <ReviewStats reviews={reviews} />

      {/* Reviews Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex justify-center items-center col-span-full min-h-[200px]">
            <LoadingWave />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray50 col-span-full">No reviews found.</p>
        ) : (
          paginatedReviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              approvingId={approvingId}
              onToggleApprove={() => handleToggleApprove(r)}
            />
          ))
        )}
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={reviews.length}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}
