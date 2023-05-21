import { useMemo } from 'react';
import { NoteCategory } from '../category';
import { getContrastColor } from '../utils';

interface Props {
  category: NoteCategory;
  variant?: CategoryTagVariant;
}

export enum CategoryTagVariant {
  Small = 'small',
}

export function CategoryTag({
  category,
  variant,
}: React.PropsWithChildren<Props>) {
  const contrast_color = useMemo(
    () => getContrastColor(category.color),
    [category.color]
  );
  return (
    <x-kamus-category-tag
      class={variant === CategoryTagVariant.Small ? 'small' : ''}
      style={{
        backgroundColor: category.color,
        color: contrast_color,
      }}
    >
      {category.title}
    </x-kamus-category-tag>
  );
}
