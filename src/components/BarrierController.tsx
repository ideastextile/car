import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BarrierControllerProps {
  isOpen: boolean;
  onStateChange?: (state: boolean) => void;
}

const BarrierController: React.FC<BarrierControllerProps> = ({ isOpen, onStateChange }) => {
  const [status, setStatus] = useState<'closed' | 'opening' | 'open' | 'error'>('closed');

  useEffect(() => {
    if (isOpen) {
      openBarrier();
    } else {
      closeBarrier();
    }
  }, [isOpen]);

  const openBarrier = async () => {
    try {
      setStatus('opening');
      // Here you would typically send a command to your hardware
      // For simulation, we'll use a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('open');
      onStateChange?.(true);
      
      // Auto close after 10 seconds
      setTimeout(() => {
        closeBarrier();
      }, 10000);
    } catch (error) {
      console.error('Failed to open barrier:', error);
      setStatus('error');
    }
  };

  const closeBarrier = async () => {
    try {
      setStatus('closed');
      onStateChange?.(false);
    } catch (error) {
      console.error('Failed to close barrier:', error);
      setStatus('error');
    }
  };

  return (
    <div className="barrier-controller p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Barrier Status</h3>
        <div className="flex items-center space-x-2">
          {status === 'error' ? (
            <>
              <AlertCircle className="text-red-500" />
              <span className="text-red-500">Error</span>
            </>
          ) : status === 'open' ? (
            <>
              <CheckCircle className="text-green-500" />
              <span className="text-green-500">Open</span>
            </>
          ) : status === 'opening' ? (
            <span className="text-blue-500">Opening...</span>
          ) : (
            <span className="text-gray-500">Closed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarrierController;