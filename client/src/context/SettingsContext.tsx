import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SM*Store',
  adminEmail: 'samiullahnawaz942@gmail.com',
  phone: '+92 300 1234567',
  shippingFee: 350,
  freeShippingThreshold: 50000,
  taxRate: 0,
  currency: 'PKR',
  address: 'Karachi, Pakistan'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const cached = localStorage.getItem('sm_store_settings');
      return cached ? { ...DEFAULT_SETTINGS, ...JSON.parse(cached) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        const merged = { ...DEFAULT_SETTINGS, ...res.settings };
        setSettings(merged);
        localStorage.setItem('sm_store_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Using cached store settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await api.updateSettings(newSettings);
      if (res.success && res.settings) {
        const merged = { ...settings, ...res.settings };
        setSettings(merged);
        localStorage.setItem('sm_store_settings', JSON.stringify(merged));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating store settings:', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
