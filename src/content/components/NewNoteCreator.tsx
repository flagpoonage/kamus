import { useLayoutEffect, useRef } from 'react';
import { NewNoteInterface, State, useContentScriptState } from '../state';
import { Dialog } from './Dialog';

interface Props {
  value: NewNoteInterface;
  onSetNoteText: (text: string) => void;
  onSetNoteUrl: (url: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function NewNoteCreator({
  value,
  onSetNoteText,
  onSetNoteUrl,
  onCancel,
  onSave,
}: Props) {
  const arearef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (arearef.current === null) {
      return;
    }

    const diff =
      arearef.current.scrollHeight -
      arearef.current.getBoundingClientRect().height;

    arearef.current.style.height = `${arearef.current.scrollHeight}px`;
  }, [value]);

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
    </Dialog>
  );
}
