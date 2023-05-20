interface DialogActionProps {
  handler: () => void;
  text?: string;
  secondary?: boolean;
}

interface Props {
  cancel: DialogActionProps;
  accept?: DialogActionProps;
  title: string;
}

export function Dialog({
  children,
  cancel,
  accept,
  title,
}: React.PropsWithChildren<Props>) {
  const cancel_action = { ...cancel, secondary: true };
  const actions = accept ? [cancel_action, accept] : [cancel_action];
  return (
    <x-kamus-dialog>
      <DialogHeader title={title} />
      <DialogBody>{children}</DialogBody>
      <DialogActions actions={actions}></DialogActions>
    </x-kamus-dialog>
  );
}

export function DialogBody({ children }: React.PropsWithChildren<unknown>) {
  return <x-kamus-dialog-body>{children}</x-kamus-dialog-body>;
}

export function DialogHeader({ title }: { title: string }) {
  return (
    <x-kamus-dialog-header>
      <span>{title}</span>
    </x-kamus-dialog-header>
  );
}

export function DialogActions({ actions }: { actions: DialogActionProps[] }) {
  return (
    <x-kamus-dialog-actions>
      {actions.map((a, i) => (
        <DialogAction action={a} key={i} />
      ))}
    </x-kamus-dialog-actions>
  );
}

export function DialogAction({ action }: { action: DialogActionProps }) {
  const text = action.text ?? 'Unlabelled Action';

  return (
    <x-kamus-dialog-action
      class={action.secondary ? 'secondary' : ''}
      onClick={action.handler}
    >
      {text}
    </x-kamus-dialog-action>
  );
}
