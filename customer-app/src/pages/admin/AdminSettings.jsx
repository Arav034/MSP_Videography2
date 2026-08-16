import { useState, useEffect } from "react";
import { adminAuthService } from "@/services/adminAuthService";
import { Lock, User, Bell, Shield, LogOut } from "lucide-react";

export default function AdminSettings() {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      setIsLoading(true);
      const user = await adminAuthService.getCurrentUser();
      setAdminUser(user);
    } catch (error) {
      console.error("Error fetching admin info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters");
      setMessageType("error");
      return;
    }

    setMessage("✅ Password change functionality coming soon. Please use Supabase Auth dashboard to change password.");
    setMessageType("success");
    
    setTimeout(() => {
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Page Header */}
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Settings</h1>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Manage your admin profile and preferences.
        </p>
      </div>

      {/* Admin Profile Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-msp-blue rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
            <img src="../images/splash-logo.jpg" class="rounded"></img>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">Admin (Navin)</h2>
            <p className="text-gray-600 text-sm">MSP Videography</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={adminUser?.email || ""}
              disabled
              className="w-full px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-charcoal text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              User ID
            </label>
            <input
              type="text"
              value={adminUser?.id || ""}
              disabled
              className="w-full px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-charcoal text-xs font-mono overflow-x-auto"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Account Created
            </label>
            <input
              type="text"
              value={
                adminUser?.created_at
                  ? new Date(adminUser.created_at).toLocaleDateString()
                  : ""
              }
              disabled
              className="w-full px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-charcoal text-sm"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Shield size={20} className="sm:w-6 sm:h-6 text-msp-blue" />
          <h3 className="text-lg sm:text-xl font-bold text-charcoal">Security</h3>
        </div>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            <Lock size={18} />
            Change Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue text-sm"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-xs sm:text-sm ${
                  messageType === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Preferences Section
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Bell size={20} className="sm:w-6 sm:h-6 text-msp-blue" />
          <h3 className="text-lg sm:text-xl font-bold text-charcoal">Preferences</h3>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
            <div className="flex-1">
              <p className="font-medium text-charcoal text-sm sm:text-base">Email Notifications</p>
              <p className="text-xs sm:text-sm text-gray-600">Get alerts for new uploads</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-5 h-5 text-msp-blue rounded flex-shrink-0"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
            <div className="flex-1">
              <p className="font-medium text-charcoal text-sm sm:text-base">Dark Mode</p>
              <p className="text-xs sm:text-sm text-gray-600">Coming soon</p>
            </div>
            <input
              type="checkbox"
              disabled
              className="w-5 h-5 text-gray-400 rounded flex-shrink-0"
            />
          </div>
        </div>
      </div> */}

      {/* App Info Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <User size={20} className="sm:w-6 sm:h-6 text-msp-blue" />
          <h3 className="text-lg sm:text-xl font-bold text-charcoal">About</h3>
        </div>

        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2">
            <span className="text-gray-600 font-medium">App Name</span>
            <span className="font-medium text-charcoal break-words">MSP Videography Admin</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Version</span>
            <span className="font-medium text-charcoal">1.0.0</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Database</span>
            <span className="font-medium text-charcoal">Supabase</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Framework</span>
            <span className="font-medium text-charcoal">React + Vite</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-red-700 mb-2 sm:mb-3">Danger Zone</h3>
        <p className="text-xs sm:text-sm text-red-600 mb-4">
          These actions cannot be undone. Proceed with caution.
        </p>
        <button
          onClick={async () => {
            await adminAuthService.logout();
            window.location.href = "/admin/login";
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}