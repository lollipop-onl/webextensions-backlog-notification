import { browser } from 'webextension-polyfill-ts';
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
