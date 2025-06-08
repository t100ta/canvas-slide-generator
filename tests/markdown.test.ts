import { parseMarkdownSlides, extractImages, replaceImageWithBase64, insertImageIntoMarkdown, validateMarkdown, countSlides, processImageFile } from '../src/markdown.js';
import * as utils from '../src/utils.js';

const sample = `# Title\n\nText paragraph\n\n![alt](image.png)\n\n---\n\n## Second`;

describe('markdown utilities', () => {
  test('parseMarkdownSlides splits slides', async () => {
    const result = await parseMarkdownSlides(sample);
    expect(result.slides).toHaveLength(2);
    expect(result.slides[0].elements[0]).toMatchObject({ type: 'heading', content: 'Title' });
  });

  test('extractImages finds image URLs', () => {
    const images = extractImages(sample);
    expect(images).toEqual(['image.png']);
  });

  test('replaceImageWithBase64 replaces matching image', () => {
    const updated = replaceImageWithBase64(sample, 'image.png', 'data:img');
    expect(updated).toContain('![alt](data:img)');
  });

  test('insertImageIntoMarkdown appends image', () => {
    const inserted = insertImageIntoMarkdown('# h', 'pic.jpg', 'dataurl');
    expect(inserted.trim().endsWith('![pic](dataurl)')).toBe(true);
  });

  test('validateMarkdown detects empty url', () => {
    const result = validateMarkdown('![]( )');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('countSlides counts separators', () => {
    expect(countSlides(sample)).toBe(2);
  });

  test('processImageFile returns asset data', async () => {
    const file = new File(['a'], 'img.png', { type: 'image/png' });
    jest.spyOn(utils, 'fileToBase64').mockResolvedValue('data:image/png;base64,x');
    const img = new Image();
    Object.defineProperty(img, 'naturalWidth', { value: 10 });
    Object.defineProperty(img, 'naturalHeight', { value: 20 });
    jest.spyOn(utils, 'loadImage').mockResolvedValue(img);

    const asset = await processImageFile(file);
    expect(asset).toEqual({ name: 'img.png', data: 'data:image/png;base64,x', width: 10, height: 20 });

    (utils.fileToBase64 as jest.Mock).mockRestore();
    (utils.loadImage as jest.Mock).mockRestore();
  });
});
