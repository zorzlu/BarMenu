/**
 * Build script for generating static HTML pages from markdown documents.
 * 
 * Usage: node build-pages.js
 * 
 * This script reads markdown files from the content/ folder and generates
 * styled HTML pages in the pages/en/ and pages/it/ folders.
 * 
 * Features:
 * - Template variables replaced with config.json values
 * - SEO meta tags from config
 * - Hreflang tags for multilingual support
 */

const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown;

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

// Replace template placeholders with config values
function replaceTemplateVars(content, config) {
    const replacements = {
        '{{companyName}}': config.legal?.companyName || config.app?.name || 'Company Name',
        '{{address}}': config.legal?.address || config.contact?.address || 'Address',
        '{{email}}': config.legal?.email || config.contact?.email || 'email@example.com',
        '{{phone}}': config.legal?.phone || config.contact?.phone || '',
        '{{vatNumber}}': config.legal?.vatNumber || '',
        '{{lastUpdated}}': config.legal?.lastUpdated || new Date().toISOString().split('T')[0],
    };

    let result = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
}

// HTML template generator
function generatePageHtml(content, pageConfig) {
    const { title, description, lang, slug, baseUrl } = pageConfig;
    const isEnglish = lang === 'en';
    const backLabel = isEnglish ? 'Back to Menu' : 'Torna al Menu';
    const langLabel = isEnglish ? '🇮🇹' : '🇬🇧';
    const otherLang = isEnglish ? 'it' : 'en';
    const pageFile = `${slug}.html`;

    // Generate hreflang URLs
    const itUrl = `${baseUrl}/pages/it/${pageFile}`;
    const enUrl = `${baseUrl}/pages/en/${pageFile}`;
    const canonicalUrl = isEnglish ? enUrl : itUrl;

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#ffffff">
    <title>${title}</title>
    
    <!-- Canonical and Hreflang -->
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="it" href="${itUrl}">
    <link rel="alternate" hreflang="en" href="${enUrl}">
    <link rel="alternate" hreflang="x-default" href="${enUrl}">
    
    <link rel="stylesheet" href="../../assets/css/colors.css">
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link rel="stylesheet" href="../../assets/css/pages.css">
</head>
<body>
    <header class="page-header">
        <div class="page-header-content">
            <a href="../../index.html" class="back-button">
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
            <a href="../../index.html" class="cta-button">
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
    const rootDir = path.join(__dirname, '..');
    const contentDir = path.join(rootDir, 'content');
    const configPath = path.join(rootDir, 'config/config.json');
    const pagesDir = path.join(rootDir, 'pages');
    const enDir = path.join(pagesDir, 'en');
    const itDir = path.join(pagesDir, 'it');

    // Load config
    let config = {};
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('Loaded config from config/config.json');
    } catch (e) {
        console.warn('Could not load config.json, using defaults');
    }

    const baseUrl = config.seo?.baseUrl || 'https://example.com';

    // Ensure output directories exist
    if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir);
    if (!fs.existsSync(enDir)) fs.mkdirSync(enDir);
    if (!fs.existsSync(itDir)) fs.mkdirSync(itDir);

    // Page configurations from config.json
    const privacySlug = config.pages?.privacyCookiePolicy?.slug || 'privacy-cookie-policy';
    const allergensSlug = config.pages?.allergens?.slug || 'allergens';

    const pages = [
        {
            source: 'privacy-policy.it.md',
            output: `pages/it/${privacySlug}.html`,
            title: config.pages?.privacyCookiePolicy?.title?.it || 'Privacy e Cookie Policy',
            description: config.pages?.privacyCookiePolicy?.description?.it || 'Informativa sulla privacy',
            lang: 'it',
            slug: privacySlug
        },
        {
            source: 'privacy-policy.en.md',
            output: `pages/en/${privacySlug}.html`,
            title: config.pages?.privacyCookiePolicy?.title?.en || 'Privacy and Cookie Policy',
            description: config.pages?.privacyCookiePolicy?.description?.en || 'Privacy policy',
            lang: 'en',
            slug: privacySlug
        },
        {
            source: 'allergens.it.md',
            output: `pages/it/${allergensSlug}.html`,
            title: config.pages?.allergens?.title?.it || 'Informazioni sugli Allergeni',
            description: config.pages?.allergens?.description?.it || 'Lista allergeni',
            lang: 'it',
            slug: allergensSlug
        },
        {
            source: 'allergens.en.md',
            output: `pages/en/${allergensSlug}.html`,
            title: config.pages?.allergens?.title?.en || 'Allergen Information',
            description: config.pages?.allergens?.description?.en || 'Allergen list',
            lang: 'en',
            slug: allergensSlug
        }
    ];

    console.log('Building static pages from markdown...\n');

    for (const page of pages) {
        const sourcePath = path.join(contentDir, page.source);
        const outputPath = path.join(rootDir, page.output);

        try {
            // Read markdown
            let markdown = fs.readFileSync(sourcePath, 'utf8');

            // Replace template variables with config values
            markdown = replaceTemplateVars(markdown, config);

            // Convert to HTML
            const contentHtml = markdownToHtml(markdown);

            // Generate full page with SEO meta
            const pageConfig = {
                title: page.title,
                description: page.description,
                lang: page.lang,
                slug: page.slug,
                baseUrl: baseUrl
            };
            const pageHtml = generatePageHtml(contentHtml, pageConfig);

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
