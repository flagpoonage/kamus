import { useReducer } from 'react';
import { CSShowNewEntry, createSaveMessage } from '../shared/messages';
import { Note } from '../shared/note';

export interface ErrorMessage {
  error: string;
}

export interface NewNoteInterface {
  message: CSShowNewEntry;
  text: string;
  link_url?: string;
  page_url: string;
  path: Note[] | null;
}

export interface State {
  new_note: NewNoteInterface | null;
  error: ErrorMessage | null;
}

// TODO: Do proper typescript and stop being lazy!
export function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'cancel-all': {
      return {
        new_note: null,
        error: null,
      };
    }
    case 'new-note':
      return {
        ...state,
        new_note: {
          message: action.value,
          link_url: action.value.linkUrl,
          page_url: action.value.pageUrl,
          text: action.value.selectionText,
          path: null,
        },
      };
    case 'set-new-note-text':
      return {
        ...state,
        new_note: state.new_note
          ? {
              ...state.new_note,
              text: action.value,
            }
          : null,
      };
    case 'set-new-note-url':
      return {
        ...state,
        new_note: state.new_note
          ? {
              ...state.new_note,
              link_url: action.value,
            }
          : null,
      };
    default:
      return state;
  }
}

export function useContentScriptState() {
  const [state, dispatch] = useReducer(reducer, {
    new_note: null,
    error: null,
  });

  function saveNote() {
    const new_note = state.new_note;

    if (!new_note) {
      console.warn('Cant save new note that doesnt exist');
      return;
    }

    chrome.runtime.sendMessage(
      createSaveMessage({
        text: new_note.text,
        linkurl: new_note.link_url,
        pageurl: new_note.page_url,
      })
    );
  }

  function handleNewNoteMessage(message: CSShowNewEntry) {
    return dispatch({
      type: 'new-note',
      value: message,
    });
  }

  function setNewNoteText(text: string) {
    return dispatch({
      type: 'set-new-note-text',
      value: text,
    });
  }

  function setNewNoteUrl(url: string) {
    return dispatch({
      type: 'set-new-note-url',
      value: url,
    });
  }

  function cancelAll() {
    return dispatch({
      type: 'cancel-all',
    });
  }

  return {
    currentState: state,
    cancelAll,
    handleNewNoteMessage,
    setNewNoteText,
    setNewNoteUrl,
    saveNote,
  };
}
