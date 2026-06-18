import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logo from '/logo.png';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      )
    },
    { 
      path: '/heatmap', 
      label: 'Heatmap', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#1a1d29] border-r border-gray-200 dark:border-gray-800 shadow-xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="CausalFunnel Logo" 
              className="w-10 h-10 rounded-full shadow-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Causal<span className="text-blue-400">Funnel</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">User tracking system</p>
            </div>
          </div>
        </div>

        {/* User Analytics Label */}
        <div className="px-4 pt-6 pb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Analytics</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              AK
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Abhimanu Kumar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="text-xs text-gray-500 text-center pt-2">
            <p>© 2021 CausalFunnel</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
