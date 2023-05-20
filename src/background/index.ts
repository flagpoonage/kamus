import { createNewEntryMessage, isSaveMessage } from '../shared/messages';
import { createNote } from '../shared/note';

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'take-link-context',
    contexts: ['link'],
    title: 'Take URL as note',
  });
  chrome.contextMenus.create({
    id: 'take-selection-note',
    contexts: ['selection'],
    title: 'Take note from selection',
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  const [active_tab] = await chrome.tabs.query({ active: true });

  if (!active_tab?.id) {
    console.warn('Unable to find active tab');
    return;
  }

  chrome.tabs.sendMessage(
    active_tab.id,
    createNewEntryMessage({
      selectionText: info.selectionText,
      pageUrl: info.pageUrl,
      linkUrl: info.linkUrl,
    })
  );
});

chrome.runtime.onMessage.addListener((message) => {
  if (isSaveMessage(message)) {
    createNote({
      text: message.text,
      pageurl: message.pageurl,
      url: message.linkurl,
    });
  }
});
