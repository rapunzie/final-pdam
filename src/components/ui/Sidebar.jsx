import { FaChartPie, FaCog, FaUser, FaQuestionCircle } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-5">
      <h1 className="text-xl font-bold mb-5">PDAM Dashboard</h1>
      <ul>
        <li className="mb-3 flex items-center">
          <FaChartPie className="mr-2" />
          Monitoring
        </li>
        <li className="mb-3 flex items-center">
          <FaCog className="mr-2" />
          Settings
        </li>
        <li className="mb-3 flex items-center">
          <FaUser className="mr-2" />
          Accounts
        </li>
        <li className="mb-3 flex items-center">
          <FaQuestionCircle className="mr-2" />
          Help
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;