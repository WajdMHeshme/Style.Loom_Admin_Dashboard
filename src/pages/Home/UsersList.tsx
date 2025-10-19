// src/components/UsersList.tsx
import { useRef, useEffect } from "react";
import UserCard from "./UserCard";
import type { User } from "../../redux/features/usersSlice";

interface Props {
    users: User[];
    currentUserIndex: number;
    setCurrentUserIndex: (idx: number) => void;
    prevUser: () => void;
    nextUser: () => void;
}

export default function UsersList({ users, currentUserIndex, setCurrentUserIndex, prevUser, nextUser }: Props) {
    const userRefs = useRef<Array<HTMLDivElement | null>>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (userRefs.current[currentUserIndex]) {
            userRefs.current[currentUserIndex]!.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [currentUserIndex, users]);

    return (
        <div className="bg-black15 p-4 rounded-lg shadow-sm mt-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">All System Users</h3>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-400">{users.length} found</div>
                    <button onClick={prevUser} aria-label="Previous user" className="px-2 py-1 bg-white/5 rounded hover:bg-white/10">‹</button>
                    <button onClick={nextUser} aria-label="Next user" className="px-2 py-1 bg-white/5 rounded hover:bg-white/10">›</button>
                    <div className="text-xs text-gray-400">{users.length ? `${currentUserIndex + 1} / ${users.length}` : "0 / 0"}</div>
                </div>
            </div>

            {users.length === 0 ? (
                <p className="text-sm text-gray-400">No users found.</p>
            ) : (
                <div ref={containerRef} className="overflow-y-auto h-28 snap-y snap-mandatory scrollbar-thin scrollbar-thumb-gray-700">
                    {users.map((u, idx) => (
                        <div
                            key={u.id}
                            ref={(el) => { userRefs.current[idx] = el; }}
                            className={`snap-start transition-transform duration-200 mx-1 my-1 ${idx === currentUserIndex ? "scale-100" : "scale-95 opacity-70"}`}
                            style={{ minHeight: 112 }}
                            onClick={() => setCurrentUserIndex(idx)}
                        >
                            <UserCard user={u} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
