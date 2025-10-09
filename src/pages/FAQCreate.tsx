// src/pages/FAQCreate.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Api";

export default function FAQCreate() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [category, setCategory] = useState<string>("ALL");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("ALL");
    setIsActive(true);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
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
      await api.post("/dashboard/faq", payload);

      // navigate back to list and show toast (matches Products.tsx pattern)
      navigate("/dashboard/faq", {
        state: { toast: { type: "success", message: "FAQ created successfully." } },
      });
    } catch (err: any) {
      console.error("Create FAQ error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to create FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black12 p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">Add FAQ</h1>
      <p className="text-gray50 mb-6">Fill in the fields and add a new FAQ.</p>

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
              {submitting ? "Adding..." : "Add FAQ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
