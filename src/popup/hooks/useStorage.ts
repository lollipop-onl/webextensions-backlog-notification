import { useCallback, useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';

type StorageKey = 'popup.route' | 'popup.accessToken';

export const useStorage = (key: StorageKey, fallbackValue?: string) => {
  const [value, setValue] = useState<string>();

  const update = useCallback(async (value: string | undefined) => {
    if (value == null) {
      await Browser.storage.local.remove(key);
      setValue(undefined);

      return;
    }

    await Browser.storage.local.set({ [key]: value });
    setValue(value);
  }, []);

  useEffect(() => {
    Browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && key in changes) {
        setValue(changes[key].newValue);
      }
    });
  }, []);

  useEffect(() => {
    Browser.storage.local.get([key]).then((values) => {
      setValue(values[key] ?? fallbackValue);
    });
  }, []);

  return [value, update] as const;
};
