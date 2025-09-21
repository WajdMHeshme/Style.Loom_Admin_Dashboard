import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/Api"; // 👈 نستخدم Axios instance

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 نحتاجه لنشوف إذا جاي من ProtectedRoute

  const [loading, setLoading] = useState(false);

  // 👇 إذا المستخدم جاي من ProtectedRoute
  useEffect(() => {
    if (location.state?.from === "protected") {
      toast.warning("Please log in first !");
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value.trim() || "";

    if (!email || !password) {
      toast.error("Please fill all fields !");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login", { email, password });
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login success");

        // 🚀 Redirect to Dashboard
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error("No token received from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(
          `Login failed: ${error.response.data.message || "Invalid credentials"}`
        );
      } else {
        toast.error("Login failed: Server not responding");
      }
    } finally {
      setLoading(false);
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
          <img src="/logoloom.png" alt="logo" className="w-[100px] mx-auto" />
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
          disabled={loading}
          className="w-full bg-brown60 text-white py-2 rounded-lg 
                     hover:bg-brown65 transition shadow-md disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

