import type { ImageAsset } from './types.js';
import { debounce } from './utils.js';
import { processImageFile, insertImageIntoMarkdown } from './markdown.js';

export class UIManager {
  private markdownTextarea: HTMLTextAreaElement;
  private markdownFileInput: HTMLInputElement;
  private imageFileInput: HTMLInputElement;
  private markdownDropZone: HTMLElement;
  private imageDropZone: HTMLElement;
  private imageList: HTMLElement;
  private generateBtn: HTMLButtonElement;
  private exportBtn: HTMLButtonElement;
  private previewBtn: HTMLButtonElement;
  
  private images: Map<string, ImageAsset> = new Map();
  private onMarkdownChange: (content: string) => void = () => {};
  private onImagesChange: (images: Map<string, ImageAsset>) => void = () => {};
  private onGenerate: () => void = () => {};
  private onExport: () => void = () => {};
  private onToggleAnimation: () => void = () => {};
  
  constructor() {
    this.markdownTextarea = document.getElementById('markdownText') as HTMLTextAreaElement;
    this.markdownFileInput = document.getElementById('markdownFile') as HTMLInputElement;
    this.imageFileInput = document.getElementById('imageFiles') as HTMLInputElement;
    this.markdownDropZone = document.getElementById('markdownDropZone') as HTMLElement;
    this.imageDropZone = document.getElementById('imageDropZone') as HTMLElement;
    this.imageList = document.getElementById('imageList') as HTMLElement;
    this.generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
    this.exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
    this.previewBtn = document.getElementById('previewBtn') as HTMLButtonElement;
    
    this.initializeEventListeners();
  }
  
  private initializeEventListeners(): void {
    // Markdown textarea change
    const debouncedMarkdownChange = debounce((content: string) => {
      this.onMarkdownChange(content);
    }, 300);
    
    this.markdownTextarea.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement;
      debouncedMarkdownChange(target.value);
    });
    
    // Markdown file input
    this.markdownFileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.loadMarkdownFile(file);
      }
    });
    
    // Image file input
    this.imageFileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        this.loadImageFiles(Array.from(files));
      }
    });
    
    // Markdown drop zone
    this.setupDropZone(this.markdownDropZone, (files) => {
      const markdownFile = files.find(f => f.name.endsWith('.md') || f.name.endsWith('.txt'));
      if (markdownFile) {
        this.loadMarkdownFile(markdownFile);
      }
    });
    
    // Image drop zone
    this.setupDropZone(this.imageDropZone, (files) => {
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        this.loadImageFiles(imageFiles);
      }
    });
    
    // Buttons
    this.generateBtn.addEventListener('click', () => this.onGenerate());
    this.exportBtn.addEventListener('click', () => this.onExport());
    this.previewBtn.addEventListener('click', () => this.onToggleAnimation());
  }
  
  private setupDropZone(element: HTMLElement, onDrop: (files: File[]) => void): void {
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      element.classList.add('dragover');
    });
    
    element.addEventListener('dragleave', () => {
      element.classList.remove('dragover');
    });
    
    element.addEventListener('drop', (e) => {
      e.preventDefault();
      element.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer?.files || []);
      onDrop(files);
    });
    
    element.addEventListener('click', () => {
      if (element === this.markdownDropZone) {
        this.markdownFileInput.click();
      } else if (element === this.imageDropZone) {
        this.imageFileInput.click();
      }
    });
  }
  
  private async loadMarkdownFile(file: File): Promise<void> {
    try {
      const content = await file.text();
      this.markdownTextarea.value = content;
      this.onMarkdownChange(content);
    } catch (error) {
      console.error('Failed to load markdown file:', error);
      alert('Failed to load markdown file');
    }
  }
  
  private async loadImageFiles(files: File[]): Promise<void> {
    try {
      for (const file of files) {
        const imageAsset = await processImageFile(file);
        this.images.set(file.name, imageAsset);
        
        // Auto-insert into markdown if textarea has content
        const currentContent = this.markdownTextarea.value;
        if (currentContent.trim()) {
          const newContent = insertImageIntoMarkdown(currentContent, file.name);
          this.markdownTextarea.value = newContent;
          this.onMarkdownChange(newContent);
        }
      }
      
      this.updateImageList();
      this.onImagesChange(this.images);
    } catch (error) {
      console.error('Failed to load image files:', error);
      alert('Failed to load image files');
    }
  }
  
  private updateImageList(): void {
    this.imageList.innerHTML = '';
    
    this.images.forEach((asset, name) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        margin: 5px 0;
        padding: 5px;
        background: rgba(0, 255, 0, 0.1);
        border-radius: 3px;
        font-size: 12px;
      `;
      
      const img = document.createElement('img');
      img.src = asset.data;
      img.style.cssText = `
        width: 30px;
        height: 30px;
        object-fit: cover;
        margin-right: 10px;
        border: 1px solid #00ff00;
      `;
      
      const info = document.createElement('span');
      info.textContent = `${name} (${asset.width}x${asset.height})`;
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.style.cssText = `
        margin-left: auto;
        background: none;
        border: 1px solid #ff0000;
        color: #ff0000;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
      `;
      
      removeBtn.addEventListener('click', () => {
        this.images.delete(name);
        this.updateImageList();
        this.onImagesChange(this.images);
      });
      
      item.appendChild(img);
      item.appendChild(info);
      item.appendChild(removeBtn);
      this.imageList.appendChild(item);
    });
  }
  
  public setMarkdownChangeHandler(handler: (content: string) => void): void {
    this.onMarkdownChange = handler;
  }
  
  public setImagesChangeHandler(handler: (images: Map<string, ImageAsset>) => void): void {
    this.onImagesChange = handler;
  }
  
  public setGenerateHandler(handler: () => void): void {
    this.onGenerate = handler;
  }
  
  public setExportHandler(handler: () => void): void {
    this.onExport = handler;
  }
  
  public setToggleAnimationHandler(handler: () => void): void {
    this.onToggleAnimation = handler;
  }
  
  public getMarkdownContent(): string {
    return this.markdownTextarea.value;
  }
  
  public getImages(): Map<string, ImageAsset> {
    return this.images;
  }
  
  public setMarkdownContent(content: string): void {
    this.markdownTextarea.value = content;
  }
}

