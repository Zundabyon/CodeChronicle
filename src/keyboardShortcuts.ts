// Resolve shortcuts inside the active window so background actions cannot fire.
export function activateButtonShortcut(event:KeyboardEvent,scope:Element|null) {
  if(!scope || event.isComposing || event.altKey || event.ctrlKey || event.metaKey)return false;
  const editing=event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]');
  const key=event.key.toLowerCase();
  if(editing && !/^f\d+$/.test(key))return false;
  const button=Array.from(scope.querySelectorAll<HTMLButtonElement>('button[data-shortcut]'))
    .find(button=>button.dataset.shortcut?.split(' ').includes(key) && button.getClientRects().length>0);
  if(!button)return false;
  event.preventDefault();
  if(!event.repeat && !button.disabled)button.click();
  return true;
}
