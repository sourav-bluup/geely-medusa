import { AdminRegion, AdminStore } from '@medusajs/types';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useRegions, useStockLocations, useStore } from './../../../../../hooks/api';
import { TabInputItem } from './tab-input';
import { toCurrencyItem } from './utils/currency-item';
import { toStockItem } from './utils/stock-item';

interface CreateFormContextType {
  store?: AdminStore;
  regions?: AdminRegion[];
  defaultRegion?: AdminRegion;
  isLoading?: boolean;
  isReady?: boolean;
  defaultCurrencyCode?: string;
  stockItems?: TabInputItem[];
  currencyItems?: TabInputItem[];
}

const CreateFormContext = createContext<CreateFormContextType | undefined>(undefined);

export const useCreateFormContext = () => {
  const context = useContext(CreateFormContext);
  if (!context) {
    throw new Error('useCreateFormContext must be used within a CreateFormProvider');
  }
  return context;
};

interface CreateFormProviderProps {
  children: ReactNode;
}

export const CreateFormProvider: React.FC<CreateFormProviderProps> = ({ children }) => {
  const { store, isLoading: isLoadingStore } = useStore();
  const {
    stock_locations: stockLocations,
    isPending,
    isError,
  } = useStockLocations({
    limit: 9999,
    fields: 'id,name',
  });

  const { regions, isLoading: isLoadingRegions } = useRegions({ limit: 9999 });

  const defaultRegion = regions?.find((region) => region.id === store?.default_region_id);
  const defaultCurrencyCode = defaultRegion?.currency_code;

  const currencies = store?.supported_currencies.sort((a, b) => {
    if (a.currency_code === defaultCurrencyCode) {
      return -1;
    }
    if (b.currency_code === defaultCurrencyCode) {
      return 1;
    }
    return a.currency_code.localeCompare(b.currency_code);
  });

  const isLoading = isLoadingStore || isLoadingRegions || isPending || isError;

  const [stockItems, setStockItems] = useState<TabInputItem[]>([]);
  const [currencyItems, setCurrencyItems] = useState<TabInputItem[]>([]);

  useEffect(() => {
    if (stockLocations) {
      setStockItems(stockLocations.map((location) => toStockItem(location)));
    }
  }, [stockLocations]);

  useEffect(() => {
    if (currencies) {
      setCurrencyItems(currencies.map((currency) => toCurrencyItem(currency)));
    }
  }, [currencies]);

  const contextValue: CreateFormContextType = useMemo(
    () => ({
      store,
      regions,
      defaultRegion,
      isLoading,
      isReady: !isLoading && stockItems.length > 0 && currencyItems.length > 0,
      defaultCurrencyCode,
      stockItems,
      currencyItems,
    }),
    [store, regions, defaultRegion, isLoading, defaultCurrencyCode, stockItems, currencyItems],
  );

  return <CreateFormContext.Provider value={contextValue}>{children}</CreateFormContext.Provider>;
};
