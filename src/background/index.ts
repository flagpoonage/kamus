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

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.selectionText) {
    createNote(info.selectionText, 'selection');
  } else if (info.linkUrl) {
    createNote(info.linkUrl, 'link');
  }
  console.log('Context menu clicked', info);
});
