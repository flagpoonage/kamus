import type { Dialog, DialogHeader, DialogBody, DialogActions } from './Dialog';
import type { CategoryTag } from '../../shared/components/CategoryTag';
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['x-kamus-dialog']: CustomElement<Dialog>;
      ['x-kamus-dialog-header']: CustomElement<DialogHeader>;
      ['x-kamus-dialog-body']: CustomElement<DialogBody>;
      ['x-kamus-dialog-actions']: CustomElement<DialogActions>;
      ['x-kamus-dialog-action']: CustomElement<DialogAction>;
      ['x-kamus-category-tag']: CustomElement<CategoryTag>;
    }
  }
}
