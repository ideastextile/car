import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, BarChart2, Car } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import StatsCard from '../components/StatsCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useParking();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Smart Parking Management</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Efficiency meets security — Park with confidence in our state-of-the-art facility
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard 
          value={stats.totalParked} 
          label="Currently Parked" 
          icon={<Car className="h-6 w-6" />}
          color="bg-blue-600"
        />
        <StatsCard 
          value={stats.totalParked + stats.totalExited} 
          label="Total Vehicles Today" 
          icon={<BarChart2 className="h-6 w-6" />}
          color="bg-indigo-600"
        />
        <StatsCard 
          value={`${stats.averageParkingTime} min`} 
          label="Avg. Minutes Per Vehicle" 
          icon={<LogOut className="h-6 w-6" />}
          color="bg-teal-600"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="bg-blue-100 p-6 flex justify-center">
            <div className="bg-blue-500 rounded-full p-3">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vehicle Entry</h3>
            <p className="text-gray-600 mb-4">Register incoming vehicles and generate secure tokens</p>
            <button 
              onClick={() => navigate('/entry')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
            >
              Register Entry
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="bg-teal-100 p-6 flex justify-center">
            <div className="bg-teal-500 rounded-full p-3">
              <LogOut className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vehicle Exit</h3>
            <p className="text-gray-600 mb-4">Validate tokens and process vehicle exits securely</p>
            <button 
              onClick={() => navigate('/exit')}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors w-full"
            >
              Process Exit
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="bg-indigo-100 p-6 flex justify-center">
            <div className="bg-indigo-500 rounded-full p-3">
              <BarChart2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dashboard</h3>
            <p className="text-gray-600 mb-4">View real-time statistics and analyze parking patterns</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors w-full"
            >
              View Dashboard
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="bg-purple-100 p-6 flex justify-center">
            <div className="bg-purple-500 rounded-full p-3">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Features</h3>
            <p className="text-gray-600 mb-4">Real-time tracking, secure access, and detailed insights</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors w-full"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Vehicle Entry</h3>
            <p className="text-gray-600">
              Enter your car number to register arrival and receive a unique token
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-teal-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-600 font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Park Your Vehicle</h3>
            <p className="text-gray-600">
              Safely park your vehicle in our facility with real-time monitoring
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Exit Validation</h3>
            <p className="text-gray-600">
              Enter your car number when leaving to validate and complete your parking session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;