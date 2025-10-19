// src/features/faqSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/Api";

export interface Faq {
    id: number;
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    attachments?: { name: string; url: string }[];
}

interface FaqState {
    items: Faq[];
    loading: boolean;
    error: string | null;
}

const initialState: FaqState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchFaqs = createAsyncThunk("faq/fetchFaqs", async () => {
    const res = await api.get<Faq[]>("/dashboard/faq");
    return res.data;
});

export const deleteFaq = createAsyncThunk("faq/deleteFaq", async (id: number) => {
    await api.delete(`/dashboard/faq/${id}`);
    return id;
});

export const toggleFaqActive = createAsyncThunk(
    "faq/toggleActive",
    async ({ id, isActive }: { id: number; isActive: boolean }) => {
        await api.put(`/dashboard/faq/${id}`, { isActive });
        return { id, isActive };
    }
);

const faqSlice = createSlice({
    name: "faq",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFaqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFaqs.fulfilled, (state, action: PayloadAction<Faq[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFaqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load FAQs";
            })
            .addCase(deleteFaq.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((f) => f.id !== action.payload);
            })
            .addCase(toggleFaqActive.fulfilled, (state, action: PayloadAction<{ id: number; isActive: boolean }>) => {
                const faq = state.items.find((f) => f.id === action.payload.id);
                if (faq) faq.isActive = action.payload.isActive;
            });
    },
});

export default faqSlice.reducer;
