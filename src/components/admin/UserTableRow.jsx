// src/components/admin/UserTableRow.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, User, Eye } from 'lucide-react';

const UserTableRow = ({ user, isSelected, onSelect, onUserClick }) => {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.id)}
          className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
        />
      </td>
      <td className="p-4 cursor-pointer" onClick={() => onUserClick(user)}>
        <div className="flex items-center gap-3">
          {user.profilepic ? (
            <img src={user.profilepic} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-orange-500">
                {user.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
              </span>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
              {user.name}
              {user.isAdmin && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
            </div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
            user.status === 'active'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}>
            {user.status}
          </span>
          {user.banned && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200 w-fit">
              Banned
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-sm text-gray-600">{user.linksCount}</td>
      <td className="p-4 text-sm text-gray-600">{user.totalClicks}</td>
      <td className="p-4 text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
      <td className="p-4">
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 h-8 px-3"
          onClick={(e) => { e.stopPropagation(); onUserClick(user); }}
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>
      </td>
    </tr>
  );
};

export default UserTableRow;
