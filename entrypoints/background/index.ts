import { browser } from 'wxt/browser';
import { getSpacesFromStorage } from '~/utils/webextension';
import { requestBacklogAPI } from '~/api';

const browserAction = browser.action ?? browser.browserAction;

export default defineBackground({
  type: 'module',
  main: () => {
  browserAction.setBadgeTextColor?.({ color: '#ffffff' });
  
  const setCountBadge = (count: number) => {
    console.log(count);
  
    const badgeText = count > 99 ? '99+' : `${count}`;
  
    if (count > 0) {
      browserAction.setBadgeText({ text: badgeText });
      browserAction.setBadgeBackgroundColor({ color: '#fe1aaf' });
  
      return;
    }
  
    browserAction.setBadgeText({ text: null });
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
      browserAction.setBadgeText({ text: '!' });
      browserAction.setBadgeBackgroundColor({ color: '#ffb219' });
    }
  };
  
  browser.alarms.create({
    periodInMinutes: 1,
  });
  
  browser.alarms.onAlarm.addListener(async () => {
    updateNotificationCount();
  });
  
  browser.storage.onChanged.addListener(async (changes) => {
    console.log(changes);
    
    if ('spaces' in changes) {
      await updateNotificationCount();
    }
  });
  
  updateNotificationCount();
}})
