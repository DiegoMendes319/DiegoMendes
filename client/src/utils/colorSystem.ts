// Sistema de cores dinâmicas para o site
export const applyDynamicColors = (colors: { [key: string]: string }) => {
  const root = document.documentElement;
  
  // Mapear cores para variáveis CSS
  const colorMappings = {
    'primary_color': '--color-primary',
    'secondary_color': '--color-secondary',
    'accent_color': '--color-accent',
    'background_color': '--color-background',
    'text_color': '--color-text',
    'header_color': '--color-header',
    'footer_color': '--color-footer',
    'button_color': '--color-button',
    'link_color': '--color-link',
    'border_color': '--color-border',
    'success_color': '--color-success',
    'warning_color': '--color-warning',
    'error_color': '--color-error',
    'info_color': '--color-info',
    'card_background': '--color-card-bg',
    'sidebar_color': '--color-sidebar',
    'menu_color': '--color-menu',
    'hover_color': '--color-hover',
    'active_color': '--color-active',
    'disabled_color': '--color-disabled',
  };

  // Aplicar as cores às variáveis CSS
  Object.entries(colorMappings).forEach(([key, cssVar]) => {
    if (colors[key]) {
      root.style.setProperty(cssVar, colors[key]);
      
      // Aplicar também aos aliases do Tailwind
      if (key === 'primary_color') {
        root.style.setProperty('--color-red-600', colors[key]);
        root.style.setProperty('--color-red-500', colors[key]);
      }
      if (key === 'secondary_color') {
        root.style.setProperty('--color-gray-900', colors[key]);
        root.style.setProperty('--color-black', colors[key]);
      }
      if (key === 'accent_color') {
        root.style.setProperty('--color-yellow-400', colors[key]);
        root.style.setProperty('--color-yellow-300', colors[key]);
      }
    }
  });
};

// Função para obter cores do storage
export const loadSiteColors = async () => {
  try {
    const response = await fetch('/api/site-colors');
    if (response.ok) {
      const colors = await response.json();
      applyDynamicColors(colors);
    }
  } catch (error) {
    console.error('Erro ao carregar cores:', error);
  }
};

// Função para converter hex para RGB
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Função para gerar variações de cor
export const generateColorVariations = (baseColor: string) => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return {};
  
  return {
    base: baseColor,
    light: `rgb(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)})`,
    dark: `rgb(${Math.max(0, rgb.r - 50)}, ${Math.max(0, rgb.g - 50)}, ${Math.max(0, rgb.b - 50)})`,
    alpha: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
  };
};