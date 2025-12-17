/**
 * Build script for generating SEO files (robots.txt and sitemap.xml).
 * 
 * Usage: node build-seo.js
 * 
 * Reads configuration from config/config.json and generates:
 * - robots.txt: Controls search engine crawler access
 * - sitemap.xml: Lists all public pages for search engines
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'config/config.json');
const ROBOTS_PATH = path.join(ROOT_DIR, 'robots.txt');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

function build() {
    try {
        // Read config
        if (!fs.existsSync(CONFIG_PATH)) {
            console.error('Config file not found!');
            process.exit(1);
        }

        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        const baseUrl = config.seo?.baseUrl || 'https://example.com';
        const allowIndexing = config.seo?.searchEngineIndexing ?? false;

        // Get current date for lastmod
        const today = new Date().toISOString().split('T')[0];

        console.log(`Generating SEO files for: ${baseUrl}`);
        console.log(`Search engine indexing: ${allowIndexing ? 'ENABLED' : 'DISABLED'}\n`);

        // Generate robots.txt
        const robotsContent = generateRobotsTxt(baseUrl, allowIndexing);
        fs.writeFileSync(ROBOTS_PATH, robotsContent, 'utf8');
        console.log('✓ Generated: robots.txt');

        // Generate sitemap.xml
        const sitemapContent = generateSitemapXml(baseUrl, today, config);
        fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
        console.log('✓ Generated: sitemap.xml');

        console.log('\nBuild complete!');

    } catch (e) {
        console.error('Error generating SEO files:', e);
        process.exit(1);
    }
}

function generateRobotsTxt(baseUrl, allowIndexing) {
    const lines = [
        '# Robots.txt for ScomodoMenu',
        `# ${baseUrl}`,
        '#',
        `# Search engine indexing: ${allowIndexing ? 'ENABLED' : 'DISABLED'}`,
        '# To change this, edit config/config.json -> seo.searchEngineIndexing',
        '',
        'User-agent: *',
    ];

    if (allowIndexing) {
        lines.push('Allow: /');
        lines.push('');
        lines.push('# Disallow config and build files');
        lines.push('Disallow: /config/');
        lines.push('Disallow: /scripts/');
        lines.push('Disallow: /examples/');
        lines.push('Disallow: /content/');
        lines.push('Disallow: /node_modules/');
    } else {
        lines.push('Disallow: /');
    }

    lines.push('');
    lines.push('# Sitemap location');
    lines.push(`Sitemap: ${baseUrl}/sitemap.xml`);
    lines.push('');

    return lines.join('\n');
}

function generateSitemapXml(baseUrl, lastmod, config) {
    const privacySlug = config.pages?.privacyCookiePolicy?.slug || 'privacy-cookie-policy';
    const allergensSlug = config.pages?.allergens?.slug || 'allergens';

    const pages = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: `/pages/it/${privacySlug}.html`, priority: '0.5', changefreq: 'monthly' },
        { loc: `/pages/en/${privacySlug}.html`, priority: '0.5', changefreq: 'monthly' },
        { loc: `/pages/it/${allergensSlug}.html`, priority: '0.6', changefreq: 'monthly' },
        { loc: `/pages/en/${allergensSlug}.html`, priority: '0.6', changefreq: 'monthly' },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of pages) {
        const fullUrl = baseUrl + page.loc;
        xml += '  <url>\n';
        xml += `    <loc>${fullUrl}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    xml += '</urlset>\n';
    return xml;
}

// Run build
build();
