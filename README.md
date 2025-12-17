# Il Tuo Bar - Digital Menu

A modern, fast, and easy-to-update digital menu for bars and restaurants. Powered by a single Google Sheet and configurable via JSON.

## Features

- 📱 **Mobile-first**: Responsive design optimized for smartphones.
- 🌐 **Multilanguage**: Native Italian/English support with instant switch.
- 🔄 **Unified Data**: Manage Kitchen, Bar, Opening Hours, and Content from a single Google Sheet.
- ⚠️ **Allergens & Diets**: Filters for Vegetarian/Vegan and multiple allergen exclusions.
- ⚙️ **Configurable**: Easy customization via `config.json`.
- 🚀 **Zero Backend**: Works as a static site (HTML/CSS/JS), perfect for GitHub Pages.

---

## Quick Setup

### 1. The Google Sheet (Unified CSV)

The system uses a **single spreadsheet** divided into horizontal sections.

1.  **Download the Template**: Download the [`fallback_data.csv`](fallback_data.csv) file from this repository.
2.  **Upload to Google Drive**: Upload the file to your Google Drive and open it with **Google Sheets**.
3.  **Edit Data**: Update the rows with your menu items.
    *   **Row 1 (Markers)**: Defines the sections (`bar`, `kitchen`, `timeslots`, `content`, `categories`). **Do not modify this row.**
    *   **Row 2 (Headers)**: Column names for each section.
    *   **Row 3+ (Data)**: Your actual content.
4.  **Publish as CSV**:
    *   Go to *File > Share > Publish to web*.
    *   Select the specific sheet (tab) you are working on.
    *   Choose **Comma-separated values (.csv)** as the format.
    *   Click **Publish** and copy the generated URL.

### 2. Site Configuration (`config/config.json`)

Open the `config/config.json` file and update the main fields:

```json
{
    "app": {
        "name": "Your Bar Name",
        "logoUrl": "logo.png",
        "csvLanguage": "en" // 'it' or 'en' depending on your CSV language
    },
    "urls": {
        "menu": "PASTE_YOUR_GOOGLE_SHEETS_CSV_URL_HERE"
    },
    "contact": {
        "address": "Your Address",
        "phone": "+39 ...",
        "socials": [...]
    }
}
```

> 💡 **Note**: If `urls.menu` is empty or invalid, the site will automatically use the local `config/fallback_data.csv` file.

---

## Unified CSV Structure

The sheet is divided into column groups. Each section must maintain the column order as shown in the template.

#### Main Sections
1.  **Bar** (`bar`): Drinks, coffee, cocktails.
2.  **Kitchen** (`kitchen`): Food items (First courses, Main courses, etc.).
3.  **Categories** (`categories`): Defines the order and labels of the categories shown (e.g., "Starters", "Beers").

#### Data Columns (Bar/Kitchen)
*   `categoria`: Must match an ID in the Categories section.
*   `nome_it` / `nome_en`: Item name.
*   `descrizione_it` / `descrizione_en`: Detailed description.
*   `prezzo`: Price (e.g., `10.00`).
*   `tipo`: `standard`, `vegetariano`, `vegano` (or `vegan`).
*   `attivo`: `TRUE` to show, `FALSE` to hide.
*   `all_1_glutine`...: `TRUE` if the allergen is present.

#### Time Slots Section (`timeslots`)
Defines the time slots shown on the home page (e.g., "Open now", "Lunch in 2h") and info page.
*   `slot_id`: Unique ID (e.g., `lunch`, `dinner`).
*   `giorno`: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`.
*   `apertura` / `chiusura`: Times (e.g., `12:00`, `15:00`).

#### Content Section (`content`)
Add custom text or banners to the Info page and Menu tabs.
*   `type`: `text`, `cta` (button), `menu_header_kitchen`, `menu_header_bar`.

---

## Advanced Customization

### Icons & Colors
*   Edit `assets/css/colors.css` to change the color palette (based on Material 3 CSS variables).
*   Allergen and diet icons are configurable in `config/config.json` under `allergens` and `foodTypes`.

### Translations
Fixed UI strings (e.g., "Filters", "Close") are located in `config/translations.json`.

### SEO
The site includes `robots.txt` and `sitemap.xml` for search engine optimization, generated from `config/config.json`:

```json
"seo": {
    "baseUrl": "https://your-domain.github.io/ScomodoMenu",
    "searchEngineIndexing": false  // set to true to allow crawlers
}
```

Run `npm run build-seo` to regenerate these files after changing the config.

---

## Local Installation

No build tools (Node, NPM, etc.) are required. It is a pure static site.

1.  Clone the repository.
2.  Open `index.html` in your browser or use a local server (e.g., VS Code Live Server).

## Deployment

To go online, simply upload the files to any static hosting service:
*   **GitHub Pages** (Recommended): Upload files to a repo and enable Pages in Settings.
*   Netlify / Vercel: Drag and drop the project folder.
