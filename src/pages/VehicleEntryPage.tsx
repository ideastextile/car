import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import ParkingReceipt from '../components/ParkingReceipt';
import { LogIn } from 'lucide-react';
import { useEffect } from 'react';

const VehicleEntryPage: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [registeredVehicle, setRegisteredVehicle] = useState<ReturnType<typeof useParking>['registerEntry']>(null);
  const [error, setError] = useState<string | null>(null);
  const { registerEntry } = useParking();
  const checkMonthlyPass = (plate: string) => {
  // LocalStorage ya context se monthly cars check karna
  const monthlyCars = JSON.parse(localStorage.getItem("monthlyCars") || "[]");
  return monthlyCars.includes(plate);
};
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licensePlate.trim()) {
      setError('Please enter a license plate number');
      return;
    }
    
    // Register the vehicle
    const result = registerEntry(licensePlate.trim(), isMonthly);
    
    if (result) {
      setRegisteredVehicle(result);
      setError(null);
      // Clear form
      setLicensePlate('');
      setIsMonthly(false);
    } else {
      setError('This vehicle is already registered in the parking lot');
    }
  };
  
  const handleNewEntry = () => {
    setRegisteredVehicle(null);
    setError(null);
  };
  
  useEffect(() => {
  if (!licensePlate.trim()) return;

  const isRegisteredMonthly = checkMonthlyPass(licensePlate.trim());

  if (isRegisteredMonthly) {
    setIsMonthly(true);
  } else {
    setIsMonthly(false);
  }
}, [licensePlate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <LogIn className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Entry</h1>
        </div>
        
        {!registeredVehicle ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-6">
              Enter the license plate number of the vehicle to register its entry and generate a unique token.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate Number
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter license plate (e.g., ABC-123)"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isMonthly}
                    onChange={(e) => setIsMonthly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Monthly Pass Holder</span>
                </label>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register Vehicle Entry
              </button>
            </form>
          </div>
        ) : (
          <div>
            <ParkingReceipt vehicle={registeredVehicle} />
            
            <div className="mt-6 text-center">
              <button
                onClick={handleNewEntry}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register Another Vehicle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleEntryPage;