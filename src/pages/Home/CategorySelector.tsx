interface Props {
    mainCategories: string[];
    selectedMain: string;
    setSelectedMain: (val: string) => void;
}

export default function CategorySelector({ mainCategories, selectedMain, setSelectedMain }: Props) {
    return (
        <select
            value={selectedMain}
            onChange={(e) => setSelectedMain(e.target.value)}
            className="bg-black10 text-white text-sm px-3 py-2 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70 transition duration-200"
        >
            <option value="all">All categories (default)</option>
            {mainCategories.map((m) => (
                <option key={m} value={m} className="bg-black15 text-white hover:bg-brown65">{m}</option>
            ))}
        </select>
    );
}
