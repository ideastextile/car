import React from 'react';

interface StatsCardProps {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  value, 
  label, 
  icon,
  color = 'bg-blue-600' 
}) => {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className={`${color} p-4 text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{label}</h3>
          {icon && <div>{icon}</div>}
        </div>
      </div>
      <div className="p-4">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;