import type { RenderContext, TransitionState, TransitionType } from './types.js';

// Functional approach for transitions
export const createTransition = (type: TransitionType, duration: number = 300): TransitionState => ({
  type,
  duration,
  progress: 0,
  isActive: false
});

export const startTransition = (transition: TransitionState): TransitionState => ({
  ...transition,
  isActive: true,
  progress: 0
});

export const updateTransition = (transition: TransitionState, deltaTime: number): TransitionState => {
  if (!transition.isActive) return transition;
  
  const newProgress = Math.min(transition.progress + (deltaTime / transition.duration), 1);
  
  return {
    ...transition,
    progress: newProgress,
    isActive: newProgress < 1
  };
};

export const applyTransition = (
  renderCtx: RenderContext,
  previousCanvas?: HTMLCanvasElement
): void => {
  const { transition, ctx } = renderCtx;
  
  if (!transition.isActive || !previousCanvas) return;
  
  switch (transition.type) {
    case 'fade':
      applyFadeTransition(ctx, previousCanvas, transition.progress);
      break;
    case 'slide':
      applySlideTransition(ctx, previousCanvas, transition.progress);
      break;
    case 'crt-flicker':
      applyCRTFlickerTransition(ctx, previousCanvas, transition.progress);
      break;
    default:
      break;
  }
};

const applyFadeTransition = (
  ctx: CanvasRenderingContext2D,
  previousCanvas: HTMLCanvasElement,
  progress: number
): void => {
  // Draw previous slide with decreasing opacity
  ctx.save();
  ctx.globalAlpha = 1 - progress;
  ctx.drawImage(previousCanvas, 0, 0);
  ctx.restore();
};

const applySlideTransition = (
  ctx: CanvasRenderingContext2D,
  previousCanvas: HTMLCanvasElement,
  progress: number
): void => {
  const { canvas } = ctx;
  const slideOffset = canvas.width * progress;
  
  ctx.save();
  
  // Draw previous slide sliding out to the left
  ctx.drawImage(previousCanvas, -slideOffset, 0);
  
  // Current slide is drawn normally but offset from right
  // This would need to be handled in the main render loop
  
  ctx.restore();
};

const applyCRTFlickerTransition = (
  ctx: CanvasRenderingContext2D,
  previousCanvas: HTMLCanvasElement,
  progress: number
): void => {
  // Create CRT-style flicker effect
  const flickerIntensity = Math.sin(progress * Math.PI * 10) * 0.3;
  const scanlineOffset = Math.floor(progress * 20) % 4;
  
  ctx.save();
  
  // Draw previous slide with flicker
  ctx.globalAlpha = 1 - progress + flickerIntensity;
  ctx.drawImage(previousCanvas, 0, scanlineOffset);
  
  // Add static noise during transition
  if (progress < 0.8) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < 0.1) {
        const noise = (Math.random() - 0.5) * 100;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  ctx.restore();
};

