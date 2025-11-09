import { create } from 'zustand';

interface SettingsStore {
  // Add any frontend-specific settings state here
  // For now, we'll use the taskStore for app settings
}

export const useSettingsStore = create<SettingsStore>(() => ({}));
