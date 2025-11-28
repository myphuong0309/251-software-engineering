import Link from "next/link";

export default function AdminLoginPage() {
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
          <p className="text-sm text-gray-500 mt-1 text-center">Admin</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="admin-username">
              Username / Email
            </label>
            <input
              id="admin-username"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-900 placeholder:text-gray-500"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 text-gray-900 placeholder:text-gray-500"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
            <i className="fa-solid fa-right-to-bracket" />
            Sign in
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; 2025 Ho Chi Minh City University of Technology
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
}
