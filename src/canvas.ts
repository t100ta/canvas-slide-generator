import type { RenderContext, SlideConfig, SlideContent, Theme } from './types.js';
import { loadImage } from './utils.js';

export const createSlideConfig = (): SlideConfig => ({
  width: 1280,
  height: 720,
  contentWidth: 960,
  contentHeight: 720,
  marginX: 160, // (1280 - 960) / 2
  marginY: 0,
});

export const initializeCanvas = (canvas: HTMLCanvasElement, theme: Theme): RenderContext => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }
  
  const config = createSlideConfig();
  
  // Set canvas size
  canvas.width = config.width;
  canvas.height = config.height;
  
  // Configure context for crisp rendering
  ctx.imageSmoothingEnabled = false;
  ctx.textBaseline = 'top';
  
  return {
    canvas,
    ctx,
    config,
    theme,
    effects: {
      scanlines: true,
      noise: true,
      rgbOffset: true,
      blur: false,
      jitter: true,
      level: 'light',
    },
    animation: {
      time: 0,
      noiseOffset: 0,
      jitterX: 0,
      jitterY: 0,
      enabled: true,
    },
    navigation: {
      currentSlide: 0,
      totalSlides: 0,
      canGoNext: false,
      canGoPrev: false,
    },
    transition: {
      type: 'fade',
      duration: 300,
      progress: 0,
      isActive: false
    },
    previousCanvas: null,
    images: new Map(),
  };
};

export const clearCanvas = (renderCtx: RenderContext): void => {
  const { ctx, config, theme } = renderCtx;
  
  // Clear entire canvas
  ctx.fillStyle = theme.backgroundColor;
  ctx.fillRect(0, 0, config.width, config.height);
  
  // Draw side margins with retro pattern
  const marginColor = theme.backgroundColor === '#000000' ? '#001100' : 
                     theme.backgroundColor === '#000011' ? '#001122' :
                     theme.backgroundColor === '#110800' ? '#221100' :
                     theme.backgroundColor === '#110011' ? '#220022' : '#333333';
  
  ctx.fillStyle = marginColor;
  ctx.fillRect(0, 0, config.marginX, config.height);
  ctx.fillRect(config.width - config.marginX, 0, config.marginX, config.height);
  
  // Add vertical lines to margins
  ctx.strokeStyle = theme.secondaryColor;
  ctx.lineWidth = 1;
  for (let i = 0; i < config.marginX; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, config.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(config.width - config.marginX + i, 0);
    ctx.lineTo(config.width - config.marginX + i, config.height);
    ctx.stroke();
  }
};

export const renderText = (
  renderCtx: RenderContext,
  text: string,
  x: number,
  y: number,
  fontSize: number = 24,
  color?: string
): { width: number; height: number } => {
  const { ctx, theme } = renderCtx;
  const textColor = color || theme.primaryColor;
  
  ctx.font = `${fontSize}px ${theme.font}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  
  // Add text shadow for CRT effect
  ctx.shadowColor = textColor;
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  // Split text into lines if it's too long
  const maxWidth = renderCtx.config.contentWidth - 40; // padding
  const lines = wrapText(ctx, text, maxWidth);
  
  let currentY = y;
  lines.forEach(line => {
    ctx.fillText(line, x, currentY);
    currentY += fontSize * 1.2;
  });
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
  const textHeight = lines.length * fontSize * 1.2;
  
  return { width: textWidth, height: textHeight };
};

export const renderImage = async (
  renderCtx: RenderContext,
  imageData: string,
  x: number,
  y: number,
  maxWidth: number = 400,
  maxHeight: number = 300
): Promise<{ width: number; height: number }> => {
  const { ctx, theme } = renderCtx;
  
  try {
    const img = await loadImage(imageData);
    
    // Calculate scaled dimensions
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const drawX = x + (maxWidth - scaledWidth) / 2;
    
    // Add border effect
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX - 2, y - 2, scaledWidth + 4, scaledHeight + 4);
    
    // Draw image
    ctx.drawImage(img, drawX, y, scaledWidth, scaledHeight);
    
    // Add scanline effect over image
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = theme.backgroundColor;
    for (let i = 0; i < scaledHeight; i += 4) {
      ctx.fillRect(drawX, y + i, scaledWidth, 2);
    }
    ctx.globalAlpha = 1;
    
    return { width: scaledWidth, height: scaledHeight };
  } catch (error) {
    console.error('Failed to render image:', error);
    
    // Render placeholder
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, maxWidth, maxHeight);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = `16px ${theme.font}`;
    ctx.fillText('Image Load Error', x + 10, y + 20);
    
    return { width: maxWidth, height: maxHeight };
  }
};

export const renderSlide = async (
  renderCtx: RenderContext,
  slide: SlideContent
): Promise<void> => {
  const { config, theme } = renderCtx;
  
  let currentY = 40; // Start with top padding
  const leftPadding = config.marginX + 20;
  const maxContentWidth = config.contentWidth - 40;
  
  for (const element of slide.elements) {
    switch (element.type) {
      case 'heading':
        const headingSize = element.level === 1 ? 36 : element.level === 2 ? 28 : 24;
        const headingColor = element.level === 1 ? theme.accentColor : theme.primaryColor;
        
        const headingResult = renderText(
          renderCtx,
          element.content,
          leftPadding,
          currentY,
          headingSize,
          headingColor
        );
        
        currentY += headingResult.height + 20;
        break;
        
      case 'paragraph':
        const paragraphResult = renderText(
          renderCtx,
          element.content,
          leftPadding,
          currentY,
          18,
          theme.primaryColor
        );
        
        currentY += paragraphResult.height + 15;
        break;
        
      case 'list':
        if (element.items) {
          for (const item of element.items) {
            const bulletResult = renderText(
              renderCtx,
              `• ${item}`,
              leftPadding + 20,
              currentY,
              16,
              theme.primaryColor
            );
            currentY += bulletResult.height + 8;
          }
        }
        currentY += 10;
        break;
        
      case 'image':
        if (element.src) {
          const remaining = config.height - currentY - 40;
          const maxHeight = Math.min(remaining, 300);
          const imageResult = await renderImage(
            renderCtx,
            element.src,
            leftPadding,
            currentY,
            maxContentWidth,
            maxHeight
          );
          currentY += imageResult.height + 20;
        }
        break;
        
      case 'code':
        // Render code block with background
        const codeLines = element.content.split('\n');
        const codeHeight = codeLines.length * 20 + 20;
        
        renderCtx.ctx.fillStyle = `${theme.primaryColor}20`; // 20% opacity
        renderCtx.ctx.fillRect(leftPadding, currentY, maxContentWidth, codeHeight);
        
        renderCtx.ctx.strokeStyle = theme.primaryColor;
        renderCtx.ctx.lineWidth = 1;
        renderCtx.ctx.strokeRect(leftPadding, currentY, maxContentWidth, codeHeight);
        
        let codeY = currentY + 10;
        for (const line of codeLines) {
          renderText(renderCtx, line, leftPadding + 10, codeY, 14, theme.accentColor);
          codeY += 20;
        }
        
        currentY += codeHeight + 15;
        break;
        
      case 'divider':
        // Render horizontal line
        renderCtx.ctx.strokeStyle = theme.primaryColor;
        renderCtx.ctx.lineWidth = 2;
        renderCtx.ctx.beginPath();
        renderCtx.ctx.moveTo(leftPadding, currentY + 10);
        renderCtx.ctx.lineTo(leftPadding + maxContentWidth, currentY + 10);
        renderCtx.ctx.stroke();
        
        currentY += 30;
        break;
    }
    
    // Prevent overflow
    if (currentY > config.height - 40) {
      break;
    }
  }
};

export const renderSlideIndicator = (renderCtx: RenderContext): void => {
  const { ctx, config, theme, navigation } = renderCtx;
  
  const indicatorText = `${navigation.currentSlide + 1} / ${navigation.totalSlides}`;
  const fontSize = 16;
  
  ctx.font = `${fontSize}px ${theme.font}`;
  ctx.fillStyle = theme.secondaryColor;
  ctx.textAlign = 'center';
  
  const x = config.width / 2;
  const y = config.height - 30;
  
  // Background
  const textWidth = ctx.measureText(indicatorText).width;
  ctx.fillStyle = `${theme.backgroundColor}aa`;
  ctx.fillRect(x - textWidth / 2 - 10, y - 5, textWidth + 20, fontSize + 10);
  
  // Text
  ctx.fillStyle = theme.secondaryColor;
  ctx.fillText(indicatorText, x, y);
  
  ctx.textAlign = 'left'; // Reset
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

