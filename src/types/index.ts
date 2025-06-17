export interface Vehicle {
  id: string;
  licensePlate: string;
  tokenNumber: string;
  entryTime: string;
  exitTime?: string;
  status: 'parked' | 'exited';
  qrCode: string;
  isMonthly: boolean;
  monthlyPassExpiry?: string;
}

export interface ParkingStats {
  totalParked: number;
  totalExited: number;
  averageParkingTime: number;
  monthlyPassHolders: number;
}