import { marked } from 'marked';
import type { MarkdownContent, SlideContent, ParsedElement, ImageAsset } from './types.js';
import { fileToBase64, loadImage } from './utils.js';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

export const parseMarkdownSlides = async (content: string): Promise<MarkdownContent> => {
  // Split content by slide separators (---)
  const slideTexts = content.split(/^---\s*$/m).map(text => text.trim()).filter(text => text.length > 0);
  
  const slides: SlideContent[] = [];
  
  for (let i = 0; i < slideTexts.length; i++) {
    const slideText = slideTexts[i];
    const elements = await parseSlideContent(slideText);
    
    slides.push({
      index: i,
      elements,
    });
  }
  
  return {
    raw: content,
    slides,
  };
};

const parseSlideContent = async (content: string): Promise<ParsedElement[]> => {
  const tokens = marked.lexer(content);
  const parsed: ParsedElement[] = [];
  
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        parsed.push({
          type: 'heading',
          level: token.depth,
          content: token.text,
        });
        break;
        
      case 'paragraph':
        // Check for images in paragraph
        const imageMatches = token.text.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
        if (imageMatches) {
          // Split paragraph by images
          const parts = token.text.split(/!\[([^\]]*)\]\(([^)]+)\)/);
          
          for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0 && parts[i].trim()) {
              // Text part
              parsed.push({
                type: 'paragraph',
                content: parts[i].trim(),
              });
            } else if (i % 3 === 2) {
              // Image part
              const alt = parts[i - 1] || '';
              const src = parts[i];
              parsed.push({
                type: 'image',
                content: '',
                alt,
                src,
              });
            }
          }
        } else {
          parsed.push({
            type: 'paragraph',
            content: token.text,
          });
        }
        break;
        
      case 'list':
        const items = token.items.map((item: any) => 
          typeof item.text === 'string' ? item.text : item.text || ''
        );
        parsed.push({
          type: 'list',
          content: '',
          items,
        });
        break;
        
      case 'code':
        parsed.push({
          type: 'code',
          content: token.text,
        });
        break;
        
      case 'hr':
        parsed.push({
          type: 'divider',
          content: '---',
        });
        break;
        
      default:
        // Handle other token types as paragraphs
        if ('text' in token && typeof token.text === 'string') {
          parsed.push({
            type: 'paragraph',
            content: token.text,
          });
        }
        break;
    }
  }
  
  return parsed;
};

export const extractImages = (content: string): string[] => {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[2]); // URL/path
  }
  
  return images;
};

export const replaceImageWithBase64 = (
  content: string,
  imageName: string,
  base64Data: string
): string => {
  const escaped = imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const imageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(([^)]*${escaped}[^)]*)\\)`, 'g');
  return content.replace(imageRegex, `![$1](${base64Data})`);
};

export const processImageFile = async (file: File): Promise<ImageAsset> => {
  const base64Data = await fileToBase64(file);
  const img = await loadImage(base64Data);
  
  return {
    name: file.name,
    data: base64Data,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
};

export const insertImageIntoMarkdown = (content: string, imageName: string, base64Data: string): string => {
  const cleanName = imageName.replace(/\.[^/.]+$/, ''); // Remove extension
  const imageMarkdown = `![${cleanName}](${base64Data})`;
  
  // Insert at the end of the content
  return content.trim() + '\n\n' + imageMarkdown;
};

export const validateMarkdown = (content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!content.trim()) {
    errors.push('Markdown content is empty');
  }
  
  // Check for malformed image syntax
  const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const url = match[2];
    if (!url.trim()) {
      errors.push(`Empty image URL found: ${match[0]}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const countSlides = (content: string): number => {
  if (!content.trim()) return 0;
  const slides = content.split(/^---\s*$/m).filter(text => text.trim().length > 0);
  return slides.length;
};

