import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useToast } from '../../src/components/ui/Toast';

// ============================================
// TYPES
// ============================================

export interface ExportField {
  key: string;
  label: string;
  format?: (value: any) => string;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const generateCSV = (data: any[], fields: ExportField[]): string => {
  const header = fields.map(f => f.label).join(',');
  const rows = data.map(item => {
    return fields.map(f => {
      const value = item[f.key];
      const formatted = f.format ? f.format(value) : value;
      const escaped = String(formatted || '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  });
  return [header, ...rows].join('\n');
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// ============================================
// EXPORT BUTTON
// ============================================

interface ExportButtonProps {
  data: any[];
  fields: ExportField[];
  filename?: string;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  fields,
  filename = 'export',
  label = 'Export CSV',
}) => {
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = () => {
    const csv = generateCSV(data, fields);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `${filename}-${timestamp}`);
    setShowMenu(false);
    showToast(`Exported ${data.length} items to CSV`, 'success');
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        {label}
      </button>
    </div>
  );
};

// ============================================
// ADVANCED EXPORT DIALOG
// ============================================

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  availableFields: ExportField[];
  title: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  data,
  availableFields,
  title,
}) => {
  const { showToast } = useToast();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedFields(availableFields.map(f => f.key));
    }
  }, [isOpen, availableFields]);

  const toggleField = (key: string) => {
    setSelectedFields(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const deselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    const fieldsToExport = availableFields.filter(f => selectedFields.includes(f.key));
    
    const csv = generateCSV(data, fieldsToExport);
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    downloadCSV(csv, `${finalFilename}-${timestamp}`);
    
    showToast(`Exported ${data.length} items with ${fieldsToExport.length} fields to CSV`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Export {title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {data.length} items ready to export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Select Fields ({selectedFields.length}/{availableFields.length})
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              {availableFields.map(field => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {field.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              File Name (Optional)
            </label>
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              placeholder={`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Export will include {selectedFields.length} fields
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedFields.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
