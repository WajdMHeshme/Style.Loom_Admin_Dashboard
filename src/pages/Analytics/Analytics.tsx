import { useEffect, useMemo, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsers } from "../../redux/features/usersSlice";
import { fetchFaqs } from "../../redux/features/faqSlice";
import { fetchReviews } from "../../redux/features/reviewsSlice";
import { fetchProducts } from "../../redux/features/productsSlice";

import UsersGrowthChart from "./UsersGrowthChart";
import KeyMetricsPanel from "./KeyMetricsPanel";
import ReviewsDistribution from "./ReviewsDistribution";
import FaqsAreaChart from "./FaqsAreaChart";

export default function Analytics(): JSX.Element {
  const dispatch = useAppDispatch();

  const users = useAppSelector((s) => s.users.items);
  const usersStatus = useAppSelector((s) => s.users.status);
  const usersError = useAppSelector((s) => s.users.error);

  const faqs = useAppSelector((s) => s.faq.items);
  const faqsLoading = useAppSelector((s) => s.faq.loading);
  const faqsError = useAppSelector((s) => s.faq.error);

  const reviews = useAppSelector((s) => s.reviews.list);
  const reviewsLoading = useAppSelector((s) => s.reviews.loading);
  const reviewsError = useAppSelector((s) => s.reviews.error);

  const productsStatus = useAppSelector((s) => s.products.status);
  const productsError = useAppSelector((s) => s.products.error);

  const loading = usersStatus === "loading" || reviewsLoading || faqsLoading || productsStatus === "loading";
  const error = usersError || reviewsError || faqsError || productsError || null;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchReviews());
    dispatch(fetchFaqs());
    dispatch(fetchProducts());
  }, [dispatch]);

  // metrics
  const metrics = useMemo(() => {
    const totalUsers = (users || []).length;
    const totalFaqs = (faqs || []).length;
    const totalReviews = (reviews || []).length;
    const approvedReviews = (reviews || []).filter((r) => Boolean(r.isApproved)).length;
    const pendingReviews = totalReviews - approvedReviews;
    const avgRating =
      totalReviews > 0 ? +(reviews.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / totalReviews).toFixed(2) : 0;
    const latestReview =
      reviews && reviews.length > 0 ? [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;
    return { totalUsers, totalFaqs, totalReviews, approvedReviews, pendingReviews, avgRating, latestReview };
  }, [users, reviews, faqs]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray50 mt-2">Loading data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <UsersGrowthChart users={users} />
        <KeyMetricsPanel metrics={metrics} />
        <ReviewsDistribution reviews={reviews} />
        <FaqsAreaChart faqs={faqs} />
      </div>
    </div>
  );
}
