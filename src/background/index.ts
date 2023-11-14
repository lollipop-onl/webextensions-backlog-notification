import Browser from 'webextension-polyfill';

Browser.action.onClicked.addListener(() => {
  Browser.browserAction.setBadgeText({ text: 'OK' });
});
