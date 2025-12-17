# Data Structure Reference

Complete reference for the unified CSV data structure used by ScomodoMenu.

---

## Overview

The system uses a unified CSV structure where multiple tables are placed horizontally (side by side) in a single sheet. Each table is identified by section markers in the first row.

---

## Section Markers (Row 1)

The first row contains section identifiers that define which table each column belongs to:
- `bar` - Bar menu items (drinks, cocktails, etc.)
- `cuisine` - Kitchen menu items (food dishes)
- `timeslots` - Opening hours and service periods
- `content` - Custom content blocks for info page
- `categories` - Category definitions and ordering

**Important**: All five tables must be present in your CSV file, stacked horizontally.

---

## Table Specifications

### Table 1: Bar Menu (`bar`)

Contains all beverage items and bar snacks.

**Columns:**
- `category` - Category ID (must match a category_id from Categories table)
- `name_it` - Item name in Italian
- `name_en` - Item name in English
- `active` - `true` to show item, `false` to hide
- `price` - Price in decimal format (e.g., `6.00`)
- `description_it` - Description in Italian
- `description_en` - Description in English
- `type` - Diet type: `standard`, `vegetarian`, or `vegan`
- `all_1_gluten` through `all_14_mollusks` - Allergen flags (`true` if present, `false` otherwise)

**Example:**
```csv
category,name_it,active,price,description_it,name_en,description_en,type,all_1_gluten,...
beers,IPA Artigianale,true,6.00,Birra artigianale 33cl,Craft IPA,Craft beer 33cl,vegan,true,...
cocktails,Negroni,true,8.00,"Gin, Vermouth, Campari",Negroni,"Gin, Vermouth, Campari",vegan,false,...
```

---

### Table 2: Kitchen Menu (`cuisine`)

Contains all food items from the kitchen.

**Columns:**
Same structure as the Bar Menu table.

**Example:**
```csv
category,name_it,active,price,description_it,name_en,description_en,type,all_1_gluten,...
first_courses,Carbonara,true,12.00,"Spaghetti, uova, guanciale",Carbonara,"Spaghetti, eggs, guanciale",standard,true,...
desserts,Tiramisù,true,6.00,Fatto in casa,Tiramisu,Homemade,vegetarian,true,...
```

---

### Table 3: Time Slots (`timeslots`)

Defines opening hours and service periods that appear on the home page and info page.

**Columns:**
- `slot_id` - Unique identifier (e.g., `lunch`, `dinner`, `aperitivo`)
- `label_it` - Label in Italian
- `label_en` - Label in English
- `day` - Day of week: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`
- `open` - Opening time in 24h format (e.g., `12:00`)
- `close` - Closing time in 24h format (e.g., `15:00`)
- `is_kitchen` - `true` if kitchen is open during this slot, `false` for bar-only service
- `show_in_hero` - `true` to show in home page status cards
- `show_in_info` - `true` to show in info page hours section

**Example:**
```csv
slot_id,label_it,label_en,day,open,close,is_kitchen,show_in_hero,show_in_info
lunch,Pranzo,Lunch,mon,12:00,15:00,true,true,true
dinner,Cena,Dinner,mon,19:00,22:30,true,true,true
aperitivo,Aperitivo,Aperitivo,fri,18:00,20:00,false,true,false
```

**Notes:**
- Create one row per time slot per day
- Use `is_kitchen: true` for food service periods
- `show_in_hero: true` displays the slot on the home page as kitchen status
- Times spanning midnight can use hours like `24:00` or `01:00`

---

### Table 4: Content Blocks (`content`)

Custom content sections displayed on the info page and menu headers.

**Columns:**
- `type` - Content type: `text`, `cta`, `menu_header_kitchen`, `menu_header_bar`
- `label_it` - Title in Italian
- `label_en` - Title in English
- `text_it` - Content text in Italian (for `text` type)
- `text_en` - Content text in English (for `text` type)
- `link` - URL for buttons (`cta` type only)
- `style` - Style variant: `card`, `plain`, `primary`, `secondary`

**Content Types:**
- `text` - Informational text blocks
- `cta` - Call-to-action buttons with links
- `menu_header_kitchen` - Header banner for the kitchen menu tab
- `menu_header_bar` - Header banner for the bar menu tab

**Style Options:**
- `card` - Displayed with card background
- `plain` - Flat background, no card
- `primary` - Primary button style (for CTA)
- `secondary` - Secondary button style (for CTA)

**Example:**
```csv
type,label_it,label_en,text_it,text_en,link,style
text,Chi Siamo,About Us,"Benvenuti nel nostro locale!","Welcome to our place!",,card
cta,Prenota un Tavolo,Book a Table,,,tel:+390612345678,primary
menu_header_kitchen,Piatti del Giorno,Daily Specials,Scopri i nostri piatti!,Discover our dishes!,,card
```

---

### Table 5: Categories (`categories`)

Defines the categories and their display order in the menu.

**Columns:**
- `category_id` - Unique category identifier (referenced by menu items)
- `label_it` - Category name in Italian
- `label_en` - Category name in English
- `order` - Display order within the menu (lower numbers appear first)
- `menu` - Which menu this category belongs to: `bar` or `cuisine`

**Example:**
```csv
category_id,label_it,label_en,order,menu
beers,Birre,Beers,1,bar
first_courses,Primi,First Courses,1,cuisine
desserts,Dolci,Desserts,3,cuisine
```

**Notes:**
- `category_id` must be unique across all categories
- `order` determines the sequence (1 appears before 2, etc.)
- `menu` must be exactly `bar` or `cuisine`

---

## Allergen Reference

The 14 EU-regulated allergens:

| Column | Number | Allergen |
|--------|--------|----------|
| `all_1_gluten` | 1 | Cereals containing gluten |
| `all_2_crustaceans` | 2 | Crustaceans |
| `all_3_eggs` | 3 | Eggs |
| `all_4_fish` | 4 | Fish |
| `all_5_peanuts` | 5 | Peanuts |
| `all_6_soy` | 6 | Soybeans |
| `all_7_milk` | 7 | Milk |
| `all_8_nuts` | 8 | Nuts |
| `all_9_celery` | 9 | Celery |
| `all_10_mustard` | 10 | Mustard |
| `all_11_sesame` | 11 | Sesame seeds |
| `all_12_sulfites` | 12 | Sulphur dioxide and sulphites |
| `all_13_lupin` | 13 | Lupin |
| `all_14_mollusks` | 14 | Molluscs |

Set to `true` if the allergen is present in the item, `false` otherwise.

---

## Diet Types

Available in the `type` column for menu items:

- `standard` - No dietary restrictions
- `vegetarian` - Contains no meat or fish
- `vegan` - Contains no animal products

---

## Data Format Guidelines

### Boolean Values
Always use lowercase: `true` or `false`

### Prices
Use decimal format with two digits: `12.00` (not `12` or `12,00`)

### Times
Use 24-hour format: `14:30` (not `2:30 PM`)

### Text with Commas
Wrap in quotes: `"Spaghetti, uova, guanciale"`

### Empty Cells
Leave cells empty if optional data is not needed

---

## Related Documentation

- [Google Sheets Setup](GOOGLE_SHEETS_SETUP.md) - Setting up your data source
- [Configuration Guide](CONFIGURATION.md) - Application configuration
- [Main README](../README.md) - Project overview
