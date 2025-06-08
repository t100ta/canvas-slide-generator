import type { RenderContext } from './types.js';
import { random, clamp } from './utils.js';

export const applyScanlines = (renderCtx: RenderContext): void => {
  const { ctx, config, animation, effects } = renderCtx;

  const level = effects.level;
  const heavy = level === 'heavy' || level === 'extreme';
  const extreme = level === 'extreme';

  const baseAlpha = extreme ? 0.35 : heavy ? 0.25 : 0.1;
  const oscillation = extreme ? 0.15 : heavy ? 0.1 : 0.05;
  const lineStep = extreme ? 1 : heavy ? 2 : 3;
  const offsetScale = extreme ? 2 : heavy ? 1.5 : 1;

  // Create scanline effect with composite blending
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = baseAlpha + Math.sin(animation.time * 0.01) * oscillation;
  ctx.fillStyle = '#000000';

  // Draw horizontal scanlines
  for (let y = 0; y < config.height; y += lineStep) {
    const offset = Math.sin(animation.time * 0.02 + y * 0.01) * offsetScale;
    ctx.fillRect(0, y + offset, config.width, 1);
  }
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

export const applyNoise = (renderCtx: RenderContext): void => {
  const { ctx, config, animation, effects } = renderCtx;

  const level = effects.level;
  const heavy = level === 'heavy' || level === 'extreme';
  const extreme = level === 'extreme';
  
  const imageData = ctx.getImageData(0, 0, config.width, config.height);
  const data = imageData.data;
  
  // Add random noise with time-based variation
  const base = extreme ? 0.08 : heavy ? 0.05 : 0.015;
  const swing = extreme ? 0.05 : heavy ? 0.03 : 0.01;
  const noiseIntensity = base + Math.sin(animation.time * 0.005) * swing;
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < noiseIntensity) {
      const noise = random(-15, 15);
      data[i] = clamp(data[i] + noise, 0, 255);     // R
      data[i + 1] = clamp(data[i + 1] + noise, 0, 255); // G
      data[i + 2] = clamp(data[i + 2] + noise, 0, 255); // B
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export const applyRGBOffset = (renderCtx: RenderContext): void => {
  const { ctx, config, animation, effects } = renderCtx;

  const level = effects.level;
  const heavy = level === 'heavy' || level === 'extreme';
  const extreme = level === 'extreme';
  
  // Get the current canvas content
  const imageData = ctx.getImageData(0, 0, config.width, config.height);
  const data = imageData.data;
  
  // Create a copy for manipulation
  const newData = new Uint8ClampedArray(data);
  
  const offsetScaleX = extreme ? 8 : heavy ? 5 : 3;
  const offsetScaleY = extreme ? 6 : heavy ? 3 : 2;
  const offsetX = Math.sin(animation.time * 0.01) * offsetScaleX;
  const offsetY = Math.cos(animation.time * 0.015) * offsetScaleY;
  
  // Apply RGB channel separation
  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
      const index = (y * config.width + x) * 4;
      
      // Red channel offset
      const redX = Math.max(0, Math.min(config.width - 1, x - offsetX));
      const redY = Math.max(0, Math.min(config.height - 1, y - offsetY));
      const redIndex = (Math.floor(redY) * config.width + Math.floor(redX)) * 4;
      
      // Blue channel offset
      const blueX = Math.max(0, Math.min(config.width - 1, x + offsetX));
      const blueY = Math.max(0, Math.min(config.height - 1, y + offsetY));
      const blueIndex = (Math.floor(blueY) * config.width + Math.floor(blueX)) * 4;
      
      // Apply offsets
      newData[index] = data[redIndex];         // R from offset position
      newData[index + 1] = data[index + 1];   // G from original position
      newData[index + 2] = data[blueIndex + 2]; // B from offset position
      newData[index + 3] = data[index + 3];   // A unchanged
    }
  }
  
  // Put the modified data back
  const newImageData = new ImageData(newData, config.width, config.height);
  ctx.putImageData(newImageData, 0, 0);
};

export const applyBlur = (renderCtx: RenderContext): void => {
  const { ctx } = renderCtx;
  
  if (!renderCtx.effects.blur) return;
  
  ctx.filter = 'blur(0.5px)';
  // The blur is applied to subsequent drawing operations
};

export const applyJitter = (renderCtx: RenderContext): void => {
  const { animation, effects } = renderCtx;

  if (!renderCtx.effects.jitter) return;

  // Update jitter values
  const level = effects.level;
  const heavy = level === 'heavy' || level === 'extreme';
  const extreme = level === 'extreme';
  const ampX = extreme ? 1 : heavy ? 0.5 : 0.2;
  const ampY = extreme ? 0.6 : heavy ? 0.3 : 0.1;
  animation.jitterX = Math.sin(animation.time * 0.1) * ampX;
  animation.jitterY = Math.cos(animation.time * 0.13) * ampY;
};

export const updateAnimation = (renderCtx: RenderContext): void => {
  if (!renderCtx.animation.enabled) return;
  
  renderCtx.animation.time += 1;
  renderCtx.animation.noiseOffset = Math.sin(renderCtx.animation.time * 0.01) * 10;
  
  applyJitter(renderCtx);
};

export const applyCRTEffects = (renderCtx: RenderContext): void => {
  // Save the current canvas state
  const { ctx } = renderCtx;
  ctx.save();
  
  // Apply effects based on the current effect level
  const effectLevel = renderCtx.effects.level;
  
  if (effectLevel === 'none') {
    ctx.restore();
    return;
  }
  
  // Apply scanlines for light, heavy and extreme effects
  if (effectLevel === 'light' || effectLevel === 'heavy' || effectLevel === 'extreme') {
    applyScanlines(renderCtx);
  }

  // Apply noise for light, heavy and extreme effects
  if (effectLevel === 'light' || effectLevel === 'heavy' || effectLevel === 'extreme') {
    applyNoise(renderCtx);
  }

  // Apply RGB offset for heavy and extreme effects
  if (effectLevel === 'heavy' || effectLevel === 'extreme') {
    applyRGBOffset(renderCtx);
  }
  
  // Apply vignette effect for all levels except none
  applyVignette(renderCtx);
  
  ctx.restore();
};

export const applyFinalEffects = (renderCtx: RenderContext): void => {
  // Apply RGB offset as the final effect
  applyRGBOffset(renderCtx);
  
  // Add CRT curvature effect (subtle)
  applyCRTCurvature(renderCtx);
  
  // Add vignette effect
  applyVignette(renderCtx);
};

const applyCRTCurvature = (renderCtx: RenderContext): void => {
  const { ctx, config } = renderCtx;
  
  // Create a subtle barrel distortion effect
  const gradient = ctx.createRadialGradient(
    config.width / 2, config.height / 2, 0,
    config.width / 2, config.height / 2, Math.max(config.width, config.height) / 2
  );
  
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);
};

const applyVignette = (renderCtx: RenderContext): void => {
  const { ctx, config } = renderCtx;
  
  // Create vignette effect
  const gradient = ctx.createRadialGradient(
    config.width / 2, config.height / 2, 0,
    config.width / 2, config.height / 2, Math.max(config.width, config.height) / 1.5
  );
  
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);
};

export const createAnimationLoop = (
  renderCtx: RenderContext,
  renderFunction: () => Promise<void>
): () => void => {
  let animationId: number;
  let isRunning = false;
  
  const loop = async (): Promise<void> => {
    if (!isRunning) return;
    
    updateAnimation(renderCtx);
    await renderFunction();
    
    animationId = requestAnimationFrame(loop);
  };
  
  const start = (): void => {
    if (isRunning) return;
    isRunning = true;
    loop();
  };
  
  const stop = (): void => {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
  
  const toggle = (): void => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };
  
  // Auto-start animation
  start();
  
  return toggle;
};

