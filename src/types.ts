// Type definitions for the multi-slide application

export type MarkdownContent = {
  raw: string;
  slides: SlideContent[];
};

export type SlideContent = {
  index: number;
  elements: ParsedElement[];
};

export type ParsedElement = {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'code' | 'divider';
  level?: number; // for headings
  content: string;
  items?: string[]; // for lists
  alt?: string; // for images
  src?: string; // for images
};

export type SlideConfig = {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
  marginX: number;
  marginY: number;
};

export type Theme = {
  name: string;
  font: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
};

export type EffectLevel = 'none' | 'light' | 'heavy' | 'extreme';

export type CRTEffects = {
  scanlines: boolean;
  noise: boolean;
  rgbOffset: boolean;
  blur: boolean;
  jitter: boolean;
  level: EffectLevel;
};

export type AnimationState = {
  time: number;
  noiseOffset: number;
  jitterX: number;
  jitterY: number;
  enabled: boolean;
};

export type ImageAsset = {
  name: string;
  data: string; // base64
  width: number;
  height: number;
};

export type NavigationState = {
  currentSlide: number;
  totalSlides: number;
  canGoNext: boolean;
  canGoPrev: boolean;
};

export type RenderContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: SlideConfig;
  theme: Theme;
  effects: CRTEffects;
  animation: AnimationState;
  navigation: NavigationState;
  transition: TransitionState;
  images: Map<string, ImageAsset>;
};
export type TransitionType = 'none' | 'fade' | 'slide' | 'crt-flicker' | 'glitch';

export type TransitionState = {
  type: TransitionType;
  duration: number;
  progress: number;
  isActive: boolean;
};


export type ExportFormat = 'html';

