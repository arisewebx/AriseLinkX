// src/components/admin/ResultModal.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Trash2,
  Shield,
  Ban,
  X,
  Download
} from 'lucide-react';

const ResultModal = ({ 
  isOpen, 
  onClose, 
  type, // 'success', 'error', 'warning', 'mixed'
  title,
  message,
  details = [],
  actionType, // 'delete', 'ban', 'unban', 'promote', 'demote'
  stats = null, // { successful: 0, failed: 0, total: 0 }
  showExport = false,
  onExport = null
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-10 h-10 text-green-400" />;
      case 'error':
        return <XCircle className="w-10 h-10 text-red-400" />;
      case 'warning':
      case 'mixed':
        return <AlertTriangle className="w-10 h-10 text-yellow-400" />;
      default:
        return <CheckCircle className="w-10 h-10 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          headerBg: 'bg-green-500/20',
          text: 'text-green-300'
        };
      case 'error':
        return {
          bg: 'from-red-500/10 to-red-600/10',
          border: 'border-red-500/20',
          headerBg: 'bg-red-500/20',
          text: 'text-red-300'
        };
      case 'warning':
      case 'mixed':
        return {
          bg: 'from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          headerBg: 'bg-yellow-500/20',
          text: 'text-yellow-300'
        };
      default:
        return {
          bg: 'from-blue-500/10 to-blue-600/10',
          border: 'border-blue-500/20',
          headerBg: 'bg-blue-500/20',
          text: 'text-blue-300'
        };
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'delete':
        return <Trash2 className="w-5 h-5 text-red-400" />;
      case 'ban':
        return <Ban className="w-5 h-5 text-red-400" />;
      case 'unban':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'promote':
        return <Shield className="w-5 h-5 text-yellow-400" />;
      case 'demote':
        return <Shield className="w-5 h-5 text-orange-400" />;
      default:
        return <Users className="w-5 h-5 text-blue-400" />;
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${colors.bg} ${colors.border} border flex items-center justify-center mb-4`}>
            {getIcon()}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        </div>

        {/* Main Message */}
        <div className={`p-6 rounded-xl bg-gradient-to-r ${colors.bg} ${colors.border} border mb-6`}>
          <p className="text-white text-center font-medium">{message}</p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <div className="text-2xl font-bold text-green-300">{stats.successful}</div>
              <div className="text-sm text-gray-400">Success</div>
            </div>
            <div className="text-center p-4 bg-red-500/20 rounded-lg">
              <div className="text-2xl font-bold text-red-300">{stats.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
          </div>
        )}

        {/* Action Summary */}
        {actionType && (
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-6">
            {getActionIcon()}
            <div>
              <div className="text-white font-medium">
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Operation
              </div>
              <div className="text-gray-400 text-sm">
                {stats ? `${stats.successful}/${stats.total} completed successfully` : 'Operation completed'}
              </div>
            </div>
          </div>
        )}

        {/* Details List */}
        {details.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Operation Details
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {details.map((detail, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    detail.success 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {detail.success ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-white text-sm font-medium">
                      {detail.userEmail || detail.userId}
                    </span>
                  </div>
                  {detail.error && (
                    <p className="text-red-300 text-xs mt-1 ml-6">{detail.error}</p>
                  )}
                  {detail.message && (
                    <p className="text-gray-300 text-xs mt-1 ml-6">{detail.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {type === 'success' && actionType === 'delete' && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
            <h5 className="text-blue-300 font-medium mb-2">What was deleted:</h5>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• User accounts and authentication data</li>
              <li>• All associated short links</li>
              <li>• All click tracking data</li>
              <li>• User profile information</li>
            </ul>
          </div>
        )}

        {type === 'success' && (actionType === 'ban' || actionType === 'unban') && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
            <h5 className="text-blue-300 font-medium mb-2">
              {actionType === 'ban' ? 'What happens next:' : 'User access restored:'}
            </h5>
            <ul className="text-blue-200 text-sm space-y-1">
              {actionType === 'ban' ? (
                <>
                  <li>• Users will see suspension screen immediately</li>
                  <li>• No access to any app features</li>
                  <li>• Support contact information provided</li>
                </>
              ) : (
                <>
                  <li>• Users can login with existing password</li>
                  <li>• Full access to all app features restored</li>
                  <li>• No password reset required</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {showExport && onExport && (
            <Button
              onClick={onExport}
              className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
          
          <Button
            onClick={onClose}
            className={`${showExport ? 'flex-1' : 'w-full'} bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold`}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;