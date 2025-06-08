import type { Theme } from './types.js';

export const themes: Theme[] = [
  {
    name: 'Green Phosphor',
    font: 'Courier New, monospace',
    primaryColor: '#00ff00',
    secondaryColor: '#00cc00',
    backgroundColor: '#000000',
    accentColor: '#00ffff',
  },
  {
    name: 'Blue CRT',
    font: 'Courier New, monospace',
    primaryColor: '#00aaff',
    secondaryColor: '#0088cc',
    backgroundColor: '#000011',
    accentColor: '#00ffff',
  },
  {
    name: 'Amber Terminal',
    font: 'Courier New, monospace',
    primaryColor: '#ffaa00',
    secondaryColor: '#cc8800',
    backgroundColor: '#110800',
    accentColor: '#ffff00',
  },
  {
    name: 'Purple Neon',
    font: 'Courier New, monospace',
    primaryColor: '#aa00ff',
    secondaryColor: '#8800cc',
    backgroundColor: '#110011',
    accentColor: '#ff00ff',
  },
  {
    name: 'Pixel Perfect',
    font: '"Courier New", "Lucida Console", monospace',
    primaryColor: '#ffffff',
    secondaryColor: '#cccccc',
    backgroundColor: '#222222',
    accentColor: '#ff6600',
  },
];

export const getThemeByName = (name: string): Theme => {
  return themes.find(theme => theme.name === name) || themes[0];
};

export const createThemeSelector = (
  container: HTMLElement,
  currentTheme: Theme,
  onThemeChange: (theme: Theme) => void
): void => {
  const selector = document.createElement('select');
  selector.className = 'theme-selector';
  selector.style.cssText = `
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid ${currentTheme.primaryColor};
    color: ${currentTheme.primaryColor};
    padding: 5px;
    border-radius: 3px;
    font-family: ${currentTheme.font};
    font-size: 12px;
    margin: 5px;
  `;
  
  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.name;
    option.textContent = theme.name;
    option.selected = theme.name === currentTheme.name;
    selector.appendChild(option);
  });
  
  selector.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const selectedTheme = getThemeByName(target.value);
    onThemeChange(selectedTheme);
  });
  
  container.appendChild(selector);
};

export const createEffectLevelSelector = (
  container: HTMLElement,
  currentLevel: string,
  currentTheme: Theme,
  onLevelChange: (level: 'none' | 'light' | 'heavy' | 'extreme') => void
): void => {
  const selector = document.createElement('select');
  selector.className = 'effect-selector';
  selector.style.cssText = `
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid ${currentTheme.primaryColor};
    color: ${currentTheme.primaryColor};
    padding: 5px;
    border-radius: 3px;
    font-family: ${currentTheme.font};
    font-size: 12px;
    margin: 5px;
  `;
  
  const levels = [
    { value: 'none', label: 'No Effects' },
    { value: 'light', label: 'Light Effects' },
    { value: 'heavy', label: 'Heavy Effects' },
    { value: 'extreme', label: 'Extreme Effects' },
  ];
  
  levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level.value;
    option.textContent = level.label;
    option.selected = level.value === currentLevel;
    selector.appendChild(option);
  });
  
  selector.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    onLevelChange(target.value as 'none' | 'light' | 'heavy' | 'extreme');
  });
  
  container.appendChild(selector);
};

export const updateThemeStyles = (theme: Theme): void => {
  // Update CSS custom properties for theme
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primaryColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor);
  root.style.setProperty('--background-color', theme.backgroundColor);
  root.style.setProperty('--accent-color', theme.accentColor);
  root.style.setProperty('--font-family', theme.font);
};

