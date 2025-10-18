import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";

export interface UserCardUser {
    id: number | string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    [k: string]: any;
}

interface Props {
    user: UserCardUser;
    onOpenRole: (user: UserCardUser) => void;
    onOpenDelete: (user: UserCardUser) => void;
}

export default function UserCard({ user, onOpenRole, onOpenDelete }: Props) {
    const getRoleIcon = (role: string | undefined) => {
        if (role === "admin") return <GrUserAdmin className="text-brown70" />;
        return <FaUser className="text-blue-400" />;
    };

    return (
        <div
            key={user.id}
            className="relative border border-[#333] rounded-lg p-4 bg-black15 text-gray-100 shadow-sm hover:shadow-md transition mb-4 flex flex-wrap justify-between items-center"
        >
            {/* Role Icon Badge at corner */}
            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full">
                {getRoleIcon(user.role)}
            </div>

            {/* User info */}
            <div className="flex flex-wrap gap-6 items-center">
                <p>
                    <span className="font-semibold">ID:</span> {user.id}
                </p>
                <p>
                    <span className="font-semibold">Name:</span> {user.first_name ?? ""} {user.last_name ?? ""}
                </p>
                <p>
                    <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                    <span className="font-semibold">Role:</span> {user.role}
                </p>
                <p>
                    <span className="font-semibold">Created At:</span>{" "}
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center mt-2 sm:mt-4">
                <button
                    onClick={() => onOpenDelete(user)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                >
                    <AiOutlineDelete /> Delete
                </button>
                <button
                    onClick={() => onOpenRole(user)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                >
                    <AiOutlineEdit /> Change Role
                </button>
            </div>
        </div>
    );
}
