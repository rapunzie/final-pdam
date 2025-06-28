import { Link, Outlet, useLocation } from "react-router-dom";
import { HiOutlineClipboardList, HiOutlineChartPie, HiOutlineDocumentText,  HiSearch} from "react-icons/hi";

export default function Dashboard() {
  const location = useLocation();

  const menuItems = [
    { name: "Monitoring", path: "/", icon: <HiOutlineClipboardList size={20} /> },
    { name: "Summary", path: "/summary", icon: <HiOutlineDocumentText size={20} /> },
    { name: "Charts", path: "/charts", icon: <HiOutlineChartPie size={20} /> },
    { name: "Analyzer", path: "/analyzer", icon: <HiSearch size={20} />}
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col h-full">
        {/* Logo dan title */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo-pdam.jpg" alt="PDAM Logo" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="text-lg font-semibold">PDAM Dashboard</h1>
            <p className="text-xs text-gray-400">deesyalovely@user</p>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-gray-700 shadow"
                  : "hover:bg-gray-700 hover:shadow"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {location.pathname === "/" && "Monitoring Dashboard"}
            {location.pathname === "/summary" && "Summary"}
            {location.pathname === "/charts" && "Charts"}
            {location.pathname === "/analyzer" && "Analyzer"}
          </h2>
        </div>


        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}