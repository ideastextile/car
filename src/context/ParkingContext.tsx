import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, ParkingStats } from '../types';
import { getVehicles, saveVehicles, calculateStats, generateToken, generateQRData, getMonthlyVehicles, saveMonthlyVehicles, clearExpiredMonthlyPasses } from '../utils/helpers';

interface ParkingContextType {
  vehicles: Vehicle[];
  monthlyVehicles: Vehicle[];
  stats: ParkingStats;
  registerEntry: (licensePlate: string, isMonthly?: boolean) => Vehicle | null;
  processExit: (licensePlate: string, tokenNumber: string) => Vehicle | null;
  resetData: () => void;
  resetMonthlyData: () => void;
  clearExpiredPasses: () => void;
  getVehicleByLicensePlate: (licensePlate: string) => Vehicle | undefined;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [monthlyVehicles, setMonthlyVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<ParkingStats>({
    totalParked: 0,
    totalExited: 0,
    averageParkingTime: 0,
    monthlyPassHolders: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedVehicles = getVehicles();
    const storedMonthlyVehicles = getMonthlyVehicles();
    
    setVehicles(storedVehicles);
    setMonthlyVehicles(storedMonthlyVehicles);
    
    // Combine both regular and monthly vehicles for stats calculation
    const allVehicles = [...storedVehicles, ...storedMonthlyVehicles];
    setStats(calculateStats(allVehicles));

    // Auto-clear expired monthly passes on app load
    clearExpiredMonthlyPasses();
  }, []);

  // Update localStorage and stats whenever vehicles change
  useEffect(() => {
    saveVehicles(vehicles);
    const allVehicles = [...vehicles, ...monthlyVehicles];
    setStats(calculateStats(allVehicles));
  }, [vehicles, monthlyVehicles]);

  // Update localStorage for monthly vehicles
  useEffect(() => {
    saveMonthlyVehicles(monthlyVehicles);
  }, [monthlyVehicles]);

  const registerEntry = (licensePlate: string, isMonthly: boolean = false): Vehicle | null => {
    // Check if vehicle is already parked in either regular or monthly storage
    const existingVehicle = [...vehicles, ...monthlyVehicles].find(
      v => v.licensePlate === licensePlate && v.status === 'parked'
    );
    
    if (existingVehicle) {
      return null; // Vehicle already parked
    }
    
    const tokenNumber = generateToken();
    const entryTime = new Date().toISOString();
    
    // Calculate monthly pass expiry if applicable
    const monthlyPassExpiry = isMonthly ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined;
    
    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      licensePlate,
      tokenNumber,
      entryTime,
      status: 'parked',
      isMonthly,
      monthlyPassExpiry,
      qrCode: generateQRData({ licensePlate, tokenNumber, entryTime, isMonthly })
    };
    
    // Store monthly vehicles separately
    if (isMonthly) {
      setMonthlyVehicles(prev => [...prev, newVehicle]);
    } else {
      setVehicles(prev => [...prev, newVehicle]);
    }
    
    return newVehicle;
  };

  const processExit = (licensePlate: string, tokenNumber: string): Vehicle | null => {
    // Check in regular vehicles first
    const regularVehicleIndex = vehicles.findIndex(
      v => v.licensePlate === licensePlate && 
           v.tokenNumber === tokenNumber && 
           v.status === 'parked'
    );
    
    if (regularVehicleIndex !== -1) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[regularVehicleIndex] = {
        ...updatedVehicles[regularVehicleIndex],
        exitTime: new Date().toISOString(),
        status: 'exited'
      };
      
      setVehicles(updatedVehicles);
      return updatedVehicles[regularVehicleIndex];
    }
    
    // Check in monthly vehicles
    const monthlyVehicleIndex = monthlyVehicles.findIndex(
      v => v.licensePlate === licensePlate && 
           v.tokenNumber === tokenNumber && 
           v.status === 'parked'
    );
    
    if (monthlyVehicleIndex !== -1) {
      const updatedMonthlyVehicles = [...monthlyVehicles];
      updatedMonthlyVehicles[monthlyVehicleIndex] = {
        ...updatedMonthlyVehicles[monthlyVehicleIndex],
        exitTime: new Date().toISOString(),
        status: 'exited'
      };
      
      setMonthlyVehicles(updatedMonthlyVehicles);
      return updatedMonthlyVehicles[monthlyVehicleIndex];
    }
    
    return null; // Vehicle not found or already exited
  };

  const resetData = () => {
    setVehicles([]);
  };

  const resetMonthlyData = () => {
    setMonthlyVehicles([]);
  };

  const clearExpiredPasses = () => {
    const now = new Date();
    const validMonthlyVehicles = monthlyVehicles.filter(vehicle => {
      if (!vehicle.monthlyPassExpiry) return true;
      return new Date(vehicle.monthlyPassExpiry) > now;
    });
    
    if (validMonthlyVehicles.length !== monthlyVehicles.length) {
      setMonthlyVehicles(validMonthlyVehicles);
    }
  };

  const getVehicleByLicensePlate = (licensePlate: string): Vehicle | undefined => {
    return [...vehicles, ...monthlyVehicles].find(v => v.licensePlate === licensePlate);
  };

  return (
    <ParkingContext.Provider 
      value={{ 
        vehicles, 
        monthlyVehicles,
        stats, 
        registerEntry, 
        processExit, 
        resetData,
        resetMonthlyData,
        clearExpiredPasses,
        getVehicleByLicensePlate
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};