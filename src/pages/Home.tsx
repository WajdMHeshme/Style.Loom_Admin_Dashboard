import { useEffect, useRef, useState, type JSX } from "react";
import api from "../api/Api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function DashboardHome(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);

  // refs
  const userRefs = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data?.users ?? []);
        setCurrentUserIndex(0);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("فشل في جلب المستخدمين");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userRefs.current[currentUserIndex]) {
      userRefs.current[currentUserIndex]!.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    } else if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentUserIndex, users]);

  const roles = Array.from(new Set(users.map((u) => u.role))).filter(Boolean);

  const displayedAdmins = users.filter((u) => {
    if (selectedRole === "all") return u.role.toLowerCase().includes("admin");
    return u.role === selectedRole;
  });

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data?.users ?? []);
      setCurrentUserIndex(0);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  // --- Static products data (replace later with API) ---
  const productsData = [
    { name: "T-Shirt", sold: 120 },
    { name: "Jeans", sold: 95 },
    { name: "Sneakers", sold: 78 },
    { name: "Hoodie", sold: 55 },
    { name: "Jacket", sold: 40 },
  ];

  const prevUser = () => {
    setCurrentUserIndex((i) =>
      users.length ? (i <= 0 ? users.length - 1 : i - 1) : 0
    );
  };
  const nextUser = () => {
    setCurrentUserIndex((i) =>
      users.length ? (i >= users.length - 1 ? 0 : i + 1) : 0
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard Home</h2>
        <div className="flex items-center gap-3">
<select
  value={selectedRole}
  onChange={(e) => setSelectedRole(e.target.value)}
  className="bg-black10 text-white text-sm px-3 py-2 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70 transition duration-200"
>
  <option className="bg-black15 text-white">All admins (default)</option>
  {roles.map((r) => (
    <option
      key={r}
      value={r}
      className="bg-black15 text-white hover:bg-brown65"
    >
      {r}
    </option>
  ))}
</select>

          <button
            onClick={refresh}
            className="px-3 py-2 bg-brown70 rounded hover:bg-brown65 text-white text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-400">{error}</div>
      ) : (
        <>
          {/* TOP: Products chart (left) + Admins (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products chart on the LEFT (static) */}
            <div className="lg:col-span-2 bg-black15 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Products Overview (static)
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={productsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sold"
                      name="Sold"
                      stroke="#c2b4a3" // brown70
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-2xl text-brown70 font-bold">
              Style.Loom
              </p>
            </div>

            {/* Admins on the RIGHT */}
            <div className="bg-black15 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Admins</h3>
                <span className="text-sm text-gray-400">
                  {displayedAdmins.length} found
                </span>
              </div>

              {displayedAdmins.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No admins found for the selected role.
                </p>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-auto pr-2">
                  {displayedAdmins.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-3 bg-black10 rounded"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-semibold">
                        {`${u.first_name?.[0] ?? "?"}${
                          u.last_name?.[0] ?? ""
                        }`.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {u.first_name} {u.last_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {u.email}
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">{u.role}</div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: All System Users (single visible + scroll/controls) */}
          <div className="bg-black15 p-4 rounded-lg shadow-sm mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">All System Users</h3>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">
                  {users.length} found
                </div>

                {/* Prev / Next controls */}
                <button
                  onClick={prevUser}
                  aria-label="Previous user"
                  className="px-2 py-1 bg-white/5 rounded hover:bg-white/10"
                >
                  ‹
                </button>
                <button
                  onClick={nextUser}
                  aria-label="Next user"
                  className="px-2 py-1 bg-white/5 rounded hover:bg-white/10"
                >
                  ›
                </button>

                <div className="text-xs text-gray-400">
                  {users.length
                    ? `${currentUserIndex + 1} / ${users.length}`
                    : "0 / 0"}
                </div>
              </div>
            </div>

            {users.length === 0 ? (
              <p className="text-sm text-gray-400">No users found.</p>
            ) : (
              // container shows just one user (fixed height) and supports snap scrolling
              <div
                ref={containerRef}
                className="overflow-y-auto h-28 snap-y snap-mandatory scrollbar-thin scrollbar-thumb-gray-700"
              >
                {users.map((u, idx) => (
                  <div
                    key={u.id}
                    ref={(el) => {
                      userRefs.current[idx] = el;
                    }}
                    className={`snap-start flex items-center gap-3 p-3 bg-black10 rounded mx-1 my-1 transition-transform duration-200 ${
                      idx === currentUserIndex
                        ? "scale-100"
                        : "scale-95 opacity-70"
                    }`}
                    style={{ minHeight: 112 }} // keep consistent height for one visible item
                    onClick={() => setCurrentUserIndex(idx)}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-semibold text-lg">
                      {`${u.first_name?.[0] ?? "?"}${
                        u.last_name?.[0] ?? ""
                      }`.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {u.first_name} {u.last_name}
                          </div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                        <div className="text-sm text-gray-300">{u.role}</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Joined: {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
