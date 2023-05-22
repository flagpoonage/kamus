import { createNewCategory } from '../shared/category';
import { createNewEntryMessage, isSaveMessage } from '../shared/messages';
import { createNote, getNotes } from '../shared/note';
import { createSafeUrl } from '../shared/utils';

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'take-link-context',
    contexts: ['link', 'selection'],
    title: 'Take note',
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) {
    console.warn('Unable to find active tab');
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    createNewEntryMessage({
      selectionText: info.selectionText,
      pageUrl: info.pageUrl,
      linkUrl: info.linkUrl,
    })
  );
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (isSaveMessage(message)) {
    const category =
      message.category === '--new'
        ? (
            await createNewCategory({
              title: message.new_category,
              color: message.new_category_color,
            })
          )?.id
        : message.category === '--none'
        ? undefined
        : message.category;

    await createNote({
      text: message.text,
      pageurl: message.page_url,
      url: message.link_url,
      category: category,
    });
  }
});

(async () => {
  const notes = await getNotes();
  chrome.action.setBadgeText({
    text: notes.length.toString(),
  });
  chrome.storage.local.onChanged.addListener((change) => {
    if (change.notes) {
      chrome.action.setBadgeText({
        text: (change.notes.newValue as []).length.toString(),
      });
    }
  });
})();
