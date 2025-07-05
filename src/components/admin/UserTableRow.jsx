// src/components/admin/UserTableRow.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, User, Eye } from 'lucide-react';

const UserTableRow = ({ 
  user, 
  isSelected, 
  onSelect, 
  onUserClick 
}) => {
  return (
    <tr className="border-t border-white/10 hover:bg-white/5">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.id)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </td>
      <td className="p-4 cursor-pointer" onClick={() => onUserClick(user)}>
        <div className="flex items-center gap-3">
          {user.profilepic ? (
            <img 
              src={user.profilepic} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <div className="text-white font-medium flex items-center gap-2">
              {user.name}
              {user.isAdmin && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
            user.status === 'active' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          }`}>
            {user.status}
          </span>
          {user.banned && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 w-fit">
              Banned
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-gray-300">{user.linksCount}</td>
      <td className="p-4 text-gray-300">{user.totalClicks}</td>
      <td className="p-4 text-gray-400 text-sm">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(user);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;