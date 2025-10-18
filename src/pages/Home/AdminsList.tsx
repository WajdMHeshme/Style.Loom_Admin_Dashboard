import type { User } from "../../redux/features/usersSlice";
import UserCard from "./UserCard";

interface Props {
    admins: User[];
}

export default function AdminsList({ admins }: Props) {
    if (admins.length === 0) {
        return <p className="text-sm text-gray-400">No admins found for the selected role.</p>;
    }

    return (
        <div className="space-y-3 max-h-[360px] overflow-auto pr-2">
            {admins.map((u) => (
                <UserCard key={u.id} user={u} />
            ))}
        </div>
    );
}
