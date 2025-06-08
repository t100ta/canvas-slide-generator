import { createSlideConfig, initializeCanvas, renderImage } from '../src/canvas.js';
import { themes } from '../src/theme.js';
import * as utils from '../src/utils.js';

describe('canvas helpers', () => {
  test('createSlideConfig has default dimensions', () => {
    const cfg = createSlideConfig();
    expect(cfg.width).toBe(1280);
    expect(cfg.height).toBe(720);
    expect(cfg.marginX).toBe((cfg.width - cfg.contentWidth) / 2);
  });

  test('renderImage scales image within bounds', async () => {
    const canvas = document.createElement('canvas');
    const ctx = initializeCanvas(canvas, themes[0]);

    const mockImg = new Image();
    Object.defineProperty(mockImg, 'width', { value: 800 });
    Object.defineProperty(mockImg, 'height', { value: 600 });
    jest.spyOn(utils, 'loadImage').mockResolvedValue(mockImg);

    const result = await renderImage(ctx, 'data:image/png;base64,x', 0, 0, 400, 300);
    expect(result).toEqual({ width: 400, height: 300 });

    (utils.loadImage as jest.Mock).mockRestore();
  });
});
