import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { adminAuthService } from "@/services/adminAuthService";

export default function AdminHeader({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("uploads")) return "Upload Requests";
    if (path.includes("bookings")) return "Bookings";
    if (path.includes("contacts")) return "Contact Messages";
    if (path.includes("settings")) return "Settings";
    return "Admin";
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    return `Admin / ${getPageTitle()}`;
  };

  const handleLogout = async () => {
    await adminAuthService.logout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Menu Toggle + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X size={24} className="text-charcoal" />
            ) : (
              <Menu size={24} className="text-charcoal" />
            )}
          </button>

          <div>
            <h1 className="text-2xl font-bold text-charcoal">
              {getPageTitle()}
            </h1>
            {/* <p className="text-sm text-gray-500">{getBreadcrumb()}</p> */}
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-msp-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                <img src="../images/splash-logo.jpg" className="rounded"></img>
              </div>
              <span className="hidden sm:block text-sm font-medium text-charcoal">
                Admin
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-charcoal">Admin</p>
                  <p className="text-xs text-gray-500">
                    MSP Videography
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}