/**
 * <flip-card> in the browser: the button flips the card and keeps screen
 * readers in step by hiding whichever face is turned away.
 * Markup comes from ./build.ts.
 */
class FlipCard extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector<HTMLButtonElement>(':scope > .flip-card');
    if (!button || button.dataset.ready !== undefined) return;
    button.dataset.ready = '';

    const front = button.querySelector('.flip-card__front');
    const back = button.querySelector('.flip-card__back');
    const show = (flipped: boolean) => {
      button.setAttribute('aria-pressed', String(flipped));
      front?.setAttribute('aria-hidden', String(flipped));
      back?.setAttribute('aria-hidden', String(!flipped));
    };

    show(false);
    button.addEventListener('click', () => show(button.getAttribute('aria-pressed') !== 'true'));
  }
}

if (!customElements.get('flip-card')) customElements.define('flip-card', FlipCard);
