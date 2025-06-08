import { clamp, lerp, random, escapeHtml, fileToBase64, loadImage } from '../src/utils.js';

describe('utils', () => {
  test('clamp limits values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('lerp interpolates', () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  test('random generates number in range', () => {
    for (let i = 0; i < 10; i++) {
      const value = random(1, 2);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThan(2);
    }
  });

  test('escapeHtml escapes special characters', () => {
    const escaped = escapeHtml('<div>Test & "more"</div>');
    expect(escaped).toBe('&lt;div&gt;Test &amp; \"more\"&lt;/div&gt;');
  });

  test('fileToBase64 converts file', async () => {
    const data = new Blob(['hello'], { type: 'text/plain' });
    const file = new File([data], 'hello.txt', { type: 'text/plain' });
    const res = await fileToBase64(file);
    expect(res).toMatch(/^data:text\/plain;base64,/);
  });

  test('loadImage resolves for valid data url', async () => {
    const original = global.Image;
    class MockImage {
      src = '';
      onload: (() => void) | null = null;
      constructor() { setTimeout(() => this.onload && this.onload(), 0); }
      get width() { return 1; }
      get height() { return 1; }
    }
    // @ts-ignore
    global.Image = MockImage as any;
    const img = await loadImage('data:image/png;base64,abc');
    expect(img.width).toBe(1);
    global.Image = original;
  });
});
