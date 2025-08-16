 // src/pages/Dashboard.jsx
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Intro Section */}
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Your Dashboard</h1>
          <p className="mt-2 text-gray-300 leading-relaxed">
            Welcome to your control center! Here, you can manage every aspect of your restaurant
            with ease. From setting up your restaurant profile to creating categories and adding
            menu items, everything you need is right at your fingertips.
          </p>
        </div>

        {/* What you can do */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-white mb-2">Create Restaurant</h2>
            <p className="text-gray-400 text-sm">
              Set up your restaurant details like name, location, and contact info to get started.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-white mb-2">Manage Categories</h2>
            <p className="text-gray-400 text-sm">
              Organize your menu into categories such as Starters, Main Course, and Desserts for
              easy navigation.
            </p>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-white mb-2">Add Menu Items</h2>
            <p className="text-gray-400 text-sm">
              Add delicious dishes with prices, descriptions, and images to attract more customers.
            </p>
          </div>
        </div>

        {/* Extra Tip */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
          <p className="text-gray-300 text-sm">
            💡 Tip: Keep your menu up-to-date and regularly check your dashboard to monitor and
            improve your restaurant’s performance.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
