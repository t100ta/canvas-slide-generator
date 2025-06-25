import type { RenderContext, MarkdownContent } from "./types.js";

export const exportAsHTML = async (
  renderCtx: RenderContext,
  content: MarkdownContent
): Promise<void> => {
  const { theme, effects } = renderCtx;

  // Create standalone HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRT Slide Presentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${theme.font};
            background: ${theme.backgroundColor};
            color: ${theme.primaryColor};
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .presentation-container {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        .slide-canvas {
            border: 2px solid ${theme.primaryColor};
            box-shadow: 0 0 20px ${theme.primaryColor}40;
            background: ${theme.backgroundColor};
            width: 100%;
            height: 100%;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid ${theme.primaryColor};
            border-radius: 5px;
            padding: 10px 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            font-size: 12px;
            color: ${theme.secondaryColor};
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .controls.visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .slide-indicator {
            color: ${theme.accentColor};
            font-weight: bold;
        }
        
        .info-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${theme.primaryColor};
            border-radius: 5px;
            padding: 15px;
            max-width: 300px;
            display: none;
            font-size: 11px;
            line-height: 1.4;
        }
        
        .info-panel.visible {
            display: block;
        }
        
        .info-panel h3 {
            color: ${theme.accentColor};
            margin-bottom: 10px;
        }
        
        .info-panel ul {
            list-style: none;
            padding-left: 0;
        }
        
        .info-panel li {
            margin: 5px 0;
            color: ${theme.primaryColor};
        }
        
        .info-panel kbd {
            background: ${theme.primaryColor}20;
            border: 1px solid ${theme.primaryColor};
            border-radius: 3px;
            padding: 2px 5px;
            font-family: ${theme.font};
            font-size: 10px;
        }
        
        @media (max-width: 768px) {
            .controls {
                bottom: 10px;
                padding: 5px 10px;
                font-size: 10px;
            }
            
            .info-panel {
                top: 10px;
                right: 10px;
                max-width: 250px;
                font-size: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <canvas class="slide-canvas" id="slideCanvas" width="1280" height="720"></canvas>
    </div>
    
    <div class="controls">
        <span>Navigation: ← → (slides)</span>
        <span class="slide-indicator" id="slideIndicator">1 / ${
          content.slides.length
        }</span>
        <span>Press <kbd>I</kbd> for info</span>
    </div>
    
    <div class="info-panel" id="infoPanel">
        <h3>Keyboard Shortcuts</h3>
        <ul>
            <li><kbd>←</kbd> <kbd>→</kbd> Navigate slides</li>
            <li><kbd>Space</kbd> Toggle animation</li>
            <li><kbd>F</kbd> Fullscreen</li>
            <li><kbd>I</kbd> Toggle this panel</li>
            <li><kbd>D</kbd> Download image</li>
            <li><kbd>Esc</kbd> Close panels</li>
        </ul>
        
        <h3>Presentation Info</h3>
        <ul>
            <li>Total slides: ${content.slides.length}</li>
            <li>Theme: ${theme.name}</li>
            <li>Effects: ${effects.level}</li>
        </ul>
    </div>
    
    <script>
        // Embedded slide data
        const slideData = ${JSON.stringify(content)};
        const themeData = ${JSON.stringify(theme)};
        const effectsData = ${JSON.stringify(effects)};
        
        // Application state
        let currentSlide = 0;
        let animationEnabled = true;
        let animationId = null;
        
        // Get canvas and context
        const canvas = document.getElementById('slideCanvas');
        const ctx = canvas.getContext('2d');
        const controlsEl = document.querySelector('.controls');
        let controlsTimeout = null;

        // Preload images referenced in the slides
        const imageCache = new Map();
        slideData.slides.forEach(slide => {
            slide.elements.forEach(el => {
                if (el.type === 'image' && el.src) {
                    const img = new Image();
                    img.src = el.src;
                    imageCache.set(el.src, img);
                }
            });
        });

        function showControls() {
            controlsEl.classList.add('visible');
            if (controlsTimeout) clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                controlsEl.classList.remove('visible');
            }, 2000);
        }

        canvas.addEventListener('mousemove', showControls);
        canvas.addEventListener('touchstart', showControls);
        canvas.addEventListener('mouseleave', () => controlsEl.classList.remove('visible'));
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderCurrentSlide();
            startAnimation();
            showControls();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAnimation();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'i':
                case 'I':
                    e.preventDefault();
                    toggleInfoPanel();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    downloadCurrentSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeAllPanels();
                    break;
            }
        });
        
        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                renderCurrentSlide();
                updateSlideIndicator();
            }
        }
        
        function nextSlide() {
            if (currentSlide < slideData.slides.length - 1) {
                currentSlide++;
                renderCurrentSlide();
                updateSlideIndicator();
            }
        }
        
        function toggleAnimation() {
            animationEnabled = !animationEnabled;
            if (animationEnabled) {
                startAnimation();
            } else {
                stopAnimation();
            }
        }
        
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
        
        function toggleInfoPanel() {
            const panel = document.getElementById('infoPanel');
            panel.classList.toggle('visible');
        }
        
        function closeAllPanels() {
            const panel = document.getElementById('infoPanel');
            panel.classList.remove('visible');
        }
        
        function downloadCurrentSlide() {
            const link = document.createElement('a');
            link.download = \`slide-\${currentSlide + 1}.png\`;
            link.href = canvas.toDataURL();
            link.click();
        }
        
        function updateSlideIndicator() {
            const indicator = document.getElementById('slideIndicator');
            indicator.textContent = \`\${currentSlide + 1} / \${slideData.slides.length}\`;
        }
        
        function startAnimation() {
            if (animationId) return;
            
            let time = 0;
            const animate = () => {
                if (animationEnabled) {
                    time += 0.016; // ~60fps
                    renderCurrentSlide(time);
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            animationId = requestAnimationFrame(animate);
        }
        
        function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        function renderCurrentSlide(time = 0) {
            const slide = slideData.slides[currentSlide];
            if (!slide) return;
            
            // Clear canvas
            ctx.fillStyle = themeData.backgroundColor;
            ctx.fillRect(0, 0, 1280, 720);
            
            // Draw side margins
            const marginColor = themeData.backgroundColor === '#000000' ? '#001100' : 
                               themeData.backgroundColor === '#000011' ? '#001122' :
                               themeData.backgroundColor === '#110800' ? '#221100' :
                               themeData.backgroundColor === '#110011' ? '#220022' : '#333333';
            
            ctx.fillStyle = marginColor;
            ctx.fillRect(0, 0, 160, 720);
            ctx.fillRect(1120, 0, 160, 720);
            
            // Render slide content (simplified)
            let y = 40;
            const leftPadding = 180;
            
            slide.elements.forEach(element => {
                switch (element.type) {
                    case 'heading':
                        const size = element.level === 1 ? 36 : element.level === 2 ? 28 : 24;
                        const color = element.level === 1 ? themeData.accentColor : themeData.primaryColor;
                        
                        ctx.font = \`\${size}px \${themeData.font}\`;
                        ctx.fillStyle = color;
                        ctx.fillText(element.content, leftPadding, y);
                        y += size * 1.5;
                        break;
                        
                    case 'paragraph':
                        ctx.font = \`18px \${themeData.font}\`;
                        ctx.fillStyle = themeData.primaryColor;
                        
                        // Simple word wrapping
                        const words = element.content.split(' ');
                        let line = '';
                        const maxWidth = 900;
                        
                        for (const word of words) {
                            const testLine = line + (line ? ' ' : '') + word;
                            const metrics = ctx.measureText(testLine);
                            
                            if (metrics.width > maxWidth && line) {
                                ctx.fillText(line, leftPadding, y);
                                y += 22;
                                line = word;
                            } else {
                                line = testLine;
                            }
                        }
                        
                        if (line) {
                            ctx.fillText(line, leftPadding, y);
                            y += 22;
                        }
                        
                        y += 15;
                        break;
                        
                    case 'list':
                        if (element.items) {
                            ctx.font = \`16px \${themeData.font}\`;
                            ctx.fillStyle = themeData.primaryColor;

                            element.items.forEach(item => {
                                ctx.fillText(\`• \${item}\`, leftPadding + 20, y);
                                y += 20;
                            });
                        }
                        y += 10;
                        break;

                    case 'image':
                        const img = imageCache.get(element.src);
                        if (img && img.complete) {
                            const scale = Math.min(900 / img.width, 300 / img.height, 1);
                            const w = img.width * scale;
                            const h = img.height * scale;
                            const drawX = leftPadding + (900 - w) / 2;
                            ctx.drawImage(img, drawX, y, w, h);
                            y += h + 20;
                        }
                        break;
                }
                
                if (y > 680) return; // Prevent overflow
            });
            
            // Apply CRT effects if enabled
            if (effectsData.level !== 'none') {
                applyCRTEffects(time);
            }
            
            // Render slide indicator
            if (slideData.slides.length > 1) {
                const indicatorText = \`\${currentSlide + 1} / \${slideData.slides.length}\`;
                ctx.font = \`16px \${themeData.font}\`;
                ctx.fillStyle = themeData.secondaryColor;
                ctx.textAlign = 'center';
                
                const textWidth = ctx.measureText(indicatorText).width;
                ctx.fillStyle = themeData.backgroundColor + 'aa';
                ctx.fillRect(640 - textWidth / 2 - 10, 685, textWidth + 20, 26);
                
                ctx.fillStyle = themeData.secondaryColor;
                ctx.fillText(indicatorText, 640, 690);
                ctx.textAlign = 'left';
            }
        }
        
        function applyCRTEffects(time) {
            const imageData = ctx.getImageData(0, 0, 1280, 720);
            const data = imageData.data;
            
            // Scanlines
            if (effectsData.scanlines) {
                const level = effectsData.level;
                const step = level === 'extreme' ? 1 : level === 'heavy' ? 2 : 3;
                const dim = level === 'extreme' ? 0.6 : level === 'heavy' ? 0.7 : 0.85;
                for (let y = 0; y < 720; y += step) {
                    for (let x = 0; x < 1280; x++) {
                        const index = (y * 1280 + x) * 4;
                        data[index] *= dim;     // R
                        data[index + 1] *= dim; // G
                        data[index + 2] *= dim; // B
                    }
                }
            }
            
            // Noise
            if (effectsData.noise) {
                const level = effectsData.level;
                const intensity = level === 'extreme' ? 0.35 : level === 'heavy' ? 0.25 : level === 'light' ? 0.08 : 0;
                for (let i = 0; i < data.length; i += 4) {
                    const noise = (Math.random() - 0.5) * intensity * 255;
                    data[i] += noise;     // R
                    data[i + 1] += noise; // G
                    data[i + 2] += noise; // B
                }
            }

            let finalImage = imageData;

            // RGB Offset
            if (effectsData.rgbOffset && (effectsData.level === 'heavy' || effectsData.level === 'extreme')) {
                const level = effectsData.level;
                const offsetScaleX = level === 'extreme' ? 8 : 5;
                const offsetScaleY = level === 'extreme' ? 6 : 3;
                const offsetX = Math.sin(time * 0.01) * offsetScaleX;
                const offsetY = Math.cos(time * 0.015) * offsetScaleY;

                const src = imageData.data;
                const out = new Uint8ClampedArray(src);
                
                for (let y = 0; y < 720; y++) {
                    for (let x = 0; x < 1280; x++) {
                        const i = (y * 1280 + x) * 4;
                        const rx = Math.max(0, Math.min(1279, Math.floor(x - offsetX)));
                        const ry = Math.max(0, Math.min(719, Math.floor(y - offsetY)));
                        const rIndex = (ry * 1280 + rx) * 4;

                        const bx = Math.max(0, Math.min(1279, Math.floor(x + offsetX)));
                        const by = Math.max(0, Math.min(719, Math.floor(y + offsetY)));
                        const bIndex = (by * 1280 + bx) * 4;

                        out[i] = src[rIndex];
                        out[i + 1] = src[i + 1];
                        out[i + 2] = src[bIndex + 2];
                        out[i + 3] = src[i + 3];
                    }
                }

                finalImage = new ImageData(out, 1280, 720);
            }

            ctx.putImageData(finalImage, 0, 0);
        }
    </script>
</body>
</html>`;

  // Download the HTML file
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "crt-slide-presentation.html";
  link.click();
  URL.revokeObjectURL(url);
};

