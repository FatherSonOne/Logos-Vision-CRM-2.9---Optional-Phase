import { mockPortalLayouts } from '../data/mockData';
import type { PortalLayout } from '../types';

const DB_KEY = 'logos_vision_portal_layouts';

export const portalDbService = {
  getLayouts: (): PortalLayout[] => {
    try {
      const storedData = localStorage.getItem(DB_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      } else {
        // Seed with mock data on first load
        localStorage.setItem(DB_KEY, JSON.stringify(mockPortalLayouts));
        return mockPortalLayouts;
      }
    } catch (error) {
      console.error("Error reading portal layouts from localStorage", error);
      return mockPortalLayouts; // Fallback
    }
  },

  saveLayouts: (layouts: PortalLayout[]): void => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(layouts));
    } catch (error) {
      console.error("Error saving portal layouts to localStorage", error);
    }
  },
};
