import { isObject } from './utils';

export interface CSShowNewEntry {
  msgtyp: 'show_new_entry';
  selectionText?: string;
  linkUrl?: string;
  pageUrl: string;
}

export function createNewEntryMessage(
  props: Omit<CSShowNewEntry, 'msgtyp'>
): CSShowNewEntry {
  return {
    msgtyp: 'show_new_entry',
    ...props,
  };
}

export function isShowNewEntryMessage(
  message: unknown
): message is CSShowNewEntry {
  return isObject(message) && message.msgtyp === 'show_new_entry';
}

export interface BSSaveMessage {
  msgtyp: 'save_message';
  text: string;
  pageurl: string;
  linkurl?: string;
}

export function createSaveMessage(
  props: Omit<BSSaveMessage, 'msgtyp'>
): BSSaveMessage {
  return {
    msgtyp: 'save_message',
    ...props,
  };
}

export function isSaveMessage(message: unknown): message is BSSaveMessage {
  return isObject(message) && message.msgtyp === 'save_message';
}
