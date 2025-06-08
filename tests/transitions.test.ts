import { createTransition, startTransition, updateTransition } from '../src/transitions.js';

describe('transitions', () => {
  test('startTransition activates transition', () => {
    const t = createTransition('fade', 100);
    const started = startTransition(t);
    expect(started.isActive).toBe(true);
    expect(started.progress).toBe(0);
  });

  test('updateTransition progresses and deactivates', () => {
    let t = startTransition(createTransition('fade', 100));
    t = updateTransition(t, 50);
    expect(t.progress).toBeCloseTo(0.5);
    expect(t.isActive).toBe(true);
    t = updateTransition(t, 50);
    expect(t.progress).toBe(1);
    expect(t.isActive).toBe(false);
  });
});
