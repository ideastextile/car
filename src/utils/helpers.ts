import { Vehicle } from '../types';

// Generate a unique token
export const generateToken = (): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

// Get current vehicles from local storage
export const getVehicles = (): Vehicle[] => {
  const vehiclesData = localStorage.getItem('parkingVehicles');
  return vehiclesData ? JSON.parse(vehiclesData) : [];
};

// Save vehicles to local storage
export const saveVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem('parkingVehicles', JSON.stringify(vehicles));
};

// Get monthly vehicles from local storage
export const getMonthlyVehicles = (): Vehicle[] => {
  const vehiclesData = localStorage.getItem('monthlyParkingVehicles');
  return vehiclesData ? JSON.parse(vehiclesData) : [];
};

// Save monthly vehicles to local storage
export const saveMonthlyVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem('monthlyParkingVehicles', JSON.stringify(vehicles));
};

// Clear expired monthly passes
export const clearExpiredMonthlyPasses = (): void => {
  const monthlyVehicles = getMonthlyVehicles();
  const now = new Date();
  
  const validVehicles = monthlyVehicles.filter(vehicle => {
    if (!vehicle.monthlyPassExpiry) return true;
    return new Date(vehicle.monthlyPassExpiry) > now;
  });
  
  if (validVehicles.length !== monthlyVehicles.length) {
    saveMonthlyVehicles(validVehicles);
  }
};

// Calculate parking statistics
export const calculateStats = (vehicles: Vehicle[]) => {
  const parkedVehicles = vehicles.filter(v => v.status === 'parked');
  const exitedVehicles = vehicles.filter(v => v.status === 'exited');
  const monthlyPassHolders = vehicles.filter(v => v.isMonthly && v.status === 'parked').length;
  
  let totalParkingTime = 0;
  let validExitCount = 0;
  
  exitedVehicles.forEach(vehicle => {
    if (vehicle.exitTime) {
      const entryTime = new Date(vehicle.entryTime).getTime();
      const exitTime = new Date(vehicle.exitTime).getTime();
      const parkingTime = (exitTime - entryTime) / (1000 * 60); // in minutes
      
      totalParkingTime += parkingTime;
      validExitCount++;
    }
  });
  
  return {
    totalParked: parkedVehicles.length,
    totalExited: exitedVehicles.length,
    averageParkingTime: validExitCount > 0 ? Math.round(totalParkingTime / validExitCount) : 0,
    monthlyPassHolders
  };
};

// Generate a QR code data for a vehicle
export const generateQRData = (vehicle: Pick<Vehicle, 'licensePlate' | 'tokenNumber' | 'entryTime' | 'isMonthly'>) => {
  return `https://parking.example.com/validate?plate=${encodeURIComponent(vehicle.licensePlate)}&token=${vehicle.tokenNumber}&time=${encodeURIComponent(vehicle.entryTime)}&monthly=${vehicle.isMonthly}`;
};

// Export parking data to CSV
export const exportToCSV = (vehicles: Vehicle[]): string => {
  const headers = ["License Plate", "Token Number", "Entry Time", "Exit Time", "Status", "Monthly Pass", "Pass Expiry"];
  
  const rows = vehicles.map(vehicle => [
    vehicle.licensePlate,
    vehicle.tokenNumber,
    vehicle.entryTime,
    vehicle.exitTime || "N/A",
    vehicle.status,
    vehicle.isMonthly ? "Yes" : "No",
    vehicle.monthlyPassExpiry || "N/A"
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Download data as a file
export const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};