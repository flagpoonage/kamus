import {
  CSSProperties,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { NewNoteInterface } from '../state';
import { Dialog } from './Dialog';
import { NoteCategory } from '../../shared/category';
import { getContrastColor } from '../../shared/utils';
import { CategoryTag } from '../../shared/components/CategoryTag';

interface Props {
  value: NewNoteInterface;
  categories: NoteCategory[];
  onSetNoteText: (text: string) => void;
  onSetNoteUrl: (url: string) => void;
  onSetNoteCategory: (category: string) => void;
  onSetNoteCategoryName: (category_name: string) => void;
  onSetNoteCategoryColor: (category_color: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

function useTextAreaWithContentHeight(
  value: string
): MutableRefObject<HTMLTextAreaElement | null> {
  const arearef = useRef<HTMLTextAreaElement | null>(null);

  const measure = useMemo(() => {
    const [ex] = document.getElementsByTagName('x-kamus-textmeasure');

    if (ex) {
      return ex as HTMLElement;
    }

    const el = document.createElement('x-kamus-textmeasure');
    // el.style.position = 'fixed';
    // el.style.left = '0'; //;'100%';
    // el.style.top = '0'; //'100%';
    // el.style.zIndex = `${2147483647}`;
    document.body.appendChild(el);
    return el;
  }, []);

  useLayoutEffect(() => {
    if (arearef.current === null) {
      return;
    }

    const style = window.getComputedStyle(arearef.current);
    const box = arearef.current.getBoundingClientRect();

    measure.style.padding = style.padding;
    measure.style.margin = style.margin;
    measure.style.fontFamily = style.fontFamily;
    measure.style.fontSize = style.fontSize;
    measure.style.border = style.border;
    measure.style.letterSpacing = style.letterSpacing;
    measure.style.lineHeight = style.lineHeight;
    measure.style.whiteSpace = 'pre-wrap'; // pre-line maybe?

    let val = arearef.current.value;
    if (val.endsWith('\n')) {
      // A fresh new line will expand a text field, but HTML won't display it if there's nothing
      // after it. So if that text does end a newline, we add a space so that the HTML will resize
      // properly.
      val = val + ' ';
    }

    // If the value is an empty string then the HTML will show no content which will give
    // the incorrect height. In this case we just add a space so it always shows one line.
    measure.innerText = val || ' ';

    measure.style.width = `${box.width}px`;
    measure.style.backgroundColor = 'yellow';

    arearef.current.style.height = `${measure.offsetHeight}px`;

    // const diff =
    //   arearef.current.scrollHeight -
    //   arearef.current.getBoundingClientRect().height;

    // arearef.current.style.height = `${arearef.current.scrollHeight}px`;
  }, [measure, value]);

  return arearef;
}

export function NewNoteCreator({
  value,
  onSetNoteText,
  onSetNoteUrl,
  onSetNoteCategory,
  onSetNoteCategoryName,
  onSetNoteCategoryColor,
  onCancel,
  categories,
  onSave,
}: Props) {
  const arearef = useTextAreaWithContentHeight(value.text);
  const is_new_category = value.category === '--new';
  const new_category_text_style: CSSProperties = {
    flex: '1 0 auto',
    border: 'none',
    borderRadius: '0.25em',
    fontWeight: 'bold',
    padding: '0.25em 0.5em',
    outline: 'none',
  };

  if (is_new_category) {
    new_category_text_style.backgroundColor = value.new_category_color;
    new_category_text_style.color = getContrastColor(value.new_category_color);
  }

  return (
    <Dialog
      title={'Create New Note'}
      cancel={{ text: 'Cancel', handler: onCancel }}
      accept={{ text: 'Save', handler: onSave }}
    >
      <div className="kamus-content-input-field">
        <label className="kamus-content-input-label" htmlFor="note_text">
          Text
        </label>
        <textarea
          ref={arearef}
          onChange={(ev) => onSetNoteText(ev.currentTarget.value)}
          className="kamus-content-input"
          name="note_text"
          value={value.text ?? value.link_url}
        />
      </div>
      {value.message.linkUrl && (
        <div className="kamus-content-input-field">
          <label className="kamus-content-input-label" htmlFor="note_url">
            URL
          </label>
          <input
            onChange={(ev) => onSetNoteUrl(ev.currentTarget.value)}
            type="text"
            className="kamus-content-input"
            name="note_url"
            value={value.link_url}
          />
        </div>
      )}
      <div className="kamus-content-input-field">
        <label
          className="kamus-content-input-label"
          htmlFor="category_selection"
        >
          Category
        </label>
        <div className="kamus-content-radio-input-row">
          <input
            type="radio"
            className="kamus-content-input-radio"
            name="category_selection"
            value="--none"
            checked={value.category === '--none'}
            onChange={(ev) => onSetNoteCategory(ev.currentTarget.value)}
          />
          <span>No Category</span>
        </div>
        {categories.map((a) => (
          <div className="kamus-content-radio-input-row" key={a.id}>
            <input
              type="radio"
              className="kamus-content-input-radio"
              name="category_selection"
              value={a.id}
              checked={value.category === a.id}
              onChange={(ev) => onSetNoteCategory(ev.currentTarget.value)}
            />
            <CategoryTag category={a} />
          </div>
        ))}
        <div className="kamus-content-radio-input-row">
          <input
            type="radio"
            className="kamus-content-input-radio"
            name="category_selection"
            value="--new"
            checked={value.category === '--new'}
            onChange={(ev) => onSetNoteCategory(ev.currentTarget.value)}
          />
          <span>New Category</span>
          <input
            type="text"
            style={new_category_text_style}
            disabled={!is_new_category}
            value={value.new_category}
            onChange={(ev) => onSetNoteCategoryName(ev.currentTarget.value)}
          />
          <span>Color</span>
          <input
            type="color"
            style={{ flex: '0 0 50px' }}
            disabled={!is_new_category}
            value={value.new_category_color}
            onChange={(ev) => onSetNoteCategoryColor(ev.currentTarget.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
