import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface ZKTecoConfigProps {
  onClose: () => void;
}

interface ZKTecoSettings {
  ipAddress: string;
  port: string;
  timeout: string;
  password: string;
}

const ZKTecoConfig: React.FC<ZKTecoConfigProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<ZKTecoSettings>({
    ipAddress: localStorage.getItem('zkteco_ip') || '',
    port: localStorage.getItem('zkteco_port') || '4370',
    timeout: localStorage.getItem('zkteco_timeout') || '5000',
    password: localStorage.getItem('zkteco_password') || ''
  });

  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('zkteco_ip', settings.ipAddress);
    localStorage.setItem('zkteco_port', settings.port);
    localStorage.setItem('zkteco_timeout', settings.timeout);
    localStorage.setItem('zkteco_password', settings.password);
    
    onClose();
  };

  const testConnection = async () => {
    setStatus('testing');
    setErrorMessage('');

    try {
      // Simulate connection test - replace with actual ZKTeco connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate a successful connection
      // In production, this would actually test the connection to the ZKTeco device
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to device');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">ZKTeco Controller Setup</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Controller IP Address
          </label>
          <input
            type="text"
            value={settings.ipAddress}
            onChange={(e) => setSettings({ ...settings, ipAddress: e.target.value })}
            placeholder="192.168.1.201"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Port Number
          </label>
          <input
            type="number"
            value={settings.port}
            onChange={(e) => setSettings({ ...settings, port: e.target.value })}
            placeholder="4370"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Connection Timeout (ms)
          </label>
          <input
            type="number"
            value={settings.timeout}
            onChange={(e) => setSettings({ ...settings, timeout: e.target.value })}
            placeholder="5000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Device Password (if required)
          </label>
          <input
            type="password"
            value={settings.password}
            onChange={(e) => setSettings({ ...settings, password: e.target.value })}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <span className="text-red-700">{errorMessage || 'Failed to connect to the controller'}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <span className="text-green-700">Successfully connected to the controller</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={testConnection}
            disabled={status === 'testing'}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {status === 'testing' ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
            <span>Test Connection</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZKTecoConfig;