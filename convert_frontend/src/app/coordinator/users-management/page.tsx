'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User, Role } from "@/types/api";

export default function UsersManagementPage() {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    if (!auth.token) {
      setError("Please log in as a coordinator to view users.");
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllUsers(auth.token);
      setUsers(data || []);
    } catch (err) {
      console.warn("Unable to load users", err);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [auth.token]);

  const stats = useMemo(() => {
    const total = users.length;
    const students = users.filter((u) => u.role === "STUDENT").length;
    const tutors = users.filter((u) => u.role === "TUTOR").length;
    const active = users.filter((u) => u.isActive).length;
    return [
      { label: "Total Users", value: total },
      { label: "Students", value: students },
      { label: "Tutors", value: tutors },
      { label: "Active", value: active },
    ];
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (search && !(u.fullName || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [users, roleFilter, search]);

  const handleToggleStatus = async (user: User) => {
    if (!auth.token) return;
    setActionLoading(user.userId);
    try {
      const action = user.isActive ? api.deactivateUser : api.activateUser;
      const updated = await action(user.userId, auth.token);
      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u.userId === updated.userId ? { ...u, ...updated } : u))
        );
      }
    } catch (err) {
      console.error("Failed to update user status", err);
      alert("Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = async (userId: string) => {
    if (!auth.token) return;
    setActionLoading(userId);
    try {
      // Fetch fresh details to ensure we have the latest data before editing
      const user = await api.getUser(userId, auth.token);
      if (user) {
        setEditingUser(user);
      }
    } catch (err) {
      console.error("Failed to fetch user details", err);
      alert("Could not load user details for editing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !auth.token) return;
    
    setSaving(true);
    try {
      const updated = await api.updateUser(editingUser.userId, editingUser, auth.token);
      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u.userId === updated.userId ? { ...u, ...updated } : u))
        );
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coordinator Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Tutor Program Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-600">
            <i className="fa-solid fa-bell text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              CO
            </div>
            <span className="text-sm font-medium text-gray-700">Coordinator</span>
          </div>
        </div>
      </header>

      {loading && users.length === 0 ? <p className="text-sm text-gray-500">Loading users...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-gray-800 whitespace-nowrap">User Management</h3>
          <div className="flex flex-1 w-full justify-end gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400" />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All</option>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
              <option value="COORDINATOR">Coordinator</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-bold text-gray-700">{user.userId}</td>
                  <td className="py-4 px-4 text-gray-800">{user.fullName}</td>
                  <td className="py-4 px-4 text-gray-500">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {user.role || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(user.userId)}
                      disabled={actionLoading === user.userId}
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold disabled:opacity-50"
                    >
                      Edit
                    </button>
                    {user.isActive ? (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoading === user.userId}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoading === user.userId}
                        className="text-green-600 hover:text-green-800 text-xs font-semibold disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-500" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingUser.role || "STUDENT"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="COORDINATOR">Coordinator</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={editingUser.isActive || false}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active Account</label>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2 disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
