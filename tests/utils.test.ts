import { clamp, lerp, random, escapeHtml, fileToBase64, loadImage, downloadFile, formatTimestamp } from '../src/utils.js';

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

  test('downloadFile creates and clicks anchor', () => {
    const anchor = document.createElement('a');
    const click = jest.fn();
    anchor.click = click;
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    const urlSpy = jest.fn().mockReturnValue('blob:url');
    const revokeSpy = jest.fn();
    // @ts-ignore
    URL.createObjectURL = urlSpy;
    // @ts-ignore
    URL.revokeObjectURL = revokeSpy;

    downloadFile('hi', 'a.txt', 'text/plain');

    expect(anchor.download).toBe('a.txt');
    expect(anchor.href).toMatch(/^blob:/);
    expect(click).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalledWith(anchor);
    expect(removeSpy).toHaveBeenCalledWith(anchor);

    (document.createElement as jest.Mock).mockRestore();
    appendSpy.mockRestore();
    removeSpy.mockRestore();
    URL.createObjectURL = origCreate;
    URL.revokeObjectURL = origRevoke;
  });

  test('formatTimestamp returns formatted string', () => {
    const ts = formatTimestamp();
    expect(ts).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
  });
});
