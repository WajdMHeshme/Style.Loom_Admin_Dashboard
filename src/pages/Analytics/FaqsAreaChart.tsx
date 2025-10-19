import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

type Faq = { id: number; createdAt: string };

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
    faqs: Faq[];
    months?: number;
    height?: number;
}

/**
 * FaqsAreaChart - monthly area chart of FAQs created
 */
export default function FaqsAreaChart({ faqs, months = 6, height = 260 }: Props) {
    const data = useMemo(() => {
        const monthsArr = getLastNMonths(months);
        const map = new Map<string, number>();
        monthsArr.forEach((m) => map.set(m.key, 0));
        (faqs || []).forEach((f) => {
            const d = new Date(f.createdAt);
            if (Number.isNaN(d.getTime())) return;
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
        });
        return monthsArr.map((m) => ({ month: m.label, faqs: map.get(m.key) || 0 }));
    }, [faqs, months]);

    return (
        <div className="bg-black15 p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">FAQs Created (Monthly)</h2>
            <div style={{ width: "100%", height }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
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
    );
}
