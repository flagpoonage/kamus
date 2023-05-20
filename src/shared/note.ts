export interface Note {
  text: string;
  type: 'link' | 'selection';
  created_at: number;
  notes?: Note[];
}
export type NoteType = Note['type'];

export async function createNote(
  text: string,
  type: NoteType,
  rootNote?: Note
) {
  const notes = ((await chrome.storage.local.get('notes')) ?? {}).notes ?? [];

  const note: Note = {
    text,
    type,
    created_at: new Date().getTime(),
  };

  if (rootNote) {
    const child_notes = rootNote.notes ?? [];
    child_notes.push(note);
  } else {
    notes.push(note);
  }

  return await chrome.storage.local.set({ notes });
}
