import { FilterGroup } from './AdvancedFilterPanel';

export const applyFilterLogic = (data: any[], filterGroup: FilterGroup | null): any[] => {
  if (!filterGroup || filterGroup.rules.length === 0) return data;

  const activeRules = filterGroup.rules.filter(rule => rule.value !== '' && rule.value !== null && rule.value !== undefined);

  if (activeRules.length === 0) return data;
  
  return data.filter(item => {
    const results = activeRules.map(rule => {
      const itemValue = item[rule.field];
      const filterValue = rule.value;

      if (itemValue === undefined || itemValue === null) return false;
      
      const isDateComparison = !isNaN(Date.parse(itemValue)) && !isNaN(Date.parse(filterValue));

      switch (rule.operator) {
        case 'equals':
            if (isDateComparison) {
                return new Date(itemValue).toDateString() === new Date(filterValue).toDateString();
            }
            return String(itemValue).toLowerCase() === String(filterValue).toLowerCase();
        case 'notEquals':
            if (isDateComparison) {
                return new Date(itemValue).toDateString() !== new Date(filterValue).toDateString();
            }
            return String(itemValue).toLowerCase() !== String(filterValue).toLowerCase();
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'greaterThan':
          if (isDateComparison) {
              return new Date(itemValue) > new Date(filterValue);
          }
          return Number(itemValue) > Number(filterValue);
        case 'lessThan':
          if (isDateComparison) {
              return new Date(itemValue) < new Date(filterValue);
          }
          return Number(itemValue) < Number(filterValue);
        default:
          return true;
      }
    });
    
    return filterGroup.logic === 'AND'
      ? results.every(r => r)
      : results.some(r => r);
  });
};