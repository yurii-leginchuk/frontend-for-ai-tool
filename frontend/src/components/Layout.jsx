import { NavLink } from "react-router-dom";

const Layout = ({ children }) => {
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#F03D00] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-10">
            {/* Logo/Brand */}
            <div className="flex items-center">

            </div>

            {/* Navigation Menu */}
            <nav className="flex space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-lg  font-medium transition-all duration-200 ease-in-out ${
                    isActive
                      ? "text-yellow-300"
                      : "text-white hover:text-yellow-300"
                  }`
                }
              >
                Projects List
              </NavLink>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `text-lg font-medium transition-all duration-200 ease-in-out ${
                   isActive
                      ? "text-yellow-300"
                      : "text-white hover:text-yellow-300"
                  }`
                }
              >
                Clients List
              </NavLink>
              <NavLink
                to="/add-client"
                className={({ isActive }) =>
                  `text-lg font-medium transition-all duration-200 ease-in-out ${
                  isActive
                      ? "text-yellow-300"
                      : "text-white hover:text-yellow-300"
                  }`
                }
              >
                Add Client
              </NavLink>
              <NavLink
                to="/add-project"
                className={({ isActive }) =>
                  `text-lg font-medium transition-all duration-200 ease-in-out ${
                isActive
                      ? "text-yellow-300"
                      : "text-white hover:text-yellow-300"
                  }`
                }
              >
                Add Project
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;