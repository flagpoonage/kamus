import { useMemo } from 'react';
import { useNotes } from './useNotes';
import { Note } from '../../shared/note';

function flattenNotes(notes: Note[]): Note[] {
  let list: Note[] = [];

  for (const n of notes) {
    list.push(n);
    if (n.notes) {
      list = list.concat(flattenNotes(n.notes));
    }
  }

  return list;
}

export function useNotesList() {
  const { notes } = useNotes();
  return useMemo(() => flattenNotes(notes), [notes]);
}
