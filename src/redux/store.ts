// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/productsSlice";
import usersReducer from "./features/usersSlice";
import reviewsReducer from "./features/reviewsSlice"; // <--- اضفها
import faqReducer from "./features/faqSlice";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        users: usersReducer,
        reviews: reviewsReducer,
        faq: faqReducer,
        // أضف هنا reducers أخرى إذا احتجت (cart, user, ...)
    },
    // يمكن إضافة middleware أو إعدادات devtools هنا
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
