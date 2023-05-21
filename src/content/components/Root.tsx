import { useEffect } from 'react';
import { isShowNewEntryMessage } from '../../shared/messages';
import { useContentScriptState } from '../state';
import { NewNoteCreator } from './NewNoteCreator';

function useMessageReceiver() {
  const {
    currentState,
    cancelAll,
    setNewNoteText,
    setNewNoteUrl,
    setNewNoteCategory,
    setNewNoteCategoryName,
    handleNewNoteMessage,
    setNewNoteCategoryColor,
    saveNote,
    categories,
  } = useContentScriptState();

  useEffect(() => {
    const msg_listener = (message: unknown) => {
      if (isShowNewEntryMessage(message)) {
        handleNewNoteMessage(message);
        console.log('Content script received show new message', message);
      } else {
        console.warn('Received unknown message');
      }
    };

    chrome.runtime.onMessage.addListener(msg_listener);

    return () => {
      chrome.runtime.onMessage.removeListener(msg_listener);
    };
  }, []);

  return {
    currentState,
    setNewNoteText,
    setNewNoteUrl,
    setNewNoteCategory,
    setNewNoteCategoryName,
    setNewNoteCategoryColor,
    cancelAll,
    saveNote,
    categories,
  };
}

export function Root() {
  const {
    currentState,
    setNewNoteText,
    setNewNoteUrl,
    setNewNoteCategory,
    setNewNoteCategoryName,
    setNewNoteCategoryColor,
    cancelAll,
    saveNote,
    categories,
  } = useMessageReceiver();
  return (
    <>
      {currentState.new_note && (
        <div className="overlay">
          <NewNoteCreator
            categories={categories}
            onCancel={cancelAll}
            value={currentState.new_note}
            onSave={() => {
              saveNote();
              cancelAll();
            }}
            onSetNoteText={setNewNoteText}
            onSetNoteUrl={setNewNoteUrl}
            onSetNoteCategory={setNewNoteCategory}
            onSetNoteCategoryName={setNewNoteCategoryName}
            onSetNoteCategoryColor={setNewNoteCategoryColor}
          />
        </div>
      )}
    </>
  );
}
