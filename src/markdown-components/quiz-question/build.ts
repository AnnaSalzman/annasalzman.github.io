import { h, isElement, meaningful, unwrapParagraph, type Element, type ElementContent } from '../lib/hast.ts';
import type { MarkdownComponent } from '../lib/types.ts';

/**
 * <quiz-question>
 *
 * Which planet is the largest?
 *
 * - [ ] Mars
 * - [x] Jupiter
 *
 * Anything after the list is shown once the right answer is picked.
 *
 * </quiz-question>
 *
 * The question is everything before the list; the list is the answers (a GitHub
 * task list, [x] marks the right one); everything after is the explanation.
 *
 * Browser behaviour: ./client.ts
 */
export const quizQuestion: MarkdownComponent = {
  name: 'quiz-question',
  block: true,
  build(el, ctx) {
    const kids = meaningful(el.children);
    const listIndex = kids.findIndex((kid) => isElement(kid, 'ul') || isElement(kid, 'ol'));
    if (listIndex === -1) {
      ctx.warn(
        '<quiz-question> has no answer list. Leave a blank line after <quiz-question>, then list answers as "- [ ] wrong" and "- [x] right".',
      );
      return h('div', { className: ['quiz-question-broken'] }, el.children);
    }

    const list = kids[listIndex] as Element;
    const choices = list.children.filter((li): li is Element => isElement(li, 'li')).map(toChoice);
    if (!choices.some((choice) => choice.correct)) {
      ctx.warn('<quiz-question> has no right answer marked. Put an x in its box: "- [x] the right answer".');
    }

    const prompt = kids.slice(0, listIndex);
    const explanation = kids.slice(listIndex + 1);

    return h('quiz-question', {}, [
      h('div', { className: ['quiz-question__prompt'] }, prompt),
      h(
        'div',
        { className: ['quiz-question__choices'], role: 'group', ariaLabel: 'Answers' },
        choices.map((choice) =>
          h(
            'button',
            { type: 'button', className: ['quiz-question__choice'], ...(choice.correct ? { dataCorrect: '' } : {}) },
            choice.content,
          ),
        ),
      ),
      h('p', { className: ['quiz-question__feedback'], role: 'status' }, []),
      ...(explanation.length > 0
        ? [h('div', { className: ['quiz-question__explanation'], hidden: true }, explanation)]
        : []),
    ]);
  },
};

function toChoice(li: Element): { correct: boolean; content: ElementContent[] } {
  let correct = false;
  const strip = (nodes: ElementContent[]): ElementContent[] =>
    nodes.flatMap((node) => {
      if (node.type !== 'element') return [node];
      if (node.tagName === 'input') {
        correct ||= Boolean(node.properties?.checked);
        return [];
      }
      if (node.tagName === 'p') return strip(node.children);
      return [node];
    });
  const content = strip(unwrapParagraph(li.children));
  // The checkbox leaves a leading space behind ("[x] Jupiter" → " Jupiter").
  const first = content[0];
  if (first?.type === 'text') content[0] = { type: 'text', value: first.value.trimStart() };
  return { correct, content };
}
