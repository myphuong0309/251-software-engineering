'use client';

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { sampleStudent, sampleTutors } from "@/lib/sample-data";
import { User } from "@/types/api";

export default function UsersManagementPage() {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([
    sampleStudent,
    ...sampleTutors,
  ]);
  const [status, setStatus] = useState<string | null>(null);

  const toggleActive = async (userId: string, active: boolean) => {
    try {
      const updated = active
        ? await api.activateUser(userId, auth.token)
        : await api.deactivateUser(userId, auth.token);
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, ...updated } : u)),
      );
      setStatus(`Updated ${updated.fullName}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Update failed.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage students, tutors, and coordinators
          </p>
        </div>
      </header>

      {status ? (
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          {status}
        </p>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{user.fullName}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-gray-600">{user.role}</td>
                <td className="py-3 px-4">
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
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => toggleActive(user.userId, true)}
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => toggleActive(user.userId, false)}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
