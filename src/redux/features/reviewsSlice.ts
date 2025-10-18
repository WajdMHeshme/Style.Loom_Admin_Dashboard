// src/features/reviewsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/Api";

// ---------- Types ----------
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
  userId: number;
  user?: User;
}

// ---------- Async Thunks ----------
export const fetchReviews = createAsyncThunk("reviews/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<Review[]>("/dashboard/webReview");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch reviews");
  }
});

export const addReview = createAsyncThunk(
  "reviews/add",
  async (payload: { rating: number; comment: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<Review>("/webSit", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to add review");
    }
  }
);

export const editReview = createAsyncThunk(
  "reviews/edit",
  async (payload: { id: number; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<Review>(`/dashboard/webReview/${payload.id}`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to edit review");
    }
  }
);

export const deleteReview = createAsyncThunk("reviews/delete", async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/dashboard/webReview/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete review");
  }
});

export const toggleApproveReview = createAsyncThunk("reviews/toggleApprove", async (review: Review, { rejectWithValue }) => {
  try {
    const res = await api.put<Review>(`/dashboard/webReview/${review.id}`, { isApproved: !review.isApproved });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to toggle approval");
  }
});

// ---------- Slice ----------
interface ReviewsState {
  list: Review[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  approvingId: number | null;
  deletingId: number | null;
}

const initialState: ReviewsState = {
  list: [],
  loading: false,
  submitting: false,
  error: null,
  approvingId: null,
  deletingId: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setApprovingId(state, action: PayloadAction<number | null>) {
      state.approvingId = action.payload;
    },
    setDeletingId(state, action: PayloadAction<number | null>) {
      state.deletingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addReview
      .addCase(addReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.submitting = false;
        state.list.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      // editReview
      .addCase(editReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.list = state.list.map((r) => (r.id === action.payload.id ? action.payload : r));
      })
      // deleteReview
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      })
      // toggleApproveReview
      .addCase(toggleApproveReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.list = state.list.map((r) => (r.id === action.payload.id ? action.payload : r));
      });
  },
});

export const { setApprovingId, setDeletingId } = reviewsSlice.actions;
export default reviewsSlice.reducer;
