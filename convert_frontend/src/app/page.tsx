import Link from "next/link";
import QuickLoginButtons from "@/components/quick-login-buttons";

export default function Home() {
  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-100 mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="text-blue-700 text-5xl mb-2">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Sign in to your account
            </h1>
          </div>

          <div className="space-y-4">
            <Link
              href="/login/hcmut"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-university" />
              HCMUT - Account
            </Link>

            <Link
              href="/login/admin"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-user-shield" />
              Admin
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; 2025 Ho Chi Minh City University of Technology
          </div>
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-4 w-full mb-4">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-gray-400 text-sm font-medium">DEMO ACCESS</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <QuickLoginButtons />
        </div>
      </div>
    </div>
  );
}
