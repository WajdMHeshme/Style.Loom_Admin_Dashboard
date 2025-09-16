import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate(); // ✅ hook للانتقال

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        try {
            // ✅ API الحقيقي
            const response = await axios.post("http://localhost:3000/api/dashboard/login", {
                email,
                password,
            });

            // بافتراض أن الباك يرجع { token: "xxxxx" }
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                console.log("✅ Login Success:", response.data);

                // ✅ الانتقال للداشبورد
                navigate("/dashboard");
            } else {
                console.error("Login failed: No token returned ❌");
            }

        } catch (error: any) {
            console.error("❌ Error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brown97 dark:bg-black12 transition">
            <form
                onSubmit={handleSubmit}
                className="bg-brown95 dark:bg-black15 p-8 rounded-2xl shadow-md w-full max-w-sm"
            >
                {/* Logo */}
                <div className="mb-6">
                    <img
                        src="/logoloom.png"
                        alt="logo"
                        className="w-[100px] mx-auto"
                    />
                    <h2 className="text-2xl font-semibold text-center text-gray40 dark:text-white">
                        Login
                    </h2>
                    <p className="text-center text-sm text-gray50 dark:text-gray90 mt-1">
                        Welcome back! Please login to your dashboard.
                    </p>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray50 dark:text-gray90 mb-1">
                        Email
                    </label>
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray80 dark:border-gray40 
                                    rounded-lg bg-brown99 dark:bg-black20 
                                    text-black20 dark:text-gray95
                                    focus:outline-none focus:ring-2 focus:ring-brown65 focus:border-brown65 
                                    transition"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray50 dark:text-gray90 mb-1">
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray80 dark:border-gray40 
                                    rounded-lg bg-brown99 dark:bg-black20 
                                    text-black20 dark:text-gray95
                                    focus:outline-none focus:ring-2 focus:ring-brown65 focus:border-brown65 
                                    transition"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full bg-brown60 text-white py-2 rounded-lg 
                            hover:bg-brown65 transition shadow-md"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
