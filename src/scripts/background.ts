import { browser } from "webextension-polyfill-ts";
import { getSpacesFromStorage } from "~/utils/webextension";
import { requestBacklogAPI } from "./api";

const setCountBadge = (count: number) => {
  console.log(count);
  
  const badgeText = count > 99 ? '99+' : `${count}`;

  if (count > 0) {
    browser.browserAction.setBadgeText({ text: badgeText })
    browser.browserAction.setBadgeTextColor({ color: '#ffffff' })
    browser.browserAction.setBadgeBackgroundColor({ color: '#fc0006' });

    return;
  }

  browser.browserAction.setBadgeText({ text: null });
}

const updateNotificationCount = async () => {
  const [space] = await getSpacesFromStorage()

  if (!space || !space.domain || !space.apiKey) {
    setCountBadge(0);
    
    return;
  }
  
  const { count } = await requestBacklogAPI('get', '/api/v2/notifications/count', { resourceAlreadyRead: false });

  setCountBadge(count);
}

browser.alarms.create({
  periodInMinutes: 3,
})

browser.alarms.onAlarm.addListener(async () => {
  updateNotificationCount();
})

updateNotificationCount();
