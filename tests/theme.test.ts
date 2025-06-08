import { themes, getThemeByName, createThemeSelector, createEffectLevelSelector, updateThemeStyles } from '../src/theme.js';

describe('theme utilities', () => {
  test('getThemeByName returns selected or default', () => {
    const blue = getThemeByName('Blue CRT');
    expect(blue.name).toBe('Blue CRT');
    const fallback = getThemeByName('missing');
    expect(fallback).toBe(themes[0]);
  });

  test('createThemeSelector populates and triggers change', () => {
    const container = document.createElement('div');
    const handler = jest.fn();
    createThemeSelector(container, themes[0], handler);
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.options.length).toBe(themes.length);
    select.value = themes[1].name;
    select.dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledWith(themes[1]);
  });

  test('createEffectLevelSelector works', () => {
    const container = document.createElement('div');
    const handler = jest.fn();
    createEffectLevelSelector(container, 'none', themes[0], handler);
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.options.length).toBe(4);
    select.value = 'extreme';
    select.dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledWith('extreme');
  });

  test('updateThemeStyles sets css variables', () => {
    updateThemeStyles(themes[0]);
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--primary-color')).toBe(themes[0].primaryColor);
  });
});
