/**
 * Build script for generating static HTML pages from markdown documents.
 * 
 * Usage: node build-pages.js
 * 
 * This script reads markdown files from the content/ folder and generates
 * styled HTML pages in the en/ and it/ folders.
 */

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown;

    // Escape HTML entities first (but preserve markdown syntax)
    // We'll handle this more carefully

    // Convert blockquotes (must be before other replacements)
    html = html.replace(/^>\s*\*\*(.+?)\*\*:\s*(.+)$/gm, '<blockquote><strong>$1:</strong> $2</blockquote>');
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

    // Convert headers (must preserve emoji icons)
    html = html.replace(/^### (\d+)\.\s*(.+)$/gm, '<h3><span class="allergen-number">$1.</span> $2</h3>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Convert bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Convert links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Convert unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Convert horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Convert paragraphs (lines that aren't already HTML)
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (line === '') {
            processedLines.push('');
            continue;
        }

        // Skip lines that are already HTML tags
        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul') ||
            line.startsWith('<li') || line.startsWith('<hr') || line.startsWith('<blockquote')) {
            processedLines.push(lines[i]);
            continue;
        }

        // Wrap regular text in paragraphs
        if (!line.startsWith('<')) {
            processedLines.push(`<p>${line}</p>`);
        } else {
            processedLines.push(lines[i]);
        }
    }

    html = processedLines.join('\n');

    // Clean up multiple consecutive <ul> tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    return html;
}

// HTML template generator
function generatePageHtml(content, title, lang, pageType) {
    const isItalian = lang === 'it';
    const backLabel = isItalian ? 'Torna al Menu' : 'Back to Menu';
    const langLabel = isItalian ? '🇬🇧' : '🇮🇹';
    const otherLang = isItalian ? 'en' : 'it';
    const pageFile = pageType === 'privacy' ? 'privacy.html' : 'allergens.html';

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="${title}">
    <meta name="theme-color" content="#ffffff">
    <title>${title}</title>
    <link rel="stylesheet" href="../colors.css">
    <link rel="stylesheet" href="../styles.css">
    <style>
        /* Page-specific styles */
        .page-container {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: var(--spacing-md);
            padding-top: calc(var(--header-height) + var(--sa-top) + var(--spacing-lg));
            padding-bottom: calc(var(--spacing-xl) * 2);
            min-height: 100vh;
        }
        
        .page-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--md-sys-color-surface-container);
            z-index: 100;
            padding-top: var(--sa-top);
        }
        
        .page-header-content {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 var(--spacing-md);
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: var(--header-height);
        }
        
        .back-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: none;
            border: none;
            color: var(--color-accent);
            font-size: var(--font-size-base);
            font-weight: 600;
            cursor: pointer;
            padding: 8px 0;
            text-decoration: none;
        }
        
        .back-button:hover {
            opacity: 0.8;
        }
        
        .back-arrow {
            font-size: 1.2em;
        }
        
        .lang-switch {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: var(--color-bg);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            text-decoration: none;
        }
        
        .page-content {
            background: var(--color-surface);
            border-radius: var(--border-radius);
            padding: var(--spacing-lg);
        }
        
        .page-content h1 {
            font-size: var(--font-size-xl);
            font-weight: 700;
            color: var(--color-primary);
            margin-bottom: var(--spacing-lg);
            line-height: 1.3;
        }
        
        .page-content h2 {
            font-size: var(--font-size-lg);
            font-weight: 700;
            color: var(--color-primary);
            margin-top: var(--spacing-lg);
            margin-bottom: var(--spacing-sm);
        }
        
        .page-content h3 {
            font-size: var(--font-size-base);
            font-weight: 600;
            color: var(--color-primary);
            margin-top: var(--spacing-md);
            margin-bottom: var(--spacing-xs);
        }
        
        .page-content h3 .allergen-number {
            color: var(--color-accent);
            margin-right: 4px;
        }
        
        .page-content p {
            font-size: var(--font-size-base);
            color: var(--color-secondary);
            line-height: 1.6;
            margin-bottom: var(--spacing-sm);
        }
        
        .page-content ul {
            margin: var(--spacing-sm) 0;
            padding-left: var(--spacing-lg);
        }
        
        .page-content li {
            font-size: var(--font-size-base);
            color: var(--color-secondary);
            line-height: 1.6;
            margin-bottom: var(--spacing-xs);
        }
        
        .page-content a {
            color: var(--color-accent);
            text-decoration: none;
        }
        
        .page-content a:hover {
            text-decoration: underline;
        }
        
        .page-content hr {
            border: none;
            border-top: 1px solid var(--color-separator);
            margin: var(--spacing-lg) 0;
        }
        
        .page-content blockquote {
            background: var(--md-sys-color-tertiary-container);
            color: var(--md-sys-color-on-tertiary-container);
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            margin: var(--spacing-md) 0;
            font-size: var(--font-size-sm);
        }
        
        .page-content blockquote strong {
            color: var(--md-sys-color-on-tertiary-container);
        }
        
        .page-content em {
            font-style: italic;
        }
        
        .footer-cta {
            margin-top: var(--spacing-xl);
            text-align: center;
        }
        
        .cta-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 28px;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            font-size: var(--font-size-base);
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .cta-button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <header class="page-header">
        <div class="page-header-content">
            <a href="../index.html" class="back-button">
                <span class="back-arrow">←</span>
                ${backLabel}
            </a>
            <a href="../${otherLang}/${pageFile}" class="lang-switch" aria-label="Switch language">
                ${langLabel}
            </a>
        </div>
    </header>
    
    <main class="page-container">
        <article class="page-content">
            ${content}
        </article>
        
        <div class="footer-cta">
            <a href="../index.html" class="cta-button">
                <span>←</span>
                ${backLabel}
            </a>
        </div>
    </main>
</body>
</html>`;
}

// Main build function
function build() {
    const contentDir = path.join(__dirname, 'content');
    const enDir = path.join(__dirname, 'en');
    const itDir = path.join(__dirname, 'it');

    // Ensure output directories exist
    if (!fs.existsSync(enDir)) fs.mkdirSync(enDir);
    if (!fs.existsSync(itDir)) fs.mkdirSync(itDir);

    // Page configurations
    const pages = [
        {
            source: 'privacy-policy.it.md',
            output: 'it/privacy.html',
            title: 'Privacy e Cookie Policy',
            lang: 'it',
            type: 'privacy'
        },
        {
            source: 'privacy-policy.en.md',
            output: 'en/privacy.html',
            title: 'Privacy Policy',
            lang: 'en',
            type: 'privacy'
        },
        {
            source: 'allergens.it.md',
            output: 'it/allergens.html',
            title: 'Informazioni sugli Allergeni',
            lang: 'it',
            type: 'allergens'
        },
        {
            source: 'allergens.en.md',
            output: 'en/allergens.html',
            title: 'Allergen Information',
            lang: 'en',
            type: 'allergens'
        }
    ];

    console.log('Building static pages from markdown...\n');

    for (const page of pages) {
        const sourcePath = path.join(contentDir, page.source);
        const outputPath = path.join(__dirname, page.output);

        try {
            // Read markdown
            const markdown = fs.readFileSync(sourcePath, 'utf8');

            // Convert to HTML
            const contentHtml = markdownToHtml(markdown);

            // Generate full page
            const pageHtml = generatePageHtml(contentHtml, page.title, page.lang, page.type);

            // Write output
            fs.writeFileSync(outputPath, pageHtml, 'utf8');

            console.log(`✓ Generated: ${page.output}`);
        } catch (err) {
            console.error(`✗ Error processing ${page.source}:`, err.message);
        }
    }

    console.log('\nBuild complete!');
}

// Run build
build();
