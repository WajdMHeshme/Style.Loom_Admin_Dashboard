import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#10B981", "#60A5FA", "#F59E0B", "#EF4444", "#A78BFA"];

type Review = { id: number; rating: number };

interface Props {
    reviews: Review[];
}

/**
 * ReviewsDistribution - pie chart of 1..5 star counts + legend
 */
export default function ReviewsDistribution({ reviews }: Props) {
    const data = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        (reviews || []).forEach((r) => {
            const rt = Math.max(1, Math.min(5, Math.floor(Number(r.rating) || 0)));
            counts[rt - 1] = (counts[rt - 1] || 0) + 1;
        });
        return [1, 2, 3, 4, 5].map((star, idx) => ({ name: `${star}★`, value: counts[idx] }));
    }, [reviews]);

    return (
        <div className="bg-black15 p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Reviews Distribution</h2>
            <div className="flex items-center justify-center space-x-4">
                <div style={{ width: 180, height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={3} label={(p: any) => (p?.value > 0 ? `${p.value}` : "")}>
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <ul className="text-sm">
                    {data.map((r, i) => (
                        <li key={r.name} className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="flex-1">{r.name}</span>
                            <span className="text-gray-500 mr-2">({r.value})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
