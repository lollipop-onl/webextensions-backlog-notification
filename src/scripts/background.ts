import { browser } from 'webextension-polyfill-ts';
import { getSpacesFromStorage } from '~/utils/webextension';
import { requestBacklogAPI } from './api';

browser.browserAction.setBadgeTextColor?.({ color: '#ffffff' });

const setCountBadge = (count: number) => {
  console.log(count);

  const badgeText = count > 99 ? '99+' : `${count}`;

  if (count > 0) {
    browser.browserAction.setBadgeText({ text: badgeText });
    browser.browserAction.setBadgeBackgroundColor({ color: '#fe1aaf' });

    return;
  }

  browser.browserAction.setBadgeText({ text: null });
};

const updateNotificationCount = async () => {
  try {
    const [space] = await getSpacesFromStorage();

    if (!space || !space.domain || !space.apiKey) {
      setCountBadge(0);

      return;
    }

    const { count } = await requestBacklogAPI(
      'get',
      '/api/v2/notifications/count',
      { resourceAlreadyRead: false }
    );

    setCountBadge(count);
  } catch {
    browser.browserAction.setBadgeText({ text: '!' });
    browser.browserAction.setBadgeBackgroundColor({ color: '#ffb219' });
  }
};

browser.alarms.create({
  periodInMinutes: 1,
});

browser.alarms.onAlarm.addListener(async () => {
  updateNotificationCount();
});

browser.storage.onChanged.addListener(() => {
  updateNotificationCount();
});

updateNotificationCount();
