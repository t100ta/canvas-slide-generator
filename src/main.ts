import type { RenderContext, MarkdownContent, EffectLevel, ExportFormat, TransitionType } from './types.js';
import { initializeCanvas, clearCanvas, renderSlide, renderSlideIndicator } from './canvas.js';
import { parseMarkdownSlides, processImageFile, insertImageIntoMarkdown } from './markdown.js';
import { applyCRTEffects, updateAnimation } from './effects.js';
import { themes, getThemeByName, updateThemeStyles } from './theme.js';
import { exportAsHTML } from './export.js';
import { createTransition, startTransition, updateTransition, applyTransition } from './transitions.js';
import { debounce, cloneCanvas } from './utils.js';

class SlidePresentation {
  private renderCtx: RenderContext;
  private markdownContent: MarkdownContent | null = null;
  private animationId: number | null = null;
  private isFullscreen = false;

  constructor(canvas: HTMLCanvasElement) {
    const defaultTheme = themes[0];
    this.renderCtx = initializeCanvas(canvas, defaultTheme);
    this.renderCtx.transition = createTransition('fade', 300);
    this.setupEventListeners();
    this.loadSampleContent();
  }

  private async loadSampleContent(): Promise<void> {
    try {
      const response = await fetch('/sample.md');
      const content = await response.text();
      await this.loadMarkdown(content);
    } catch (error) {
      console.error('Failed to load sample content:', error);
      // Fallback content
      const fallbackContent = `# Welcome to CRT Slide Generator

## Getting Started
Drop a Markdown file or use the file input to load your presentation.

---

## Features
- Multi-slide support
- Keyboard navigation
- Theme customization
- CRT effects`;
      await this.loadMarkdown(fallbackContent);
    }
  }

  private setupEventListeners(): void {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAnimation();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    });

    // File input
    const fileInput = document.getElementById('markdownFile') as HTMLInputElement;
    fileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.loadMarkdownFile(file);
      }
    });

    const imageInput = document.getElementById('imageFile') as HTMLInputElement;
    imageInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.loadImageFile(file);
      }
    });

    // Real-time markdown editor
    const markdownEditor = document.getElementById('markdownEditor') as HTMLTextAreaElement;
    if (markdownEditor) {
      const handler = debounce((value: string) => {
        this.loadMarkdown(value);
      }, 300);
      markdownEditor.addEventListener('input', (e) => {
        handler((e.target as HTMLTextAreaElement).value);
      });
    }

    // Theme selector
    const themeSelector = document.getElementById('themeSelector') as HTMLSelectElement;
    themeSelector?.addEventListener('change', (e) => {
      const themeName = (e.target as HTMLSelectElement).value;
      this.changeTheme(themeName);
    });

    // Effect selector
    const effectSelector = document.getElementById('effectSelector') as HTMLSelectElement;
    effectSelector?.addEventListener('change', (e) => {
      const level = (e.target as HTMLSelectElement).value as EffectLevel;
      this.changeEffectLevel(level);
    });

    // Transition selector
    const transitionSelector = document.getElementById('transitionSelector') as HTMLSelectElement;
    transitionSelector?.addEventListener('change', (e) => {
      const type = (e.target as HTMLSelectElement).value as TransitionType;
      this.changeTransition(type);
    });

    // Export buttons
    const exportHtmlBtn = document.getElementById('exportHtmlBtn');
    exportHtmlBtn?.addEventListener('click', () => this.exportPresentation('html'));

    // PNG and PDF export removed

    const toggleAnimationBtn = document.getElementById('toggleAnimationBtn');
    toggleAnimationBtn?.addEventListener('click', () => this.toggleAnimation());

    // Drag and drop
    this.setupDragAndDrop();
  }

  private setupDragAndDrop(): void {
    const dropZone = document.getElementById('dropZone');
    
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone?.classList.add('active');
    });

    document.addEventListener('dragleave', (e) => {
      if (!document.contains(e.relatedTarget as Node)) {
        dropZone?.classList.remove('active');
      }
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone?.classList.remove('active');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === 'text/markdown' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          this.loadMarkdownFile(file);
        } else if (file.type.startsWith('image/')) {
          this.loadImageFile(file);
        }
      }
    });
  }

  private async loadMarkdownFile(file: File): Promise<void> {
    try {
      const content = await file.text();
      await this.loadMarkdown(content);
    } catch (error) {
      console.error('Failed to load markdown file:', error);
    }
  }

  private async loadImageFile(file: File): Promise<void> {
    try {
      const asset = await processImageFile(file);
      this.renderCtx.images.set(file.name, asset);
      const markdownEditor = document.getElementById('markdownEditor') as HTMLTextAreaElement | null;
      if (markdownEditor) {
        const updated = insertImageIntoMarkdown(markdownEditor.value, file.name);
        markdownEditor.value = updated;
        await this.loadMarkdown(updated);
      }
    } catch (error) {
      console.error('Failed to load image file:', error);
    }
  }

  private async loadMarkdown(content: string): Promise<void> {
    try {
      this.markdownContent = await parseMarkdownSlides(content, this.renderCtx.images);
      this.renderCtx.navigation.totalSlides = this.markdownContent.slides.length;
      this.renderCtx.navigation.currentSlide = 0;
      this.updateNavigationState();
      this.render();
    } catch (error) {
      console.error('Failed to parse markdown:', error);
    }
  }

  private updateNavigationState(): void {
    const nav = this.renderCtx.navigation;
    nav.canGoPrev = nav.currentSlide > 0;
    nav.canGoNext = nav.currentSlide < nav.totalSlides - 1;
  }

  private previousSlide(): void {
    if (this.renderCtx.navigation.canGoPrev) {
      this.renderCtx.previousCanvas = cloneCanvas(this.renderCtx.canvas);
      this.renderCtx.transition = startTransition(this.renderCtx.transition);
      this.renderCtx.navigation.currentSlide--;
      this.updateNavigationState();
      this.render();
    }
  }

  private nextSlide(): void {
    if (this.renderCtx.navigation.canGoNext) {
      this.renderCtx.previousCanvas = cloneCanvas(this.renderCtx.canvas);
      this.renderCtx.transition = startTransition(this.renderCtx.transition);
      this.renderCtx.navigation.currentSlide++;
      this.updateNavigationState();
      this.render();
    }
  }

  private changeTheme(themeName: string): void {
    const theme = getThemeByName(themeName);
    this.renderCtx.theme = theme;
    updateThemeStyles(theme);
    this.render();
  }

  private changeEffectLevel(level: EffectLevel): void {
    this.renderCtx.effects.level = level;
    
    // Adjust effect settings based on level
    switch (level) {
      case 'none':
        this.renderCtx.effects.scanlines = false;
        this.renderCtx.effects.noise = false;
        this.renderCtx.effects.rgbOffset = false;
        this.renderCtx.effects.jitter = false;
        break;
      case 'light':
        this.renderCtx.effects.scanlines = true;
        this.renderCtx.effects.noise = true;
        this.renderCtx.effects.rgbOffset = false;
        this.renderCtx.effects.jitter = false;
        break;
      case 'heavy':
        this.renderCtx.effects.scanlines = true;
        this.renderCtx.effects.noise = true;
        this.renderCtx.effects.rgbOffset = true;
        this.renderCtx.effects.jitter = true;
        break;
      case 'extreme':
        this.renderCtx.effects.scanlines = true;
        this.renderCtx.effects.noise = true;
        this.renderCtx.effects.rgbOffset = true;
        this.renderCtx.effects.jitter = true;
        break;
    }
    
    this.render();
  }

  private changeTransition(type: TransitionType): void {
    this.renderCtx.transition.type = type;
  }

  private toggleAnimation(): void {
    this.renderCtx.animation.enabled = !this.renderCtx.animation.enabled;
    
    if (this.renderCtx.animation.enabled) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  private toggleFullscreen(): void {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen?.();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen?.();
      this.isFullscreen = false;
    }
  }

  private startAnimation(): void {
    if (this.animationId) return;
    
    const animate = () => {
      if (this.renderCtx.animation.enabled) {
        updateAnimation(this.renderCtx);
        this.renderCtx.transition = updateTransition(this.renderCtx.transition, 16);
        this.render();
        if (!this.renderCtx.transition.isActive) {
          this.renderCtx.previousCanvas = null;
        }
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private async render(): Promise<void> {
    if (!this.markdownContent || this.markdownContent.slides.length === 0) {
      return;
    }

    const currentSlide = this.markdownContent.slides[this.renderCtx.navigation.currentSlide];
    if (!currentSlide) return;

    // Clear canvas
    clearCanvas(this.renderCtx);

    // Render slide content
    await renderSlide(this.renderCtx, currentSlide);

    // Render slide indicator
    if (this.renderCtx.navigation.totalSlides > 1) {
      renderSlideIndicator(this.renderCtx);
    }

    // Apply transition from previous slide
    if (this.renderCtx.transition.isActive && this.renderCtx.previousCanvas) {
      applyTransition(this.renderCtx, this.renderCtx.previousCanvas);
    }

    // Apply CRT effects based on effect level
    if (this.renderCtx.effects.level !== 'none') {
      applyCRTEffects(this.renderCtx);
    }
  }

  private async exportPresentation(format: ExportFormat): Promise<void> {
    if (!this.markdownContent) return;

    try {
      switch (format) {
        case 'html':
          await exportAsHTML(this.renderCtx, this.markdownContent);
          break;
        default:
          console.error('Unsupported export format:', format);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  public getCurrentSlideCount(): number {
    return this.markdownContent?.slides.length || 0;
  }

  public getCurrentSlideIndex(): number {
    return this.renderCtx.navigation.currentSlide;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('slideCanvas') as HTMLCanvasElement;
  if (canvas) {
    const presentation = new SlidePresentation(canvas);
    
    // Start animation by default
    presentation['startAnimation']();
    
    // Make presentation globally accessible for debugging
    (window as any).presentation = presentation;
  }
});

