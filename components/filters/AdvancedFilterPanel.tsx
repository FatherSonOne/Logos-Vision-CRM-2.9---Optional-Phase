import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  name: string;
  rules: FilterRule[];
  logic: 'AND' | 'OR';
}

export interface SavedFilter {
  id: string;
  name: string;
  group: FilterGroup;
  createdAt: Date;
}

export interface FilterConfig {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
}

// ============================================
// ADVANCED FILTER PANEL
// ============================================

interface AdvancedFilterPanelProps {
  filters: FilterConfig[];
  onApplyFilters: (group: FilterGroup) => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, group: FilterGroup) => void;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  onApplyFilters,
  savedFilters = [],
  onSaveFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<FilterGroup>({
    id: 'default',
    name: 'Current Filter',
    rules: [],
    logic: 'AND',
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [activeRuleCount, setActiveRuleCount] = useState(0);

  useEffect(() => {
    const count = filterGroup.rules.filter(r => r.value !== '' && r.value !== null).length;
    setActiveRuleCount(count);
  }, [filterGroup]);

  const getOperatorsForType = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
        ];
      case 'number':
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'greaterThan', label: 'Greater than' },
          { value: 'lessThan', label: 'Less than' },
        ];
      case 'select':
        return [
          { value: 'equals', label: 'Is' },
          { value: 'notEquals', label: 'Is not' },
        ];
      default:
        return [{ value: 'equals', label: 'Equals' }];
    }
  };

  const addRule = () => {
    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: filters[0]?.field || '',
      operator: 'equals',
      value: '',
    };
    setFilterGroup({
      ...filterGroup,
      rules: [...filterGroup.rules, newRule],
    });
  };

  const updateRule = (id: string, updates: Partial<FilterRule>) => {
    setFilterGroup({
      ...filterGroup,
      rules: filterGroup.rules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    });
  };

  const removeRule = (id: string) => {
    setFilterGroup({
      ...filterGroup,
      rules: filterGroup.rules.filter(rule => rule.id !== id),
    });
  };

  const applyFilters = () => {
    onApplyFilters(filterGroup);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilterGroup({
      ...filterGroup,
      rules: [],
    });
    onApplyFilters({ ...filterGroup, rules: [] });
  };

  const loadSavedFilter = (saved: SavedFilter) => {
    setFilterGroup(saved.group);
    onApplyFilters(saved.group);
    setIsOpen(false);
  };

  const saveCurrentFilter = () => {
    if (onSaveFilter && filterName) {
      onSaveFilter(filterName, filterGroup);
      setShowSaveDialog(false);
      setFilterName('');
    }
  };

  const renderRuleValue = (rule: FilterRule) => {
    const filterConfig = filters.find(f => f.field === rule.field);
    if (!filterConfig) return null;

    switch (filterConfig.type) {
      case 'text':
        return (
          <input
            type="text"
            value={rule.value}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            placeholder="Enter value..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={rule.value}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            placeholder="Enter number..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={rule.value}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={rule.value}
            onChange={e => updateRule(rule.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            {filterConfig.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          activeRuleCount > 0
            ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filters
        {activeRuleCount > 0 && (
          <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-bold">
            {activeRuleCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Advanced Filters</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Saved Filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map(saved => (
                    <button
                      key={saved.id}
                      onClick={() => loadSavedFilter(saved)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {saved.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Rules */}
            <div className="flex-1 overflow-y-auto p-4">
              {filterGroup.rules.length === 0 ? (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    No filters applied. Add a rule to get started.
                  </p>
                  <button
                    onClick={addRule}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Add First Rule
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filterGroup.rules.map((rule, index) => {
                    const filterConfig = filters.find(f => f.field === rule.field);
                    const operators = getOperatorsForType(filterConfig?.type || 'text');

                    return (
                      <div key={rule.id} className="space-y-2">
                        {index > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            <select
                              value={filterGroup.logic}
                              onChange={e =>
                                setFilterGroup({
                                  ...filterGroup,
                                  logic: e.target.value as 'AND' | 'OR',
                                })
                              }
                              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold text-sm border-none"
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                          </div>
                        )}

                        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                          {/* Field */}
                          <select
                            value={rule.field}
                            onChange={e => {
                              const newField = e.target.value;
                              const newConfig = filters.find(f => f.field === newField);
                              updateRule(rule.id, {
                                field: newField,
                                operator: getOperatorsForType(newConfig?.type || 'text')[0].value,
                                value: '',
                              });
                            }}
                            className="w-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm font-medium"
                          >
                            {filters.map(f => (
                              <option key={f.field} value={f.field}>
                                {f.label}
                              </option>
                            ))}
                          </select>

                          {/* Operator */}
                          <select
                            value={rule.operator}
                            onChange={e => updateRule(rule.id, { operator: e.target.value })}
                            className="w-36 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                          >
                            {operators.map(op => (
                              <option key={op.value} value={op.value}>
                                {op.label}
                              </option>
                            ))}
                          </select>

                          {/* Value */}
                          {renderRuleValue(rule)}

                          {/* Remove */}
                          <button
                            onClick={() => removeRule(rule.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={addRule}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {onSaveFilter && filterGroup.rules.length > 0 && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Filter
                  </button>
                )}
                {filterGroup.rules.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Save Filter Dialog */}
          {showSaveDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSaveDialog(false)} />
              <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Save Filter
                </h3>
                <input
                  type="text"
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                  placeholder="Enter filter name..."
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCurrentFilter}
                    disabled={!filterName}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};