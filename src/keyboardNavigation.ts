// Follow the visible layout, falling back to list order at the edge of a row.
export function moveButtonFocus(event: KeyboardEvent, scope: Element | null) {
  if (!scope || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) return;
  const buttons = Array.from(scope.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
    .filter(button => button.getClientRects().length > 0 && !button.closest('[aria-hidden="true"]'));
  if (!buttons.length) return;
  event.preventDefault();
  const current = buttons.find(button => button === document.activeElement);
  if (!current) { buttons[0].focus(); return; }
  const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
  const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
  const rect = current.getBoundingClientRect();
  const candidates = buttons.filter(button => button !== current).map(button => {
    const next = button.getBoundingClientRect();
    const dx = next.left + next.width / 2 - rect.left - rect.width / 2;
    const dy = next.top + next.height / 2 - rect.top - rect.height / 2;
    return {button, distance: (horizontal ? dx : dy) * direction, cross: Math.abs(horizontal ? dy : dx)};
  }).filter(candidate => candidate.distance > 4)
    .sort((a,b) => (a.distance + a.cross * 3) - (b.distance + b.cross * 3));
  const next = candidates[0]?.button ?? buttons[(buttons.indexOf(current) + direction + buttons.length) % buttons.length];
  next.focus();
}
