import { createSlideConfig } from '../src/canvas.js';

describe('canvas helpers', () => {
  test('createSlideConfig has default dimensions', () => {
    const cfg = createSlideConfig();
    expect(cfg.width).toBe(1280);
    expect(cfg.height).toBe(720);
    expect(cfg.marginX).toBe((cfg.width - cfg.contentWidth) / 2);
  });
});
