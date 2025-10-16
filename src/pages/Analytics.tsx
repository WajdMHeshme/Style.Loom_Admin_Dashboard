import { useEffect, useMemo, useState, type JSX } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

/* --- types --- */
type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
};

type Review = {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  isApproved: boolean;
  userId?: number;
};

type Faq = {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
};

const COLORS = ["#10B981", "#60A5FA", "#F59E0B", "#EF4444", "#A78BFA"];

function formatMonthShort(date: Date) {
  return date.toLocaleString("en", { month: "short" });
}
function getLastNMonths(n: number) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: formatMonthShort(d) });
  }
  return months;
}

export default function Analytics(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // helper fetch that handles auth + 401
  async function fetchWithAuth(url: string) {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (res.status === 401) {
      throw new Error("401");
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const [usersJson, reviewsJson, faqsJson] = await Promise.all([
          fetchWithAuth("/api/dashboard/users"),
          fetchWithAuth("/api/dashboard/webReview"),
          fetchWithAuth("/api/dashboard/faq"),
        ]);

        if (!mounted) return;

        const uArr: User[] = Array.isArray(usersJson) ? usersJson : usersJson?.users ?? [];
        setUsers(uArr);
        setReviews(Array.isArray(reviewsJson) ? reviewsJson : []);
        setFaqs(Array.isArray(faqsJson) ? faqsJson : []);
      } catch (err: any) {
        console.error(err);
        if (err.message === "401") {
          setError("401 Unauthorized");
        } else {
          setError( (err.message || ""));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // derived chart data
  const usersChartData = useMemo(() => {
    const months = getLastNMonths(6);
    const map = new Map<string, number>();
    months.forEach((m) => map.set(m.key, 0));
    users.forEach((u) => {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });
    return months.map((m) => ({ month: m.label, count: map.get(m.key) || 0 }));
  }, [users]);

  const faqsChartData = useMemo(() => {
    const months = getLastNMonths(6);
    const map = new Map<string, number>();
    months.forEach((m) => map.set(m.key, 0));
    faqs.forEach((f) => {
      const d = new Date(f.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });
    return months.map((m) => ({ month: m.label, faqs: map.get(m.key) || 0 }));
  }, [faqs]);

  const reviewsChartData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const rt = Math.max(1, Math.min(5, Math.floor(Number(r.rating) || 0)));
      counts[rt - 1] = (counts[rt - 1] || 0) + 1;
    });
    return [1, 2, 3, 4, 5].map((star, idx) => ({ name: `${star}★`, value: counts[idx] }));
  }, [reviews]);

  // ------------ New: Key metrics (anything) ----------------
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalFaqs = faqs.length;
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r) => Boolean(r.isApproved)).length;
    const pendingReviews = totalReviews - approvedReviews;
    const avgRating =
      totalReviews > 0 ? +(reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / totalReviews).toFixed(2) : 0;

    // latest review (by createdAt)
    const latestReview =
      reviews.length > 0
        ? [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null;

    return { totalUsers, totalFaqs, totalReviews, approvedReviews, pendingReviews, avgRating, latestReview };
  }, [users, reviews, faqs]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold"> Analytics</h1>
      </div>
    );
  }

  if (error) {
    return (
        <p className="mt-4 text-red-500">{error}</p>
    );
  }

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {/* Users */}
        <div className="bg-black15 p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">Users Growth (Monthly)</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={usersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ======= REPLACED AREA: "Anything" -> Key Metrics panel ======= */}
        <div className="bg-black15 p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Key Metrics</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-black10 rounded">
              <div className="text-sm text-gray-400">Total Users</div>
              <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            </div>

            <div className="p-3 bg-black10 rounded">
              <div className="text-sm text-gray-400">Total FAQs</div>
              <div className="text-2xl font-bold">{metrics.totalFaqs}</div>
            </div>

            <div className="p-3 bg-black10 rounded">
              <div className="text-sm text-gray-400">Total Reviews</div>
              <div className="text-2xl font-bold">{metrics.totalReviews}</div>
            </div>

            <div className="p-3 bg-black10 rounded">
              <div className="text-sm text-gray-400">Avg Rating</div>
              <div className="text-2xl font-bold">{metrics.avgRating}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-1">Reviews (approved / pending)</div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-black10 rounded">
                <div className="text-xs text-gray-400">Approved</div>
                <div className="font-semibold">{metrics.approvedReviews}</div>
              </div>
              <div className="px-3 py-2 bg-black10 rounded">
                <div className="text-xs text-gray-400">Pending</div>
                <div className="font-semibold">{metrics.pendingReviews}</div>
              </div>
            </div>
          </div>


        </div>
        {/* ======= end Key Metrics panel ======= */}

        {/* Reviews */}
        <div className="bg-black15 p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">Reviews Distribution</h2>
          <div className="flex items-center justify-center space-x-4">
            <div style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reviewsChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    label={(props: any) => (props?.value > 0 ? `${props.value}` : "")}
                  >
                    {reviewsChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="text-sm">
              {reviewsChartData.map((r, i) => (
                <li key={r.name} className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="flex-1">{r.name}</span>
                  <span className="text-gray-500 mr-2">({r.value})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-black15 p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">FAQs Created (Monthly)</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={faqsChartData}>
                <defs>
                  <linearGradient id="colorFaq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="faqs" stroke="#10B981" fill="url(#colorFaq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
