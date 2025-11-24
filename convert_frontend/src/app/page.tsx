'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/types/api";

const roleOptions: { label: string; value: Role }[] = [
  { label: "Student", value: "STUDENT" },
  { label: "Tutor", value: "TUTOR" },
  { label: "Coordinator", value: "COORDINATOR" },
];

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({
        email,
        password,
        role,
        userId: userId || email,
        fullName: fullName || email.split("@")[0],
      });
      const destination =
        role === "STUDENT"
          ? "/student"
          : role === "TUTOR"
            ? "/tutor"
            : "/coordinator/meeting-management";
      router.push(destination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not sign in right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (roleValue: Role) => {
    setRole(roleValue);
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="text-blue-700 text-5xl mb-2">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Use your HCMUT account to access the Tutor Support System.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleQuickRole("STUDENT")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-university" />
            HCMUT - Account
          </button>

          <button
            type="button"
            onClick={() => handleQuickRole("COORDINATOR")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-user-shield" />
            Admin / Coordinator
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-900 placeholder:text-gray-600"
              placeholder="you@hcmut.edu.vn"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-900 placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="role">
              Select role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {roleOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setRole(option.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    role === option.value
                      ? "border-blue-600 text-blue-700 bg-blue-50"
                      : "border-gray-200 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="userId">
              User ID (used for API calls)
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-900 placeholder:text-gray-600"
              placeholder="Paste your userId from backend (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="fullName">
              Display name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-900 placeholder:text-gray-600"
              placeholder="John Doe"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket" />
                Continue
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; 2025 Ho Chi Minh City University of Technology
        </div>
      </div>
    </div>
  );
}
