// src/features/usersSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/Api";

export interface User {
    id: number | string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    [k: string]: any;
}

interface UsersState {
    items: User[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;

    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    updateError: string | null;

    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    deleteError: string | null;
}

const initialState: UsersState = {
    items: [],
    status: "idle",
    error: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
};

/**
 * Thunks
 */

// Fetch all users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    "users/fetchUsers",
    async (_, thunkAPI) => {
        try {
            const res = await api.get("/dashboard/users");
            return (res.data?.users ?? res.data) as User[];
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Failed to fetch users";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

/**
 * Update user role:
 * - If server returns updated user object (res.data.user or res.data) we use it.
 * - If server returns only a message, we still return { id, role } so reducer can update state.
 */
export const updateUserRole = createAsyncThunk<
    User,
    { id: number | string; role: string },
    { rejectValue: string }
>("users/updateUserRole", async ({ id, role }, thunkAPI) => {
    try {
        const res = await api.patch(`/dashboard/users/${id}`, { role });

        // Prefer `res.data.user`, then `res.data`, else fallback to minimal object
        const returned = res.data?.user ?? res.data ?? null;

        // Normalize result to ensure it contains id and role
        const updated: User =
            returned && typeof returned === "object"
                ? { ...(returned as any), id: returned.id ?? returned._id ?? id, role: returned.role ?? role }
                : { id, role };

        return updated;
    } catch (err: any) {
        const message = err?.response?.data?.message || err.message || "Failed to update user role";
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete user (return deleted id via fulfillWithValue)
export const deleteUser = createAsyncThunk<string | number, string | number, { rejectValue: string }>(
    "users/deleteUser",
    async (id, thunkAPI) => {
        try {
            await api.delete(`/dashboard/users/${id}`);
            return thunkAPI.fulfillWithValue(id);
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Failed to delete user";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

/**
 * Slice
 */
const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUsers(state) {
            state.items = [];
            state.status = "idle";
            state.error = null;
        },
        clearErrors(state) {
            state.error = null;
            state.updateError = null;
            state.deleteError = null;
        },
        // local optimistic setter (can be used as fallback)
        setUserRoleLocal(state, action: PayloadAction<{ id: string | number; role: string }>) {
            const { id, role } = action.payload;
            const idx = state.items.findIndex((u) => String(u.id) === String(id));
            if (idx !== -1) state.items[idx] = { ...state.items[idx], role };
        },
    },
    extraReducers: (builder) => {
        // fetchUsers
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message || "Unknown error";
            });

        // updateUserRole
        builder
            .addCase(updateUserRole.pending, (state) => {
                state.updateStatus = "loading";
                state.updateError = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<User>) => {
                state.updateStatus = "succeeded";
                const updated = action.payload;
                const id = updated.id ?? (updated as any)._id;
                if (id != null) {
                    const idx = state.items.findIndex((u) => String(u.id) === String(id));
                    if (idx !== -1) {
                        // merge updated fields (role at least)
                        state.items[idx] = { ...state.items[idx], ...updated };
                    } else {
                        // if not present, insert at top
                        state.items.unshift(updated);
                    }
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.updateStatus = "failed";
                state.updateError = action.payload || action.error.message || "Unknown error";
            });

        // deleteUser
        builder
            .addCase(deleteUser.pending, (state) => {
                state.deleteStatus = "loading";
                state.deleteError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string | number>) => {
                state.deleteStatus = "succeeded";
                const deletedId = action.payload;
                state.items = state.items.filter((u) => String(u.id) !== String(deletedId));
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.deleteError = action.payload || action.error.message || "Unknown error";
            });
    },
});

export const { clearUsers, clearErrors, setUserRoleLocal } = usersSlice.actions;
export default usersSlice.reducer;
