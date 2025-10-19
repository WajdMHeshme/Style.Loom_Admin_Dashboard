import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type User = { id: string | number; createdAt: string };

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

interface Props {
    users: User[];
    months?: number;
    height?: number;
}

/**
 * UsersGrowthChart
 * - props.users: array of users with createdAt
 * - months: how many months to show (default 6)
 */
export default function UsersGrowthChart({ users, months = 6, height = 260 }: Props) {
    const data = useMemo(() => {
        const monthsArr = getLastNMonths(months);
        const map = new Map<string, number>();
        monthsArr.forEach((m) => map.set(m.key, 0));
        (users || []).forEach((u) => {
            const d = new Date(u.createdAt);
            if (Number.isNaN(d.getTime())) return;
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
        });
        return monthsArr.map((m) => ({ month: m.label, count: map.get(m.key) || 0 }));
    }, [users, months]);

    return (
        <div className="bg-black15 p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Users Growth (Monthly)</h2>
            <div style={{ width: "100%", height }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
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
    );
}
