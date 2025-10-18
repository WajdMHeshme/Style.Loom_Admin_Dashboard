import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { Product } from "../../redux/features/productsSlice";

interface Props {
    products: Product[];
    selectedMain: string;
}

export default function ProductsChart({ products, selectedMain }: Props) {
    const chartData = (() => {
        const filtered = selectedMain === "all" ? products : products.filter((p) => p.subCategory?.main?.name === selectedMain);
        const counts: Record<string, number> = {};
        filtered.forEach((p) => {
            const name = p.subCategory?.name ?? p.name ?? "Unknown";
            counts[name] = (counts[name] ?? 0) + 1;
        });
        return Object.keys(counts).map((k) => ({ name: k, count: counts[k] }));
    })();

    return (
        <div className="lg:col-span-2 bg-black15 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Products Overview (by sub-category)</h3>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" name="Products" stroke="#c2b4a3" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-3 text-2xl text-brown70 font-bold">Style.Loom</p>
        </div>
    );
}
