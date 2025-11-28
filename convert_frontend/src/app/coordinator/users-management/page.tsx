'use client';

import { useMemo, useState } from "react";

const users = [
  {
    id: "U001",
    name: "Nguyen Van A",
    email: "nguyenvana@hcmut.edu.vn",
    role: { label: "Student", color: "bg-blue-100 text-blue-700" },
    status: { label: "Active", color: "bg-green-100 text-green-700" },
    sessions: "12",
    last: "2024-01-15",
  },
  {
    id: "U002",
    name: "Tran Thi B",
    email: "tranthib@hcmut.edu.vn",
    role: { label: "Tutor", color: "bg-purple-100 text-purple-700" },
    status: { label: "Active", color: "bg-green-100 text-green-700" },
    sessions: "45",
    last: "2024-01-15",
  },
  {
    id: "U003",
    name: "Le Van C",
    email: "levanc@hcmut.edu.vn",
    role: { label: "Student", color: "bg-blue-100 text-blue-700" },
    status: { label: "Inactive", color: "bg-gray-100 text-gray-600" },
    sessions: "5",
    last: "2024-01-10",
  },
  {
    id: "U004",
    name: "Pham Van D",
    email: "phamvand@hcmut.edu.vn",
    role: { label: "Tutor", color: "bg-purple-100 text-purple-700" },
    status: { label: "Active", color: "bg-green-100 text-green-700" },
    sessions: "38",
    last: "2024-01-14",
  },
];

export default function UsersManagementPage() {
  const [modalUser, setModalUser] = useState<(typeof users)[number] | null>(null);

  const stats = useMemo(
    () => [
      { label: "Total Users", value: "324", delta: "+18" },
      { label: "Students", value: "245", delta: "+15" },
      { label: "Tutors", value: "76", delta: "+3" },
      { label: "Active Sessions", value: "42", delta: "+8" },
    ],
    [],
  );

  return (
    <div className="space-y-8 font-sans">
      {/* --- HEADER & STATS (Giữ nguyên như cũ) --- */}
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
              JD
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <span className="text-green-500 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded">
                <i className="fa-solid fa-arrow-trend-up mr-1" /> {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* --- TABLE SECTION (Giữ nguyên như cũ) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-gray-800 whitespace-nowrap">User Management</h3>
          <div className="flex flex-1 w-full justify-end gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400" />
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Roles</option>
              <option>Student</option>
              <option>Tutor</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap">
              Add New User
            </button>
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
                <th className="py-3 px-4">Sessions</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4 font-bold text-gray-700">{user.id}</td>
                  <td className="py-4 px-4 text-gray-800">{user.name}</td>
                  <td className="py-4 px-4 text-gray-500">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role.color}`}>
                      {user.role.label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status.color}`}>
                      {user.status.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.sessions}</td>
                  <td className="py-4 px-4 text-gray-500">{user.last}</td>
                  <td className="py-4 px-4 text-center space-x-2">
                    <button
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition"
                      title="Edit"
                      onClick={() => setModalUser(user)}
                    >
                      <i className="fa-regular fa-pen-to-square" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200 transition" title="Deactivate">
                      <i className="fa-solid fa-user-xmark" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL EDIT USER (ĐÃ CẬP NHẬT) --- */}
      {modalUser ? (
        <div className="fixed inset-0 h-full w-full bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Edit User Details</h3>
              <button
                onClick={() => setModalUser(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              
              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">User ID</label>
                <input
                  type="text"
                  value={modalUser.id}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <i className="fa-regular fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    defaultValue={modalUser.name}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <i className="fa-regular fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    type="email"
                    defaultValue={modalUser.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Row: Role & Status */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                  <div className="relative">
                     <select 
                      defaultValue={modalUser.role.label}
                      className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                     >
                        <option value="Student">Student</option>
                        <option value="Tutor">Tutor</option>
                        <option value="Admin">Admin</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <div className="relative">
                    <select 
                      defaultValue={modalUser.status.label}
                      className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                     </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => setModalUser(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Save Changes
              </button>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}