import { useState } from 'react';
import { useSearchNotes } from '../hooks/useNotes';
import { useCategories } from '../../shared/category';
import {
  CategoryTag,
  CategoryTagVariant,
} from '../../shared/components/CategoryTag';
import { formatDistanceToNow } from 'date-fns';

export function Root() {
  const [search, setSearch] = useState<string>('');
  const search_notes = useSearchNotes(search);
  const categories = useCategories();

  return (
    <div className="content">
      <header>
        <h1>Kamus Notes</h1>
        <div className="cont_search">
          <input
            type="search"
            placeholder="Search your notes"
            onChange={(ev) => setSearch(ev.currentTarget.value)}
          />
        </div>
      </header>
      <main>
        <div>
          <div className="cont_list">
            {search_notes.map((note, idx) => {
              const category = categories.find((a) => a.id === note.category);
              return (
                <div className="note" key={idx}>
                  <div className="note-info">
                    added{' '}
                    {formatDistanceToNow(new Date(note.created_at), {
                      addSuffix: true,
                    })}
                    {category && (
                      <>
                        {' in '}
                        <CategoryTag
                          variant={CategoryTagVariant.Small}
                          category={category}
                        />
                      </>
                    )}
                  </div>
                  <div className="note-preview">{note.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
