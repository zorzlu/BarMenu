// ========================================
// Configuration
// ========================================

const CONFIG = {
    cuisine: {
        url: "PASTE_CUISINE_CSV_URL_HERE",
        name: "Cucina"
    },
    bar: {
        url: "PASTE_BAR_CSV_URL_HERE",
        name: "Bar"
    },
    info: {
        url: "PASTE_INFO_CSV_URL_HERE",
        name: "Info"
    }
};

// ========================================
// Translations
// ========================================

const TRANSLATIONS = {
    it: {
        filters: "Filtri",
        dietPreferences: "Preferenze Alimentari",
        dietAll: "Tutti",
        dietVegetarian: "Vegetariano",
        dietVegan: "Vegano",
        excludeAllergens: "Escludi Allergeni",
        excludeAllergensDesc: "I piatti con questi allergeni verranno nascosti.",
        apply: "Applica",
        clearAll: "Cancella tutto",
        close: "Chiudi",
        loading: "Caricamento menu...",
        empty: "Nessun piatto corrisponde ai filtri.",
        errorMessage: "Menu non disponibile.",
        retry: "Riprova",
        updated: "Menu aggiornato",
        allergenDisclaimer: "Chiedi al personale per ulteriori dettagli sugli allergeni.",
        navCuisine: "Cucina",
        navBar: "Bar",
        navInfo: "Info",
        switchLang: "Passa a Inglese",
        allergensExcluded: "allergeni esclusi",
        allergens: {
            glutine: "Glutine",
            crostacei: "Crostacei",
            uova: "Uova",
            pesce: "Pesce",
            arachidi: "Arachidi",
            soia: "Soia",
            latte: "Latte",
            frutta_a_guscio: "Frutta a guscio",
            sedano: "Sedano",
            senape: "Senape",
            sesamo: "Sesamo",
            solfiti: "Solfiti",
            lupini: "Lupini",
            molluschi: "Molluschi"
        }
    },
    en: {
        filters: "Filters",
        dietPreferences: "Dietary Preferences",
        dietAll: "All",
        dietVegetarian: "Vegetarian",
        dietVegan: "Vegan",
        excludeAllergens: "Exclude Allergens",
        excludeAllergensDesc: "Dishes with these allergens will be hidden.",
        apply: "Apply",
        clearAll: "Clear all",
        close: "Close",
        loading: "Loading menu...",
        empty: "No dishes match your filters.",
        errorMessage: "Menu unavailable.",
        retry: "Retry",
        updated: "Menu updated",
        allergenDisclaimer: "Ask staff for allergen details.",
        navCuisine: "Kitchen",
        navBar: "Bar",
        navInfo: "Info",
        switchLang: "Switch to Italian",
        allergensExcluded: "allergens excluded",
        allergens: {
            glutine: "Gluten",
            crostacei: "Shellfish",
            uova: "Eggs",
            pesce: "Fish",
            arachidi: "Peanuts",
            soia: "Soy",
            latte: "Milk",
            frutta_a_guscio: "Tree nuts",
            sedano: "Celery",
            senape: "Mustard",
            sesamo: "Sesame",
            solfiti: "Sulphites",
            lupini: "Lupin",
            molluschi: "Molluscs"
        }
    }
};

const ALLERGENS = {
    'all_1_glutine': { number: 1, key: 'glutine', icon: '🌾' },
    'all_2_crostacei': { number: 2, key: 'crostacei', icon: '🦐' },
    'all_3_uova': { number: 3, key: 'uova', icon: '🥚' },
    'all_4_pesce': { number: 4, key: 'pesce', icon: '🐟' },
    'all_5_arachidi': { number: 5, key: 'arachidi', icon: '🥜' },
    'all_6_soia': { number: 6, key: 'soia', icon: '🫘' },
    'all_7_latte': { number: 7, key: 'latte', icon: '🥛' },
    'all_8_frutta_a_guscio': { number: 8, key: 'frutta_a_guscio', icon: '🌰' },
    'all_9_sedano': { number: 9, key: 'sedano', icon: '🥬' },
    'all_10_senape': { number: 10, key: 'senape', icon: '🟡' },
    'all_11_sesamo': { number: 11, key: 'sesamo', icon: '🫛' },
    'all_12_solfiti': { number: 12, key: 'solfiti', icon: '🍷' },
    'all_13_lupini': { number: 13, key: 'lupini', icon: '🌸' },
    'all_14_molluschi': { number: 14, key: 'molluschi', icon: '🐚' }
};

const FOOD_TYPES = {
    'standard': { labelKey: '', icon: '', class: '' },
    'vegetariano': { labelKey: 'dietVegetarian', icon: '🌿', class: 'vegetariano' },
    'vegano': { labelKey: 'dietVegan', icon: '🌱', class: 'vegano' }
};

// ========================================
// Preferences Storage
// ========================================

const STORAGE_KEY = 'menuPreferences';

function loadPreferences() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Could not load preferences:', e);
    }
    return null;
}

function savePreferences() {
    try {
        const prefs = {
            language: state.currentLanguage,
            diet: state.filters.diet,
            excludeAllergens: state.filters.excludeAllergens
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
        console.warn('Could not save preferences:', e);
    }
}

// ========================================
// State
// ========================================

// Load saved preferences
const savedPrefs = loadPreferences();

let state = {
    currentTab: 'cuisine',
    currentLanguage: savedPrefs?.language || 'it',
    config: null,
    data: { cuisine: null, bar: null, info: null },
    lastFetch: { cuisine: null, bar: null, info: null },
    filters: {
        diet: savedPrefs?.diet || 'all',
        excludeAllergens: savedPrefs?.excludeAllergens || []
    },
    tempFilters: {
        diet: 'all',
        excludeAllergens: []
    }
};

// ========================================
// DOM Elements
// ========================================

const elements = {
    lastUpdated: document.getElementById('lastUpdated'),
    langSwitch: document.getElementById('langSwitch'),
    updateIndicator: document.getElementById('updateIndicator'),
    errorBanner: document.getElementById('errorBanner'),
    retryButton: document.getElementById('retryButton'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    menuContainer: document.getElementById('menuContainer'),
    infoContainer: document.getElementById('infoContainer'),
    storeLogo: document.getElementById('storeLogo'),
    storeName: document.getElementById('storeName'),
    navItems: document.querySelectorAll('.nav-item'),
    // Filter elements
    filterTrigger: document.getElementById('filterTrigger'),
    activeFilters: document.getElementById('activeFilters'),
    dietChip: document.getElementById('dietChip'),
    allergenChip: document.getElementById('allergenChip'),
    // Modal elements
    filterModal: document.getElementById('filterModal'),
    modalClose: document.getElementById('modalClose'),
    dietOptions: document.querySelectorAll('.diet-option'),
    allergenGrid: document.getElementById('allergenGrid'),
    clearFilters: document.getElementById('clearFilters'),
    applyFilters: document.getElementById('applyFilters'),
    // Accessibility
    srAnnounce: document.getElementById('srAnnounce')
};

// ========================================
// Translation Helper
// ========================================

function t(key) {
    const lang = state.currentLanguage;
    return TRANSLATIONS[lang][key] || TRANSLATIONS['it'][key] || key;
}

function tAllergen(key) {
    const lang = state.currentLanguage;
    return TRANSLATIONS[lang].allergens[key] || TRANSLATIONS['it'].allergens[key] || key;
}

function formatPrice(price) {
    if (!price) return '';
    const config = state.config;
    const locale = config?.regional?.locale || 'it-IT';
    const currency = config?.regional?.currency || 'EUR';

    // Parse the price (handle both number and string with comma/dot)
    let numPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(',', '.'));
    if (isNaN(numPrice)) return price; // Return as-is if not parseable

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(numPrice);
    } catch (e) {
        // Fallback if Intl fails
        const symbol = config?.regional?.currencySymbol || '€';
        return `${symbol} ${numPrice.toFixed(2)}`;
    }
}

function updateUILanguage() {
    const lang = state.currentLanguage;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update language switch button
    const langSwitch = elements.langSwitch;
    if (lang === 'it') {
        langSwitch.querySelector('.lang-flag').textContent = '🇬🇧';
        langSwitch.setAttribute('aria-label', t('switchLang'));
    } else {
        langSwitch.querySelector('.lang-flag').textContent = '🇮🇹';
        langSwitch.setAttribute('aria-label', t('switchLang'));
    }

    // Update modal close button aria-label
    elements.modalClose.setAttribute('aria-label', t('close'));

    // Update active filter chips
    updateActiveFilterDisplay();

    // Re-render menu with new language
    render();
}

// ========================================
// CSV Parser & Utilities
// ========================================

function parseCSV(text) {
    const cleanText = text.replace(/^\uFEFF/, '');
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuote) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField.trim());
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }

    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map(h => h.toLowerCase().trim());

    return rows.slice(1)
        .filter(row => row.length > 1)
        .map(row => {
            const rowObj = {};
            headers.forEach((h, i) => {
                rowObj[h] = row[i] || '';
            });
            return rowObj;
        });
}

function isTruthy(val) {
    if (!val) return false;
    const s = String(val).toLowerCase().trim();
    return ['true', '1', 'x', 'si', 'sì', 'yes'].includes(s);
}

function parsePrice(val) {
    if (!val) return '';
    let s = String(val).replace(',', '.');
    let n = parseFloat(s);
    return isNaN(n) ? s : n.toFixed(2).replace('.', ',');
}

function getAllergens(row) {
    return Object.entries(ALLERGENS)
        .filter(([col]) => isTruthy(row[col]))
        .map(([colKey, info]) => ({ ...info, colKey }))
        .sort((a, b) => a.number - b.number);
}

function getAllergenKeys(row) {
    return Object.keys(ALLERGENS).filter(col => isTruthy(row[col]));
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========================================
// Data Processing
// ========================================

function processMenuData(rawData) {
    const activeItems = rawData.filter(row => isTruthy(row.attivo));

    let lastSheetUpdate = null;
    rawData.forEach(r => {
        if (r.ultimo_aggiornamento?.trim()) lastSheetUpdate = r.ultimo_aggiornamento.trim();
    });

    const categories = {};
    activeItems.forEach(row => {
        const catName = row.categoria || 'Altro';
        if (!categories[catName]) {
            categories[catName] = {
                name: catName,
                order: parseFloat(row.ordine_categoria) || 999,
                items: []
            };
        }

        const tipo = (row.tipo || 'standard').toLowerCase().trim();

        categories[catName].items.push({
            nome_it: row.nome_it || '',
            nome_en: row.nome_en || row.nome_it || '',
            desc_it: row.descrizione_it || '',
            desc_en: row.descrizione_en || row.descrizione_it || '',
            price: parsePrice(row.prezzo),
            order: parseFloat(row.ordine_prodotto) || 999,
            allergens: getAllergens(row),
            allergenKeys: getAllergenKeys(row),
            tipo: tipo
        });
    });

    Object.values(categories).forEach(c => c.items.sort((a, b) => a.order - b.order));

    return {
        categories: Object.values(categories).sort((a, b) => a.order - b.order),
        lastSheetUpdate
    };
}

// Day order for sorting and collapse logic
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function collapseAdjacentDays(entries) {
    if (entries.length === 0) return [];

    // Sort by day order
    entries.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

    const groups = [];
    let currentGroup = null;

    entries.forEach(entry => {
        const signature = `${entry.slot1}|${entry.slot2}`;
        if (currentGroup && currentGroup.signature === signature) {
            currentGroup.endEntry = entry;
        } else {
            if (currentGroup) groups.push(currentGroup);
            currentGroup = {
                startEntry: entry,
                endEntry: entry,
                signature,
                slot1: entry.slot1,
                slot2: entry.slot2
            };
        }
    });
    if (currentGroup) groups.push(currentGroup);

    return groups.map(g => ({
        days_it: g.startEntry === g.endEntry
            ? g.startEntry.label_it
            : `${g.startEntry.label_it} - ${g.endEntry.label_it}`,
        days_en: g.startEntry === g.endEntry
            ? g.startEntry.label_en
            : `${g.startEntry.label_en} - ${g.endEntry.label_en}`,
        slot1: g.slot1,
        slot2: g.slot2
    }));
}

function processInfoData(rawData) {
    const sections = {
        hoursLocationRaw: [],
        hoursKitchenRaw: [],
        hoursLocation: [],
        hoursKitchen: [],
        menuHeaderCuisine: null,
        menuHeaderBar: null,
        contentItems: [] // Preserves order of texts and CTAs
    };

    rawData.forEach(row => {
        const type = (row.type || '').toLowerCase().trim();
        const day = (row.day || '').toLowerCase().trim();

        if (type === 'hours_location' && day) {
            sections.hoursLocationRaw.push({
                day,
                label_it: row.label_it || '',
                label_en: row.label_en || '',
                slot1: row.slot1_open && row.slot1_close ? `${row.slot1_open} - ${row.slot1_close}` : '',
                slot2: row.slot2_open && row.slot2_close ? `${row.slot2_open} - ${row.slot2_close}` : ''
            });
        } else if (type === 'hours_kitchen' && day) {
            sections.hoursKitchenRaw.push({
                day,
                label_it: row.label_it || '',
                label_en: row.label_en || '',
                slot1: row.slot1_open && row.slot1_close ? `${row.slot1_open} - ${row.slot1_close}` : '',
                slot2: row.slot2_open && row.slot2_close ? `${row.slot2_open} - ${row.slot2_close}` : ''
            });
        } else if (type === 'menu_header_cuisine') {
            sections.menuHeaderCuisine = {
                title_it: row.label_it || '',
                title_en: row.label_en || '',
                text_it: row.text_it || '',
                text_en: row.text_en || '',
                style: row.style || 'card'
            };
        } else if (type === 'menu_header_bar') {
            sections.menuHeaderBar = {
                title_it: row.label_it || '',
                title_en: row.label_en || '',
                text_it: row.text_it || '',
                text_en: row.text_en || '',
                style: row.style || 'card'
            };
        } else if (type === 'text') {
            sections.contentItems.push({
                type: 'text',
                label_it: row.label_it || '',
                label_en: row.label_en || '',
                text_it: row.text_it || '',
                text_en: row.text_en || '',
                style: row.style || 'plain'
            });
        } else if (type === 'cta') {
            sections.contentItems.push({
                type: 'cta',
                label_it: row.label_it || '',
                label_en: row.label_en || '',
                link: row.link || '',
                style: row.style || 'secondary'
            });
        }
    });

    // Collapse adjacent days with same time slots
    sections.hoursLocation = collapseAdjacentDays(sections.hoursLocationRaw);
    sections.hoursKitchen = collapseAdjacentDays(sections.hoursKitchenRaw);

    return sections;
}

// ========================================
// Filtering Logic
// ========================================

function applyFiltersToData(categories) {
    const { diet, excludeAllergens } = state.filters;

    return categories
        .map(cat => {
            const filteredItems = cat.items.filter(item => {
                // Diet filter
                if (diet === 'vegan' && item.tipo !== 'vegano') {
                    return false;
                }
                if (diet === 'vegetarian' && item.tipo !== 'vegetariano' && item.tipo !== 'vegano') {
                    return false;
                }

                // Allergen exclusion filter
                if (excludeAllergens.length > 0) {
                    const hasExcludedAllergen = item.allergenKeys.some(key => excludeAllergens.includes(key));
                    if (hasExcludedAllergen) return false;
                }

                return true;
            });

            return { ...cat, items: filteredItems };
        })
        .filter(cat => cat.items.length > 0);
}

// ========================================
// Core Logic
// ========================================

async function loadConfig() {
    try {
        const response = await fetch('config.json?t=' + Date.now());
        if (!response.ok) throw new Error('Config load failed');
        state.config = await response.json();
        applyConfig();
    } catch (e) {
        console.error('Failed to load config:', e);
        // Fallback or critical error handling
        elements.storeName.textContent = 'Configuration Error';
    }
}

function applyConfig() {
    if (!state.config) return;

    const { app, location, contact, urls } = state.config;

    // Apply branding
    if (app.name) elements.storeName.textContent = app.name;
    if (app.accentColor) document.documentElement.style.setProperty('--color-accent', app.accentColor);
    if (app.logoUrl) {
        elements.storeLogo.src = app.logoUrl;
        elements.storeLogo.hidden = false;
    }

    // Update CONFIG URLs
    if (urls) {
        CONFIG.cuisine.url = urls.cuisine;
        CONFIG.bar.url = urls.bar;
        CONFIG.info = { url: urls.info, name: 'Info' };
    }
}

async function fetchData(tab) {
    if (!CONFIG[tab]) return;

    let url = CONFIG[tab].url;
    let usingFallback = false;

    if (!url || url.includes('PASTE_')) {
        usingFallback = true;
    }

    try {
        let response;
        let text;

        if (!usingFallback) {
            try {
                const fetchUrl = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
                response = await fetch(fetchUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                text = await response.text();
            } catch (err) {
                console.warn(`Remote fetch failed (${err.message}). Switching to fallback.`);
                usingFallback = true;
            }
        }

        if (usingFallback) {
            response = await fetch(`./${tab}.csv?t=${Date.now()}`);
            if (!response.ok) throw new Error(`Local file not found: ${response.status}`);
            text = await response.text();
        }

        const parsed = parseCSV(text);
        const data = tab === 'info' ? processInfoData(parsed) : processMenuData(parsed);

        state.data[tab] = data;
        state.lastFetch[tab] = new Date();

        if (state.currentTab === tab) {
            render();
            elements.errorBanner.hidden = true;
            if (!elements.loadingState.hidden) elements.loadingState.hidden = true;
            showUpdateIndicator();
            // Scroll to top after new data loads
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

    } catch (e) {
        console.error(`Final fetch error for ${tab}:`, e);
        if (state.currentTab === tab) {
            elements.errorBanner.hidden = false;
            elements.loadingState.hidden = true;
            if (state.currentTab === 'info') {
                elements.infoContainer.hidden = true;
            } else if (!state.data[tab]) {
                elements.menuContainer.hidden = true;
            }
        }
    }
}

function render() {
    const tab = state.currentTab;
    const data = state.data[tab];

    if (data && data.lastSheetUpdate) {
        elements.lastUpdated.textContent = data.lastSheetUpdate;
    } else if (state.lastFetch[tab]) {
        elements.lastUpdated.textContent = state.lastFetch[tab].toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } else {
        elements.lastUpdated.textContent = '--:--';
    }

    if (!data) {
        elements.menuContainer.hidden = true;
        elements.emptyState.hidden = true;
        elements.loadingState.hidden = false;
        return;
    }

    elements.loadingState.hidden = true;

    if (tab === 'info') {
        // Hide filter bar on Info tab
        document.querySelector('.filter-bar').hidden = true;
        renderInfoPage();
        elements.menuContainer.hidden = true;
        elements.infoContainer.hidden = false;
        elements.emptyState.hidden = true;
        return;
    }

    // Show filter bar on menu tabs
    document.querySelector('.filter-bar').hidden = false;

    elements.infoContainer.hidden = true;
    const filteredCategories = applyFiltersToData(data.categories);

    if (filteredCategories.length === 0) {
        elements.menuContainer.hidden = true;
        elements.emptyState.hidden = false;
        return;
    }

    elements.emptyState.hidden = true;
    elements.menuContainer.hidden = false;

    const lang = state.currentLanguage;
    let html = '';

    // Menu header (if available from info.csv)
    const infoData = state.data.info;
    if (infoData) {
        const header = tab === 'cuisine' ? infoData.menuHeaderCuisine : infoData.menuHeaderBar;
        if (header) {
            const title = lang === 'it' ? header.title_it : header.title_en;
            const text = lang === 'it' ? header.text_it : header.text_en;
            if (text || title) {
                const isCard = header.style === 'card';
                html += `
                    <div class="menu-header ${isCard ? 'menu-header-card' : 'menu-header-plain'}">
                        ${title ? `<h2 class="menu-header-title">${escapeHTML(title)}</h2>` : ''}
                        ${text ? `<p class="menu-header-text">${escapeHTML(text)}</p>` : ''}
                    </div>
                `;
            }
        }
    }

    filteredCategories.forEach(cat => {
        html += `
            <section class="category-section">
                <h2 class="category-title">${escapeHTML(cat.name)}</h2>
                <div class="menu-items">
        `;

        cat.items.forEach(item => {
            const name = lang === 'it' ? item.nome_it : item.nome_en;
            const desc = lang === 'it' ? item.desc_it : item.desc_en;
            const foodType = FOOD_TYPES[item.tipo] || FOOD_TYPES['standard'];
            const foodTypeLabel = foodType.labelKey ? t(foodType.labelKey) : '';
            const priceFormatted = formatPrice(item.price);

            // Build footer row with diet badge and allergens
            let footerHtml = '';
            const hasDietBadge = foodTypeLabel;
            const hasAllergens = item.allergens && item.allergens.length > 0;

            if (hasDietBadge || hasAllergens) {
                footerHtml = '<div class="item-footer">';
                if (hasDietBadge) {
                    footerHtml += `
                        <span class="food-type-badge ${foodType.class}">
                            <span class="food-type-icon">${foodType.icon}</span>
                            ${foodTypeLabel}
                        </span>
                    `;
                }
                if (hasAllergens) {
                    footerHtml += renderAllergens(item.allergens);
                }
                footerHtml += '</div>';
            }

            html += `
                <article class="menu-item">
                    <div class="item-header">
                        <h3 class="item-name">${escapeHTML(name)}</h3>
                        ${priceFormatted ? `<span class="item-price">${priceFormatted}</span>` : ''}
                    </div>
                    ${desc ? `<p class="item-description">${escapeHTML(desc)}</p>` : ''}
                    ${footerHtml}
                </article>
            `;
        });

        html += '</div></section>';
    });

    elements.menuContainer.innerHTML = html;
}

function renderInfoPage() {
    const data = state.data.info;
    const config = state.config;
    if (!data || !config) return;

    const lang = state.currentLanguage;
    let html = '';



    // 1. Static Location Card (from JSON)
    if (config.location || config.contact) {
        html += `<section class="info-card location-card">`;

        if (config.location?.address) {
            html += `<h3 class="location-address">${escapeHTML(config.location.address)}</h3>`;
        }

        if (config.contact) {
            if (config.contact.phone) {
                html += `
                    <a href="tel:${config.contact.phone.replace(/\s/g, '')}" class="contact-row">
                        <span>📞</span> ${escapeHTML(config.contact.phone)}
                    </a>
                `;
            }
            if (config.contact.email) {
                html += `
                    <a href="mailto:${config.contact.email}" class="contact-row">
                        <span>✉️</span> ${escapeHTML(config.contact.email)}
                    </a>
                `;
            }
        }

        if (config.location?.mapUrl) {
            const mapLabel = lang === 'it' ? 'Vedi su Mappa' : 'View on Map';
            html += `
                <a href="${config.location.mapUrl}" target="_blank" class="map-embed">
                    🗺️ ${mapLabel}
                </a>
            `;
        }
        html += `</section>`;
    }

    // 2. Content Items (texts and CTAs in CSV order)
    data.contentItems.forEach(item => {
        if (item.type === 'text') {
            const label = lang === 'it' ? item.label_it : item.label_en;
            const text = lang === 'it' ? item.text_it : item.text_en;
            const isCard = item.style === 'card';
            html += `
                <section class="info-section ${isCard ? 'info-section-card' : 'info-section-plain'}">
                    ${label ? `<h2 class="info-title">${escapeHTML(label)}</h2>` : ''}
                    <p class="info-text">${escapeHTML(text)}</p>
                </section>
            `;
        } else if (item.type === 'cta') {
            const label = lang === 'it' ? item.label_it : item.label_en;
            const isPrimary = item.style === 'primary';
            html += `
                <a href="${item.link}" class="cta-btn ${isPrimary ? 'primary' : 'secondary'}">
                    ${escapeHTML(label)}
                </a>
            `;
        }
    });

    // 3. Timetables (from CSV - localized)
    const hoursLocationTitle = lang === 'it' ? 'Orari Apertura' : 'Opening Hours';
    const hoursKitchenTitle = lang === 'it' ? 'Orari Cucina' : 'Kitchen Hours';

    if (data.hoursLocation.length > 0 || data.hoursKitchen.length > 0) {
        html += `<section class="info-card">`;

        if (data.hoursLocation.length > 0) {
            html += `<h3 class="info-title">${hoursLocationTitle}</h3><div class="timetable-grid">`;
            data.hoursLocation.forEach(h => {
                const days = lang === 'it' ? h.days_it : h.days_en;
                const times = h.slot2 ? `${h.slot1} / ${h.slot2}` : h.slot1;
                html += `
                    <div class="time-row">
                        <span class="time-days">${escapeHTML(days)}</span>
                        <span class="time-hours">${escapeHTML(times)}</span>
                    </div>`;
            });
            html += `</div>`;
        }

        if (data.hoursKitchen.length > 0) {
            const marginTop = data.hoursLocation.length > 0 ? 'margin-top: 16px;' : '';
            html += `<h3 class="info-title" style="${marginTop}">${hoursKitchenTitle}</h3><div class="timetable-grid">`;
            data.hoursKitchen.forEach(h => {
                const days = lang === 'it' ? h.days_it : h.days_en;
                const times = h.slot2 ? `${h.slot1} / ${h.slot2}` : h.slot1;
                html += `
                    <div class="time-row">
                        <span class="time-days">${escapeHTML(days)}</span>
                        <span class="time-hours">${escapeHTML(times)}</span>
                    </div>`;
            });
            html += `</div>`;
        }
        html += `</section>`;
    }

    // 5. Socials (from JSON)
    const socialLinks = config.contact?.socials || [];
    if (socialLinks.length > 0) {
        html += `<div class="social-grid">`;
        socialLinks.forEach(soc => {
            html += `
                <a href="${soc.url}" target="_blank" class="social-link">
                    <span>${soc.icon || '🔗'}</span> ${escapeHTML(soc.name)}
                </a>
            `;
        });
        html += `</div>`;
    }

    elements.infoContainer.innerHTML = html;
}

function renderAllergens(list) {
    if (!list || list.length === 0) return '';

    let html = '<div class="allergen-chips">';
    list.forEach(a => {
        const name = tAllergen(a.key);
        html += `
            <span class="allergen-chip">
                <span class="allergen-icon">${a.icon}</span>
                ${escapeHTML(name)}
            </span>
        `;
    });
    html += '</div>';
    return html;
}

function showUpdateIndicator() {
    if (!elements.updateIndicator) return;
    elements.updateIndicator.classList.add('visible');
    setTimeout(() => elements.updateIndicator.classList.remove('visible'), 2000);
}

// ========================================
// Filter UI
// ========================================

function updateActiveFilterDisplay() {
    const { diet, excludeAllergens } = state.filters;
    const hasFilters = diet !== 'all' || excludeAllergens.length > 0;

    // Update trigger button
    elements.filterTrigger.classList.toggle('has-filters', hasFilters);

    // Update active filters display
    elements.activeFilters.hidden = !hasFilters;

    // Diet chip
    if (diet !== 'all') {
        const dietInfo = diet === 'vegan'
            ? { icon: '🌱', label: t('dietVegan'), class: '' }
            : { icon: '🌿', label: t('dietVegetarian'), class: 'vegetarian' };

        elements.dietChip.hidden = false;
        elements.dietChip.className = `filter-chip diet-chip ${dietInfo.class}`;
        elements.dietChip.querySelector('.chip-icon').textContent = dietInfo.icon;
        elements.dietChip.querySelector('.chip-label').textContent = dietInfo.label;
    } else {
        elements.dietChip.hidden = true;
    }

    // Allergen count chip
    if (excludeAllergens.length > 0) {
        elements.allergenChip.hidden = false;
        elements.allergenChip.querySelector('.chip-label').textContent =
            `${excludeAllergens.length} ${t('allergensExcluded')}`;
    } else {
        elements.allergenChip.hidden = true;
    }
}

function buildAllergenGrid() {
    let html = '';
    Object.entries(ALLERGENS).forEach(([colKey, allergen]) => {
        const isChecked = state.tempFilters.excludeAllergens.includes(colKey);
        const name = tAllergen(allergen.key);
        html += `
            <label class="allergen-checkbox ${isChecked ? 'checked' : ''}" data-key="${colKey}">
                <input type="checkbox" ${isChecked ? 'checked' : ''} aria-label="${name}">
                <span class="allergen-checkbox-icon">${allergen.icon}</span>
                <span class="allergen-checkbox-label">${name}</span>
            </label>
        `;
    });
    elements.allergenGrid.innerHTML = html;

    // Add change handlers
    elements.allergenGrid.querySelectorAll('.allergen-checkbox input').forEach(input => {
        input.addEventListener('change', (e) => {
            const label = e.target.closest('.allergen-checkbox');
            label.classList.toggle('checked', e.target.checked);
        });
    });
}

function syncModalToState() {
    // Sync diet options
    elements.dietOptions.forEach(btn => {
        const isActive = btn.dataset.diet === state.tempFilters.diet;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive);
    });

    // Build allergen grid with current temp state
    buildAllergenGrid();
}

function openFilterModal() {
    // Copy current filters to temp
    state.tempFilters = {
        diet: state.filters.diet,
        excludeAllergens: [...state.filters.excludeAllergens]
    };

    syncModalToState();
    elements.filterModal.hidden = false;
    elements.filterTrigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus trap - focus first interactive element
    elements.modalClose.focus();
}

function closeFilterModal() {
    elements.filterModal.hidden = true;
    elements.filterTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    elements.filterTrigger.focus();
}

function applyFiltersFromModal() {
    // Get diet from active button
    const activeDiet = document.querySelector('.diet-option.active');
    state.filters.diet = activeDiet ? activeDiet.dataset.diet : 'all';

    // Get allergens from checked boxes
    const checkedBoxes = elements.allergenGrid.querySelectorAll('input:checked');
    state.filters.excludeAllergens = Array.from(checkedBoxes).map(cb =>
        cb.closest('.allergen-checkbox').dataset.key
    );

    updateActiveFilterDisplay();
    closeFilterModal();
    render();

    // Save preferences to localStorage
    savePreferences();

    // Announce to screen readers
    announceToSR(t('filters') + ' ' + t('apply').toLowerCase());
}

function clearAllFilters() {
    state.tempFilters.diet = 'all';
    state.tempFilters.excludeAllergens = [];
    syncModalToState();
}

function announceToSR(message) {
    if (elements.srAnnounce) {
        elements.srAnnounce.textContent = message;
        setTimeout(() => { elements.srAnnounce.textContent = ''; }, 1000);
    }
}

// ========================================
// Events
// ========================================

function switchTab(newTab) {
    if (state.currentTab === newTab) return;

    elements.navItems.forEach(btn => {
        if (btn.dataset.target === newTab) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    state.currentTab = newTab;

    // Announce page change for screen readers
    const tabNames = {
        cuisine: { it: 'Menu Cucina', en: 'Kitchen Menu' },
        bar: { it: 'Menu Bar', en: 'Bar Menu' },
        info: { it: 'Informazioni', en: 'Information' }
    };
    const announceName = tabNames[newTab]?.[state.currentLanguage] || newTab;
    announceToSR(announceName);

    if (state.data[newTab]) {
        render();
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
        if (newTab === 'info') {
            elements.menuContainer.hidden = true;
            elements.infoContainer.hidden = true; // wait for data
        } else {
            elements.infoContainer.hidden = true;
            elements.menuContainer.hidden = true;
        }
        elements.loadingState.hidden = false;
        fetchData(newTab);
    }
}

// Tab Navigation
elements.navItems.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.target));
});

// Language Toggle
elements.langSwitch.addEventListener('click', () => {
    state.currentLanguage = state.currentLanguage === 'it' ? 'en' : 'it';
    document.documentElement.lang = state.currentLanguage;
    updateUILanguage();
    savePreferences();
    announceToSR(state.currentLanguage === 'it' ? 'Italiano' : 'English');
});

// Retry Button
elements.retryButton.addEventListener('click', () => fetchData(state.currentTab));

// Filter Modal
elements.filterTrigger.addEventListener('click', openFilterModal);
elements.modalClose.addEventListener('click', closeFilterModal);
elements.applyFilters.addEventListener('click', applyFiltersFromModal);
elements.clearFilters.addEventListener('click', clearAllFilters);

// Diet options in modal
elements.dietOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        state.tempFilters.diet = btn.dataset.diet;
        elements.dietOptions.forEach(b => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-checked', isActive);
        });
    });
});

// Close modal on overlay click
elements.filterModal.addEventListener('click', (e) => {
    if (e.target === elements.filterModal) closeFilterModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.filterModal.hidden) {
        closeFilterModal();
    }
});

// ========================================
// Init
// ========================================

function init() {
    // Set initial language
    updateUILanguage();
    updateActiveFilterDisplay();

    // Fetch config first, then data
    loadConfig().then(() => {
        fetchData('cuisine');
    });

    // Smart refresh on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            const now = new Date();
            const last = state.lastFetch[state.currentTab];
            const STALE_THRESHOLD = 5 * 60 * 1000;

            if (!last || (now - last > STALE_THRESHOLD)) {
                fetchData(state.currentTab);
            }
        }
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
