import { useEffect, useState } from 'react';
import { Note, createNote, removeNote } from '../../shared/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const change_listener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      const notes = changes['notes'];

      if (!notes || notes.newValue === notes.oldValue) {
        return;
      }

      setNotes(notes.newValue);
    };

    chrome.storage.local.onChanged.addListener(change_listener);

    return () => {
      chrome.storage.local.onChanged.removeListener(change_listener);
    };
  }, []);

  function setNotesValue(value: Note[]) {
    chrome.storage.local.set({ notes: value });
  }

  return {
    notes,
    update: setNotesValue,
    addNote: createNote,
    removeNote: removeNote,
  };
}
