import { useNavigate, useLocation } from "react-router-dom";
import { X, LayoutDashboard, Upload, Calendar, Mail, Settings } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: "Upload Requests",
      path: ROUTES.ADMIN_UPLOADS,
      icon: Upload,
    },
    {
      label: "Bookings",
      path: ROUTES.ADMIN_BOOKINGS,
      icon: Calendar,
    },
    {
      label: "Contacts",
      path: ROUTES.ADMIN_CONTACTS,
      icon: Mail,
    },
    {
      label: "Settings",
      path: ROUTES.ADMIN_SETTINGS,
      icon: Settings,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    toggleSidebar(); // Close sidebar on mobile
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                MSP VIDEOGRAPHY
              </h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} className="text-charcoal" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-msp-blue border-l-4 border-msp-blue"
                    : "text-charcoal hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-msp-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
              <img src="../images/splash-logo.jpg" class="rounded"></img>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                Admin
              </p>
              <p className="text-xs text-gray-500 truncate">
                MSP Videography
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </div>
      </aside>
    </>
  );
}