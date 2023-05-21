import { useState, useEffect } from 'react';
import { v4 as randomUUID } from 'uuid';

export interface NoteCategory {
  title: string;
  id: string;
  parent_id?: string;
  color: string;
}

export interface NoteCategoryCreateProperties {
  title: string;
  color: string;
  parent_id?: string | undefined;
}

export async function createNewCategory(
  properties: NoteCategoryCreateProperties
) {
  const current_categories = await getCategories();

  const new_id = randomUUID();
  const new_category = {
    id: new_id,
    ...properties,
  };

  current_categories.push(new_category);

  await chrome.storage.local.set({ categories: current_categories });

  return new_category;
}

export async function getCategories() {
  return (
    ((await chrome.storage.local.get('categories')) ?? {}).categories ?? []
  );
}

export function useCategories() {
  const [categories, setCategories] = useState<NoteCategory[]>([]);

  useEffect(() => {
    (async () => {
      // Not great
      const current = await getCategories();
      setCategories(current);
    })();

    const change_handler = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      const change = changes.categories;
      if (!change) {
        return;
      }

      setCategories(change.newValue);
    };

    chrome.storage.local.onChanged.addListener(change_handler);

    return () => {
      chrome.storage.local.onChanged.removeListener(change_handler);
    };
  }, []);

  return categories;
}
