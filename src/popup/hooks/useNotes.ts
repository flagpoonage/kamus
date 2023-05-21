import { useEffect, useMemo, useState } from 'react';
import { Note, createNote, getNotes, removeNote } from '../../shared/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const notes = await getNotes();
      setNotes(notes);
    })();

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

export function useRecentNotes() {
  const { notes } = useNotes();
  return useMemo(
    () =>
      notes.sort((a, b) =>
        a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0
      ),
    [notes]
  );
}

export function useSearchNotes(query: string) {
  const qtrim = query.trim();
  const notes = useRecentNotes();
  return useMemo(
    () =>
      !qtrim
        ? notes
        : notes.filter(
            (a) =>
              a.text.includes(qtrim) ||
              a.pageurl.includes(qtrim) ||
              (a.type === 'link' && a.url?.includes(qtrim))
          ),
    [notes, qtrim]
  );
}
