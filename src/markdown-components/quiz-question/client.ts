/**
 * <quiz-question> in the browser: wrong answers get crossed out, the right one
 * gets confetti and reveals the explanation. Markup comes from ./build.ts.
 */
import { confetti } from '../../scripts/confetti.ts';

const PRAISE = ['Yes! 🎉', 'You got it! ⭐', 'Correct! 🙌', 'Nailed it! 🎯', 'Exactly right! 🌟'];
const NUDGE = ['Not quite. Try again!', 'Close! Have another go.', 'Nope, but keep going!'];

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

class QuizQuestion extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready !== undefined) return;
    this.dataset.ready = '';
    this.addEventListener('click', (event) => this.answer(event));
  }

  answer(event: Event) {
    const choice = (event.target as Element | null)?.closest<HTMLButtonElement>('.quiz-question__choice');
    if (!choice || this.dataset.state === 'solved' || choice.getAttribute('aria-disabled') === 'true') return;
    const feedback = this.querySelector('.quiz-question__feedback');

    if (choice.hasAttribute('data-correct')) {
      this.dataset.state = 'solved';
      choice.dataset.result = 'right';
      for (const button of this.querySelectorAll('.quiz-question__choice')) {
        button.setAttribute('aria-disabled', 'true');
      }
      if (feedback) feedback.textContent = pick(PRAISE);
      this.querySelector('.quiz-question__explanation')?.removeAttribute('hidden');
      confetti(choice);
    } else {
      // aria-disabled instead of disabled, so keyboard focus stays where it is.
      choice.dataset.result = 'wrong';
      choice.setAttribute('aria-disabled', 'true');
      if (feedback) feedback.textContent = pick(NUDGE);
    }
  }
}

if (!customElements.get('quiz-question')) customElements.define('quiz-question', QuizQuestion);
