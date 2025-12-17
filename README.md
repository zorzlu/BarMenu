# ScomodoMenu

A modern, mobile-first digital menu application for bars and restaurants. Powered by Google Sheets for easy content management.

![Home Page](#)
*Placeholder: Screenshot of the home page*

---

## Quick Start

1. **Copy the Template**: [Open the Google Sheets template](YOUR_GOOGLE_SHEETS_TEMPLATE_LINK_HERE) and make a copy to your Google Drive

2. **Edit Your Menu**: Update the spreadsheet with your menu items, opening hours, and content

3. **Publish as CSV**: In Google Sheets, go to File > Share > Publish to web, select CSV format, and copy the URL

4. **Configure**: Paste the CSV URL into `config/config.json`:
   ```json
   {
     "inputData": {
       "menuUrl": "YOUR_GOOGLE_SHEETS_CSV_URL_HERE"
     }
   }
   ```

5. **Deploy**: Upload to GitHub Pages, Netlify, or any static hosting service

**Detailed Instructions**: See [Google Sheets Setup Guide](docs/GOOGLE_SHEETS_SETUP.md)

---

## Key Features

### Mobile-First Design
Responsive interface optimized for smartphones with Material Design 3 aesthetics.

![Mobile Interface](#)
*Placeholder: Mobile device screenshots*

### Multilanguage Support
Native Italian and English support with instant language switching.

### Easy Content Management
Update your menu through Google Sheets - no coding or deployment required.

### Allergen Tracking
Complete support for all 14 EU-regulated allergens with filtering capabilities.

![Filter Interface](#)
*Placeholder: Allergen filter screenshot*

### Diet Filters
Filter menu items by Vegetarian and Vegan preferences.

### Kitchen Status Display
Real-time kitchen availability based on configured time slots.

![Kitchen Status](#)
*Placeholder: Kitchen status cards*

### Zero Backend
Pure static site - works on any hosting service with no server required.

---

## Documentation

- [Google Sheets Setup](docs/GOOGLE_SHEETS_SETUP.md) - Complete guide to setting up your data source
- [Data Structure Reference](docs/DATA_STRUCTURE.md) - CSV table structure and column specifications
- [Configuration Guide](docs/CONFIGURATION.md) - Complete `config.json` reference
- [Customization Guide](docs/CUSTOMIZATION.md) - Theming, styling, and advanced customization

---

## Installation

### Prerequisites
- Node.js (for build scripts only)
- Google account (for Google Sheets)

### Local Development

```bash
# Clone the repository
git clone https://github.com/zorzlu/ScomodoMenu.git
cd ScomodoMenu

# Install dependencies
npm install

# Run local server
npx serve -l 3456

# Open browser to http://localhost:3456
```

### Build Commands

```bash
npm run generate-theme  # Generate color theme
npm run build-pages     # Build static pages
npm run build-index     # Build index.html
npm run build-seo       # Generate sitemap and robots.txt
npm run build           # Run all build scripts
```

---

## Deployment

### GitHub Pages

1. Push to GitHub
2. Settings > Pages > Select branch > Save
3. Access at `https://username.github.io/ScomodoMenu`

### Netlify / Vercel

Drag and drop the project folder or connect your GitHub repository.

---

## Screenshots

![Menu View](#)
*Placeholder: Menu categories and items*

![Item Details](#)
*Placeholder: Menu item with allergen information*

![Info Page](#)
*Placeholder: Info page with opening hours and contact*

---

## Technology Stack

- HTML5 / CSS3 / JavaScript (ES6+)
- Material Design 3 color system
- Google Sheets API (CSV export)
- No frameworks or build tools required for runtime

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## License

This project is licensed under the Apache License 2.0.  
See [LICENSE](LICENSE) file for details.

---

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/zorzlu/ScomodoMenu/issues)
- Template: [Google Sheets Template](YOUR_GOOGLE_SHEETS_TEMPLATE_LINK_HERE)

---

**Built with modern web technologies and Material Design 3 principles.**
