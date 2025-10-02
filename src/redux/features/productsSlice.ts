// src/features/productsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/Api"; // تأكد المسار صحيح في مشروعك

export interface SubCategory {
    id?: number;
    name?: string;
    main?: { id?: number; name?: string; imageUrl?: string | null } | null;
}

export interface Product {
    id?: number | string;
    name?: string;
    productName?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    stock?: number;
    type?: string;
    subCategory?: SubCategory | null;
    reviews?: { id: number; rating: number; comment: string; createdAt: string }[];
    [k: string]: any;
}

interface ProductsState {
    items: Product[];
    currentProduct: Product | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;

    // ops statuses/errors
    addStatus: "idle" | "loading" | "succeeded" | "failed";
    addError: string | null;

    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;

    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const initialState: ProductsState = {
    items: [],
    currentProduct: null,
    status: "idle",
    error: null,
    addStatus: "idle",
    addError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
};

// --- Thunks ---

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
    "products/fetchProducts",
    async (_, thunkAPI) => {
        try {
            const res = await api.get("/product");
            return res.data as Product[];
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Fetch products failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Fetch single product by id
export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
    "products/fetchProductById",
    async (id, thunkAPI) => {
        try {
            const res = await api.get(`/product/${id}`);
            return res.data as Product;
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Fetch product failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add product (FormData)
export const addProduct = createAsyncThunk<any, FormData, { rejectValue: string }>(
    "products/addProduct",
    async (formData, thunkAPI) => {
        try {
            const res = await api.post("/dashboard/pro", formData);
            return res.data;
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Add product failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update product (id + FormData)
export const updateProduct = createAsyncThunk<any, { id: string | number; data: FormData }, { rejectValue: string }>(
    "products/updateProduct",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await api.patch(`/dashboard/pro/${id}`, data);
            return res.data;
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Update product failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete product — نرجع id عبر fulfillWithValue لضمان تحديث ال-store فوراً
export const deleteProduct = createAsyncThunk<string | number, string | number, { rejectValue: string }>(
    "products/deleteProduct",
    async (id, thunkAPI) => {
        try {
            await api.delete(`/dashboard/pro/${id}`);
            // نعيد الـ id مباشرة لأن بعض الـ APIs لا يرجعون id في الجسم
            return thunkAPI.fulfillWithValue(id);
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Delete product failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Slice ---
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearCurrentProduct(state) {
            state.currentProduct = null;
            state.status = "idle";
            state.error = null;
        },
        clearErrors(state) {
            state.error = null;
            state.addError = null;
            state.updateError = null;
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        // fetchProducts
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message || "Unknown error";
            });

        // fetchProductById
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.currentProduct = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
                state.status = "succeeded";
                state.currentProduct = action.payload;
                // ensure the current product exists in items for consistency (optional)
                const idx = state.items.findIndex((p) => String(p.id) === String(action.payload.id));
                if (idx === -1) state.items.unshift(action.payload);
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message || "Unknown error";
                state.currentProduct = null;
            });

        // addProduct
        builder
            .addCase(addProduct.pending, (state) => {
                state.addStatus = "loading";
                state.addError = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.addStatus = "succeeded";
                const payload = action.payload as any;
                // API may return product in different shapes: { product }, { data }, or product obj
                const newProduct = payload?.product ?? payload?.data ?? payload;
                if (newProduct && (newProduct.id ?? newProduct._id)) {
                    // normalize id field
                    const id = newProduct.id ?? newProduct._id;
                    newProduct.id = id;
                    state.items.unshift(newProduct as Product);
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.addStatus = "failed";
                state.addError = action.payload || action.error.message || "Unknown error";
            });

        // updateProduct
        builder
            .addCase(updateProduct.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateStatus = "succeeded";
                const payload = action.payload as any;
                const updated = payload?.product ?? payload?.data ?? payload;
                if (updated && (updated.id ?? updated._id)) {
                    const id = updated.id ?? updated._id;
                    updated.id = id;
                    const idx = state.items.findIndex((p) => String(p.id) === String(id));
                    if (idx >= 0) state.items[idx] = updated;
                    if (state.currentProduct && String(state.currentProduct.id) === String(id)) {
                        state.currentProduct = updated;
                    }
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload || action.error.message || "Unknown error";
            });

        // deleteProduct
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.deleteStatus = "loading";
                state.deleteError = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string | number>) => {
                state.deleteStatus = "succeeded";
                const deletedId = action.payload;
                state.items = state.items.filter((p) => String(p.id) !== String(deletedId));
                if (state.currentProduct && String(state.currentProduct.id) === String(deletedId)) {
                    state.currentProduct = null;
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.deleteError = action.payload || action.error.message || "Unknown error";
            });
    },
});

export const { clearCurrentProduct, clearErrors } = productsSlice.actions;
export default productsSlice.reducer;
