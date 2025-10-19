import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLoader from "../../utils/UserLoader";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsers, deleteUser, updateUserRole, setUserRoleLocal } from "../../redux/features/usersSlice";
import Pagination from "../../components/Pagination";
import UserCard, { type UserCardUser } from "./UserCard";
import RoleModal from "./RoleModal";
import DeleteUserModal from "./DeleteUserModal";

interface User {
  id: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

type ModalType = "role" | "delete";

export default function Users() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((s) => s.users.items) as User[] | undefined;
  const loading = useAppSelector((s) => s.users.status === "loading");
  const deleteStatus = useAppSelector((s) => s.users.deleteStatus);
  const updateStatus = useAppSelector((s) => s.users.updateStatus);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("user");
  const [modalType, setModalType] = useState<ModalType>("role");
  const [saving, setSaving] = useState(false);

  // --- pagination state
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role ?? "user");
    setModalType("role");
    setShowModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setModalType("delete");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully");
      closeModal();
    } catch (err: any) {
      console.error("Delete error:", err);
      const msg = typeof err === "string" ? err : err?.message ?? "Failed to delete user";
      toast.error(msg);
    }
  };

  const handleUpdateRole = async (roleToSave?: string) => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      const roleValue = roleToSave ?? newRole;
      await dispatch(updateUserRole({ id: selectedUser.id, role: roleValue })).unwrap();
      // fallback local update to ensure UI updates immediately
      dispatch(setUserRoleLocal({ id: selectedUser.id, role: roleValue }));
      toast.success("Role updated successfully");
      closeModal();
    } catch (err: any) {
      console.error("Update role error:", err);
      const msg = typeof err === "string" ? err : err?.message ?? "Failed to update role";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // --- prepare pagination data
  const usersList = users ?? [];
  const totalItems = usersList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // ensure currentPage is valid when totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // reset to first page when the data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = usersList.slice(startIndex, endIndex);

  if (loading)
    return (
      <div className="p-6 flex flex-col gap-4">
        {Array.from({ length: usersList.length || 3 }).map((_, i) => (
          <UserLoader key={i} />
        ))}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users List</h1>

      {totalItems === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <>
          {paginatedUsers.map((u) => (
            <UserCard key={u.id} user={u as UserCardUser} onOpenRole={openRoleModal} onOpenDelete={openDeleteModal} />
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </>
      )}

      {/* Modals */}
      <RoleModal
        isOpen={showModal && modalType === "role"}
        user={selectedUser}
        onClose={closeModal}
        onSave={handleUpdateRole}
        saving={saving}
        updateStatus={updateStatus}
      />

      <DeleteUserModal
        isOpen={showModal && modalType === "delete"}
        user={selectedUser}
        onClose={closeModal}
        onConfirm={handleDelete}
        deleting={deleteStatus === "loading"}
        deleteStatus={deleteStatus}
      />

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
