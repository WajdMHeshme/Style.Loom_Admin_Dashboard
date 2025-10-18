// src/pages/FAQEdit.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/Api";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function FAQEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) ?? {};

  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [category, setCategory] = useState<string>("ALL");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    // Use navState.faq if present (fast)
    if (navState.faq) {
      const f: Faq = navState.faq;
      setFaq(f);
      setQuestion(f.question ?? "");
      setAnswer(f.answer ?? "");
      setCategory(f.category ?? "ALL");
      setIsActive(typeof f.isActive === "boolean" ? f.isActive : true);
      setLoading(false);
      return;
    }

    // otherwise fetch from API
    if (!id) {
      setError("Missing FAQ id.");
      setLoading(false);
      return;
    }

    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Faq>(`/dashboard/faq/${id}`);
        setFaq(res.data);
        setQuestion(res.data.question ?? "");
        setAnswer(res.data.answer ?? "");
        setCategory(res.data.category ?? "ALL");
        setIsActive(res.data.isActive ?? true);
      } catch (err: any) {
        console.error("Fetch FAQ error:", err);
        const status = err?.response?.status;
        if (status === 404) {
          // redirect to list with toast
          navigate("/dashboard/faq", { state: { toast: { type: "error", message: "FAQ not found." } } });
          return;
        }
        setError(err?.response?.data?.message || err.message || "Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id, navState, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    if (!id) {
      setError("Missing FAQ id.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category,
        isActive,
      };
      // PUT to update (your API: PUT /api/dashboard/faq/:id)
      await api.put(`/dashboard/faq/${id}`, payload);

      navigate("/dashboard/faq", {
        state: { toast: { type: "success", message: "FAQ updated successfully." } },
      });
    } catch (err: any) {
      console.error("Update FAQ error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to update FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black12 p-6">
        <p className="text-gray50">Loading FAQ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black12 p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">Edit FAQ</h1>
      <p className="text-gray50 mb-6">Update the fields then save changes.</p>

      <div className="bg-black15 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
        {/* Left: Preview */}
        <div className="flex flex-col items-center w-full md:w-[48%]">
          <label className="w-full h-72 min-h-64 bg-black12 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brown70 cursor-default transition">
            {question || answer ? (
              <div className="p-4 text-left w-full">
                <h3 className="text-white text-lg font-semibold mb-2">{question || "Question preview"}</h3>
                <p className="text-gray50">{answer || "Answer preview"}</p>
                <div className="mt-4 text-sm text-gray50">
                  <span className="inline-block mr-3">Category: <strong className="text-white">{category}</strong></span>
                  <span>Active: <strong className="text-white">{isActive ? "Yes" : "No"}</strong></span>
                  {faq?.createdAt && (
                    <div className="mt-2 text-xs text-gray50">Created: {new Date(faq.createdAt).toLocaleString()}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-brown70">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L19 6V13C19 17.418 15.418 21 11 21C6.582 21 3 17.418 3 13C3 8.582 6.582 5 11 5H12V2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm mt-2 text-brown70">FAQ Preview</span>
                <span className="text-xs mt-1 text-gray50">Type question & answer to preview</span>
              </div>
            )}
          </label>
        </div>

        {/* Right: Form */}
        <div className="flex-1 space-y-4 w-full md:w-[48%]">
          {error && <div className="mb-3 text-red-500">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray90">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer"
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray90">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
              >
                <option value="ALL">All</option>
                <option value="SHIPPING">Shipping</option>
                <option value="ORDERING">Ordering</option>
                <option value="RETURNS">Returns</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray90">Active</label>
              <div className="mt-1">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border border-gray50 bg-black12"
                  />
                  <span className="text-sm text-gray90">Is Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => navigate("/dashboard/faq")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-white text-sm cursor-pointer"
              type="button"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-brown70 text-white hover:bg-brown65 transition cursor-pointer"
              type="button"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
