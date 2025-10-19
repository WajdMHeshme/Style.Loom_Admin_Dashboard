import type { User } from "../../redux/features/usersSlice";

interface Props {
    user: User;
}

export default function UserCard({ user }: Props) {
    return (
        <div className="flex items-center gap-3 p-3 bg-black10 rounded">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-semibold">
                {`${user.first_name?.[0] ?? "?"}${user.last_name?.[0] ?? ""}`.toUpperCase()}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <div className="text-sm text-gray-300">{user.role}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </div>
            </div>
        </div>
    );
}
