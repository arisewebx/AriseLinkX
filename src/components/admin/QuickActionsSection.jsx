// src/components/admin/QuickActionsSection.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertTriangle, Globe } from 'lucide-react';

const QuickActionsSection = ({ onExportUsers, onBulkActions, onUserActivity, onAnalytics }) => {
  const actions = [
    { label: "Export Users", sub: "Download CSV", icon: Download, onClick: onExportUsers },
    { label: "Bulk Actions", sub: "Manage multiple users", icon: CheckCircle, onClick: onBulkActions },
    { label: "User Activity", sub: "Recent activities", icon: AlertTriangle, onClick: onUserActivity },
    { label: "Analytics", sub: "View insights", icon: Globe, onClick: onAnalytics },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            variant="outline"
            className="flex items-center gap-2.5 h-auto py-3 px-4 border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 justify-start"
          >
            <action.icon className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium">{action.label}</div>
              <div className="text-xs text-gray-400">{action.sub}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSection;
