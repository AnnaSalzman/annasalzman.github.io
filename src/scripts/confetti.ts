/** A small burst of confetti from an element. Skipped for people who prefer reduced motion. */
const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map((c) => `var(--color-${c})`);

export function confetti(origin: Element, pieces = 30) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = COLORS[i % COLORS.length];
    document.body.append(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 140;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    piece
      .animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.6 },
          { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 140}px)) rotate(${Math.random() * 900}deg)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
      )
      .finished.finally(() => piece.remove());
  }
}
