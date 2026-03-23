// src/components/admin/ConfirmationModal.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Trash2, 
  Shield, 
  ShieldOff,
  X,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, // 'delete', 'promote', 'demote', 'ban', 'unban'
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  itemCount = 1,
  requiresTypeConfirmation = false,
  typeConfirmationText = "DELETE",
  loading = false
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [inputError, setInputError] = useState('');

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="w-8 h-8 text-red-500" />;
      case 'promote':
        return <Shield className="w-8 h-8 text-yellow-500" />;
      case 'demote':
        return <ShieldOff className="w-8 h-8 text-orange-400" />;
      case 'ban':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'unban':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'delete':
        return {
          bg: 'from-red-500/10 to-red-600/10',
          border: 'border-red-500/20',
          button: 'bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-600',
          text: 'text-red-600'
        };
      case 'promote':
        return {
          bg: 'from-yellow-500/10 to-yellow-600/10',
          border: 'border-yellow-500/20',
          button: 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/30 text-yellow-600',
          text: 'text-yellow-600'
        };
      case 'demote':
        return {
          bg: 'from-orange-500/10 to-orange-600/10',
          border: 'border-orange-500/20',
          button: 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/30 text-orange-300',
          text: 'text-orange-300'
        };
      case 'ban':
        return {
          bg: 'from-red-500/10 to-red-600/10',
          border: 'border-red-500/20',
          button: 'bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-600',
          text: 'text-red-600'
        };
      case 'unban':
        return {
          bg: 'from-green-500/10 to-green-600/10',
          border: 'border-green-500/20',
          button: 'bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-600',
          text: 'text-green-600'
        };
      default:
        return {
          bg: 'from-blue-500/10 to-blue-600/10',
          border: 'border-blue-500/20',
          button: 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-600',
          text: 'text-blue-600'
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    if (requiresTypeConfirmation && confirmationInput !== typeConfirmationText) {
      setInputError(`Please type "${typeConfirmationText}" to confirm`);
      return;
    }
    setInputError('');
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmationInput('');
      setInputError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.bg} ${colors.border} border flex items-center justify-center`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              {itemCount > 1 && (
                <p className="text-sm text-gray-400">{itemCount} items selected</p>
              )}
            </div>
          </div>
          
          {!loading && (
            <Button
              onClick={handleClose}
              className="bg-transparent hover:bg-gray-100 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className={`p-6 rounded-xl bg-gradient-to-r ${colors.bg} ${colors.border} border mb-6`}>
            <p className="text-gray-900 text-center font-medium">{message}</p>
          </div>

          {/* Type confirmation input */}
          {requiresTypeConfirmation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Type <span className={`font-bold ${colors.text}`}>"{typeConfirmationText}"</span> to confirm:
              </label>
              <Input
                type="text"
                value={confirmationInput}
                onChange={(e) => {
                  setConfirmationInput(e.target.value);
                  setInputError('');
                }}
                placeholder={typeConfirmationText}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-500/50"
                disabled={loading}
              />
              {inputError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {inputError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900"
          >
            {cancelText}
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={loading || (requiresTypeConfirmation && confirmationInput !== typeConfirmationText)}
            className={`flex-1 ${colors.button} border font-semibold`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>

        {/* Warning footer for dangerous actions */}
        {(type === 'delete') && (
          <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <p className="text-red-600 text-sm text-center font-medium">
              ⚠️ This action cannot be undone
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;