/**
 * Paper ⇄ chalkboard toggle. The choice is remembered per browser; without a
 * choice the site follows the system setting. The inline script in
 * BaseLayout applies a saved choice before the first paint.
 */
const root = document.documentElement;
const systemDark = matchMedia('(prefers-color-scheme: dark)');

function current(): 'light' | 'dark' {
  const chosen = root.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return systemDark.matches ? 'dark' : 'light';
}

function sync() {
  for (const button of document.querySelectorAll('[data-theme-toggle]')) {
    button.setAttribute('aria-pressed', String(current() === 'dark'));
  }
}

document.addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest('[data-theme-toggle]');
  if (!button) return;
  const next = current() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    // Private mode or blocked storage: the toggle still works for this page view.
  }
  sync();
});

systemDark.addEventListener('change', sync);
sync();
