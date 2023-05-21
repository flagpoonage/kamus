export interface NoteBase {
  text: string;
  created_at: number;
  category?: string;
  pageurl: string;
  notes?: Note[];
}

export interface URLNote extends NoteBase {
  url?: string;
  type: 'link';
}

export interface TextNote extends NoteBase {
  type: 'selection';
}

export type Note = URLNote | TextNote;

export type NoteType = Note['type'];

export interface NoteCreateProperties {
  text: string;
  category?: string;
  pageurl: string;
  url?: string;
}

export async function getNotes(): Promise<Note[]> {
  return ((await chrome.storage.local.get('notes')) ?? {}).notes ?? [];
}

export async function createNote(props: NoteCreateProperties, rootNote?: Note) {
  const notes = await getNotes();

  const type = props.url ? 'link' : 'selection';

  const note: Note = {
    text: props.text,
    category: props.category,
    pageurl: props.pageurl,
    type,
    url: props.url,
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

function destroyNote(note: Note, currentRoot: Note[] | Note): boolean {
  if (!Array.isArray(currentRoot)) {
    if (!currentRoot.notes) {
      return false;
    }

    return destroyNote(note, currentRoot.notes);
  }

  // We're at the root level.
  const idx = currentRoot.findIndex((a) => a === note);
  if (idx > -1) {
    currentRoot.splice(idx, 1);
    return true;
  }

  for (let i = 0; i < currentRoot.length; i++) {
    const x = currentRoot[i];
    const destroyed = destroyNote(note, x);

    if (destroyed) {
      return true;
    }
  }

  return false;
}

export async function removeNote(note: Note) {
  const notes = await getNotes();
  const destroyed = destroyNote(note, notes);

  if (!destroyed) {
    console.warn('Could find the note', note, 'in notes', notes);
  }

  await chrome.storage.local.set({ notes });
}
