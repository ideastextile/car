import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LogIn, LogOut, BarChart2 } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-800' : '';
  };
  
  return (
    <nav className="bg-blue-700 text-white py-2 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center space-x-2 overflow-x-auto md:space-x-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 px-2 py-2 rounded-md transition-colors hover:bg-blue-800 ${isActive('/')}`}
          >
            <Home size={18} />
            <span className="text-sm md:text-base whitespace-nowrap">Home</span>
          </Link>
          
          <Link 
            to="/entry" 
            className={`flex items-center space-x-1 px-2 py-2 rounded-md transition-colors hover:bg-blue-800 ${isActive('/entry')}`}
          >
            <LogIn size={18} />
            <span className="text-sm md:text-base whitespace-nowrap">Entry</span>
          </Link>
          
          <Link 
            to="/exit" 
            className={`flex items-center space-x-1 px-2 py-2 rounded-md transition-colors hover:bg-blue-800 ${isActive('/exit')}`}
          >
            <LogOut size={18} />
            <span className="text-sm md:text-base whitespace-nowrap">Exit</span>
          </Link>
          
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-1 px-2 py-2 rounded-md transition-colors hover:bg-blue-800 ${isActive('/dashboard')}`}
          >
            <BarChart2 size={18} />
            <span className="text-sm md:text-base whitespace-nowrap">Stats</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;