// Users.tsx
import { useEffect, useState } from "react";
import api from "../api/Api";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaUserLargeSlash, FaUser } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleDropdown from "../components/RoleDropdown";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  createdAt: string;
}

type ModalType = "role" | "delete";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("user");
  const [animateModal, setAnimateModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("role");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("✅ User deleted successfully");
      closeModal();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("❌ Failed to delete user");
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      await api.patch(`/users/${selectedUser.id}`, { role: newRole });
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      toast.success("Role updated successfully");
      closeModal();
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalType("role");
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setModalType("delete");
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 200);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  const getRoleIcon = (role: string) => {
    if (role === "admin") return <GrUserAdmin className="text-brown70" />;
    return <FaUser className="text-blue-400" />;
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users List</h1>
{users.map((u) => (
  <div
    key={u.id}
    className="relative border border-[#333] rounded-lg p-4 bg-black15 text-gray-100 shadow-sm hover:shadow-md transition mb-4 flex flex-wrap justify-between items-center"
  >
    {/* Role Icon Badge at corner */}
    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full">
      {getRoleIcon(u.role)}
    </div>

    {/* User info */}
    <div className="flex flex-wrap gap-6 items-center">
      <p>
        <span className="font-semibold">ID:</span> {u.id}
      </p>
      <p>
        <span className="font-semibold">Name:</span> {u.first_name} {u.last_name}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {u.email}
      </p>
      <p>
        <span className="font-semibold">Role:</span> {u.role}
      </p>
      <p>
        <span className="font-semibold">Created At:</span>{" "}
        {new Date(u.createdAt).toLocaleString("en-u-nu-arab", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })}
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-2 items-center mt-2 sm:mt-4">
      <button
        onClick={() => openDeleteModal(u)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
      >
        <AiOutlineDelete /> Delete
      </button>
      <button
        onClick={() => openRoleModal(u)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
      >
        <AiOutlineEdit /> Change Role
      </button>
    </div>
  </div>
))}


      {/* Animated Modal */}
      {showModal && selectedUser && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-200 ${
            animateModal ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-black15 text-white p-6 rounded-lg w-80 shadow-lg transform transition-all duration-200 ${
              animateModal ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4 text-4xl">
              {modalType === "role" ? (
                <GrUserAdmin className="text-brown70" />
              ) : (
                <FaUserLargeSlash className="text-red-500" />
              )}
            </div>

            {modalType === "role" ? (
              <>
                <h2 className="text-lg font-bold mb-4">
                  Change Role for {selectedUser.first_name}
                </h2>
                <RoleDropdown value={newRole} onChange={setNewRole} />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={closeModal} className="px-4 py-2 text-white">
                    Cancel
                  </button>
                  <button
                    onClick={updateUserRole}
                    disabled={saving}
                    className="px-4 py-2 bg-brown70 rounded hover:bg-brown65 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 text-red-500">
                  Confirm Delete
                </h2>
                <p className="mb-4">
                  Are you sure you want to delete {selectedUser.first_name}?
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-2">
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(selectedUser.id)}
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
