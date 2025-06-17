import React from 'react';
import { Car, LogOut } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { stats } = useParking();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <h1 className="text-xl font-bold">SmartPark</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              <span className="bg-blue-800 px-3 py-1 rounded-full">
                {stats.totalParked} vehicles parked
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header