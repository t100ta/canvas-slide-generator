import { updateAnimation, createAnimationLoop } from '../src/effects.js';
import type { RenderContext } from '../src/types.js';

declare const global: any;

describe('effects utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
    global.cancelAnimationFrame = (id: any) => clearTimeout(id);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('updateAnimation increments time and jitter', () => {
    const ctx = {} as any;
    const renderCtx: RenderContext = {
      canvas: {} as HTMLCanvasElement,
      ctx,
      config: { width: 1, height: 1, contentWidth: 1, contentHeight: 1, marginX: 0, marginY: 0 },
      theme: {} as any,
      effects: { scanlines: false, noise: false, rgbOffset: false, blur: false, jitter: true, level: 'light' },
      animation: { time: 0, noiseOffset: 0, jitterX: 0, jitterY: 0, enabled: true },
      navigation: { currentSlide: 0, totalSlides: 1, canGoNext: false, canGoPrev: false },
      transition: { type: 'none', duration: 0, progress: 0, isActive: false },
      images: new Map(),
    };
    updateAnimation(renderCtx);
    expect(renderCtx.animation.time).toBe(1);
    expect(renderCtx.animation.jitterX).not.toBe(0);
    expect(renderCtx.animation.jitterY).not.toBe(0);
  });

  test('createAnimationLoop toggles rendering', async () => {
    const renderCtx: RenderContext = {
      canvas: {} as HTMLCanvasElement,
      ctx: {} as any,
      config: { width: 1, height: 1, contentWidth: 1, contentHeight: 1, marginX: 0, marginY: 0 },
      theme: {} as any,
      effects: { scanlines: false, noise: false, rgbOffset: false, blur: false, jitter: false, level: 'none' },
      animation: { time: 0, noiseOffset: 0, jitterX: 0, jitterY: 0, enabled: true },
      navigation: { currentSlide: 0, totalSlides: 1, canGoNext: false, canGoPrev: false },
      transition: { type: 'none', duration: 0, progress: 0, isActive: false },
      images: new Map(),
    };

    const renderFn = jest.fn().mockResolvedValue(undefined);
    const toggle = createAnimationLoop(renderCtx, renderFn);

    jest.advanceTimersByTime(10);
    expect(renderFn).toHaveBeenCalled();

    const calls = renderFn.mock.calls.length;
    toggle();
    jest.advanceTimersByTime(10);
    expect(renderFn.mock.calls.length).toBe(calls);

    toggle();
    jest.advanceTimersByTime(10);
    expect(renderFn.mock.calls.length).toBeGreaterThan(calls);
  });
});
