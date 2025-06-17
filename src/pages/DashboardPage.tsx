import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import VehicleList from '../components/VehicleList';
import StatsCard from '../components/StatsCard';
import { BarChart2, Car, LogOut, Clock, Download, RefreshCw, AlertTriangle, Settings, Calendar, Trash2 } from 'lucide-react';
import { exportToCSV, downloadCSV } from '../utils/helpers';
import ZKTecoConfig from '../components/ZKTecoConfig';

const DashboardPage: React.FC = () => {
  const { vehicles, monthlyVehicles, stats, resetData, resetMonthlyData, clearExpiredPasses } = useParking();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMonthlyResetConfirm, setShowMonthlyResetConfirm] = useState(false);
  const [showZKTecoConfig, setShowZKTecoConfig] = useState(false);
  const [activeTab, setActiveTab] = useState<'regular' | 'monthly'>('regular');
  
  const handleExport = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const allVehicles = [...vehicles, ...monthlyVehicles];
    const csvData = exportToCSV(allVehicles);
    
    downloadCSV(csvData, `parking_data_${dateStr}.csv`);
  };

  const handleExportMonthly = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const csvData = exportToCSV(monthlyVehicles);
    
    downloadCSV(csvData, `monthly_parking_data_${dateStr}.csv`);
  };
  
  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
  };

  const handleMonthlyReset = () => {
    resetMonthlyData();
    setShowMonthlyResetConfirm(false);
  };

  const handleClearExpired = () => {
    clearExpiredPasses();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Parking Dashboard</h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowZKTecoConfig(true)}
            className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Settings size={18} />
            <span>ZKTeco Setup</span>
          </button>
          
          <button
            onClick={handleClearExpired}
            className="flex items-center space-x-1 bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            <Calendar size={18} />
            <span>Clear Expired</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            <span>Export All</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          value={stats.totalParked} 
          label="Currently Parked" 
          icon={<Car className="h-6 w-6" />}
          color="bg-blue-600"
        />
        <StatsCard 
          value={stats.totalExited} 
          label="Exited Vehicles" 
          icon={<LogOut className="h-6 w-6" />}
          color="bg-teal-600"
        />
        <StatsCard 
          value={`${stats.averageParkingTime} min`} 
          label="Avg. Parking Time" 
          icon={<Clock className="h-6 w-6" />}
          color="bg-indigo-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('regular')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'regular'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Regular Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monthly'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monthly Pass Holders ({monthlyVehicles.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'regular' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Regular Parking</h2>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={18} />
              <span>Reset Regular Data</span>
            </button>
          </div>
          <VehicleList vehicles={vehicles} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Pass Holders</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleExportMonthly}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                <span>Export Monthly</span>
              </button>
              <button
                onClick={() => setShowMonthlyResetConfirm(true)}
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={18} />
                <span>Clear Monthly Data</span>
              </button>
            </div>
          </div>
          <VehicleList vehicles={monthlyVehicles} />
        </div>
      )}
      
      {/* ZKTeco Configuration Modal */}
      {showZKTecoConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4">
            <ZKTecoConfig onClose={() => setShowZKTecoConfig(false)} />
          </div>
        </div>
      )}
      
      {/* Regular Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Confirm Reset</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              This will permanently delete all regular parking data. This action cannot be undone. 
              Are you sure you want to proceed?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset Regular Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Reset Confirmation Modal */}
      {showMonthlyResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Confirm Monthly Data Clear</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              This will permanently delete all monthly pass holder data. This action cannot be undone. 
              Are you sure you want to proceed?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMonthlyResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMonthlyReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear Monthly Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;