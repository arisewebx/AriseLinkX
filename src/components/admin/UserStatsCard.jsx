// src/components/admin/UserStatsCard.jsx
import React from 'react';

const UserStatsCard = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
          <stat.icon className="w-4 h-4 text-orange-500" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
      <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
    </div>
  );
};

export default UserStatsCard;
