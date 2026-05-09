import 'server-only';

const INTROS = [
  'That is a thoughtful question, and there is more to it than meets the eye.',
  'Great prompt — let me work through it in some detail.',
  'I appreciate you asking, because this is a topic that benefits from careful unpacking.',
  'Happy to dig into this with you.',
  'There are several useful angles to consider here, so let me lay them out one at a time.',
];

const BODIES = [
  'The first thing worth noting is that the answer depends a lot on context. In some cases, the most direct approach is also the best one, but in others it pays to step back and reconsider the assumptions baked into the question itself. A useful habit is to separate what you actually need from what merely feels familiar, since the two often diverge.',
  'A common mistake is to optimise for the obvious metric and miss the second-order effects. If you are working on something that other people will rely on, the cost of getting it wrong compounds, so it is usually worth investing extra time up front. That said, do not let perfect be the enemy of good — shipping something workable and iterating tends to beat polishing in isolation.',
  'I would think about this in three layers. At the surface there is the immediate problem you are trying to solve. One level deeper there is the system that produced the problem, which is usually where the real leverage lives. And underneath that there are the constraints and incentives shaping the system itself, which are slower to change but matter the most over time.',
  'There is no single correct answer, but a few principles tend to hold up well. Keep the moving parts small. Make the failure modes visible. Prefer reversible decisions when you can, and reserve your careful deliberation for the ones that are not. When in doubt, write down what you expect to happen and check your prediction against reality afterwards.',
  'It is tempting to reach for a sophisticated solution right away, but the simple version is usually a better starting point. You learn more from something that runs end-to-end than from something elaborate that does not. Once the simple version is in your hands you will see the real edges of the problem, and the next step becomes much more obvious than it was at the outset.',
];

const CLOSINGS = [
  'Hopefully that gives you something useful to work with — let me know which part you would like to go deeper on.',
  'Happy to keep digging if you want to follow up on any of this.',
  'Let me know if you would like me to expand on any of those points or apply it to a more specific situation.',
  'If any of this is off-target for what you actually had in mind, just push back and I will recalibrate.',
  'Tell me more about the specifics and I can tailor the answer further.',
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const getRandomDelay = (minDelay = 5_000, maxDelay = 20_000) =>
  minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));

const pick = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];

export const generateResponse = async (prompt: string): Promise<string> => {
  await wait(getRandomDelay());

  const intro = pick(INTROS);
  const body = pick(BODIES);
  const closing = pick(CLOSINGS);

  return `${intro}\n\n${body}\n\n${closing}`;
};
