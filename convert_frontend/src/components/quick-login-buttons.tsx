'use client';

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuickLoginButtons() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (role: "STUDENT" | "TUTOR" | "COORDINATOR") => {
    setLoading(role);
    let email = "";
    let redirect = "";

    if (role === "STUDENT") {
      email = "emma.wilson@hcmut.edu.vn";
      redirect = "/student";
    } else if (role === "TUTOR") {
      email = "jane.smith@hcmut.edu.vn";
      redirect = "/tutor";
    } else if (role === "COORDINATOR") {
      email = "coordinator@hcmut.edu.vn";
      redirect = "/coordinator";
    }

    try {
      // Password doesn't matter for mock SSO
      await login({ email, password: "any" });
      router.push(redirect);
    } catch (err) {
      console.error("Quick login failed", err);
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
      <button
        onClick={() => handleLogin("STUDENT")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-sm transition"
      >
        {loading === "STUDENT" ? (
          <span className="animate-spin">⌛</span>
        ) : (
          <i className="fa-solid fa-user-graduate text-blue-600" />
        )}
        Login as Student
      </button>

      <button
        onClick={() => handleLogin("TUTOR")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-sm transition"
      >
        {loading === "TUTOR" ? (
          <span className="animate-spin">⌛</span>
        ) : (
          <i className="fa-solid fa-chalkboard-user text-green-600" />
        )}
        Login as Tutor
      </button>

      <button
        onClick={() => handleLogin("COORDINATOR")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl shadow-sm transition"
      >
        {loading === "COORDINATOR" ? (
          <span className="animate-spin">⌛</span>
        ) : (
          <i className="fa-solid fa-users-gear text-purple-600" />
        )}
        Login as Coordinator
      </button>
    </div>
  );
}
