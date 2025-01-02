import { browser } from 'wxt/browser';
import { clamp } from 'lodash-es';
import { POPUP_HEADER_TABS } from '~/components/PopupHeader';
import { SpaceOptions } from '~/types/app';

export const getSpacesFromStorage = async (): Promise<SpaceOptions[]> => {
  try {
    const { spaces } = await browser.storage.local.get('spaces');

    if (!Array.isArray(spaces)) {
      return [];
    }

    return spaces;
  } catch (err) {
    console.error(err);

    return [];
  }
};

export const saveSpacesToStorage = async (spaces: SpaceOptions[]) => {
  await browser.storage.local.set({ spaces: spaces });
};

export const getActiveTabIndexFromStorage = async (): Promise<number> => {
  try {
    const { activeTabIndex } = await browser.storage.local.get('activeTabIndex');

    if (typeof activeTabIndex !== 'number') {
      return 0;
    }

    return clamp(activeTabIndex, 0, POPUP_HEADER_TABS.length - 1);
  } catch (err) {
    console.error(err);
    
    return 0;
  }
}

export const setActiveTabIndexToStorage = async (tabIndex: number): Promise<void> => {
  await browser.storage.local.set({ activeTabIndex: tabIndex });
}
