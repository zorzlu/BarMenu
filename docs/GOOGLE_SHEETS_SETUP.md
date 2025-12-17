# Google Sheets Integration Guide

This guide explains how to set up and use Google Sheets as the data source for ScomodoMenu.

---

## Overview

The application uses Google Sheets as a dynamic content management system. Menu updates made in the spreadsheet are automatically reflected in the application without any deployment or build process.

---

## Step-by-Step Setup

### 1. Copy the Template

1. Open the template Google Sheet: **[ScomodoMenu Template](YOUR_GOOGLE_SHEETS_TEMPLATE_LINK_HERE)**
2. Click **File** > **Make a copy**
3. Choose a location in your Google Drive
4. Rename the copy to something meaningful (e.g., "Restaurant Menu - Live")

The template contains the complete structure with sample data for reference.

### 2. Edit Your Menu Data

Update the spreadsheet with your actual menu items. Replace the sample data with your own content.

The structure is explained in detail in the [Data Structure Guide](DATA_STRUCTURE.md).

**Important**: Do not modify Row 1 (section markers) as it defines the table boundaries.

![Google Sheets Example](gsheets_table_example.png)
*Example of the unified Google Sheets structure with multiple tables side by side*

### 3. Publish as CSV

1. In your copied Google Sheet, go to **File** > **Share** > **Publish to web**
2. In the **Link** tab, select the specific sheet (usually "Sheet1")
3. Change the format dropdown from "Web page" to **Comma-separated values (.csv)**
4. Check "Automatically republish when changes are made" for instant updates
5. Click **Publish**
6. Copy the generated URL (it will look like: `https://docs.google.com/spreadsheets/d/e/...output=csv`)

### 4. Configure the Application

Open `config/config.json` and paste your CSV URL:

```json
{
  "inputData": {
    "menuUrl": "YOUR_GOOGLE_SHEETS_CSV_URL_HERE",
    "fallbackFile": "data/fallback_menu.csv",
    "csvLanguage": "it",
    "csvNumberFormat": "it"
  }
}
```

**Configuration Options:**
- `menuUrl`: The published Google Sheets CSV URL
- `fallbackFile`: Local CSV file used if Google Sheets is unavailable
- `csvLanguage`: Language used in the CSV file (`it` or `en`)
- `csvNumberFormat`: Number format in CSV (`it` uses comma for decimals, `en` uses period)

---

## Tips and Best Practices

### Update Frequency

Changes to your Google Sheet are typically reflected within a few minutes, but Google's caching may delay updates. For immediate updates during testing, you can:
1. Clear your browser cache
2. Use an incognito/private window
3. Add a cache-busting parameter to your URL requests

### Data Validation

Before publishing your sheet:
- Check that all category IDs in menu items match those defined in the Categories table
- Verify price formatting is consistent (use decimals like `12.00`, not `12`)
- Ensure `active` fields contain `true` or `false` (lowercase)
- Confirm allergen columns contain boolean values

### Backup Your Data

Regularly export a backup:
1. In Google Sheets, go to **File** > **Download** > **Comma Separated Values (.csv)**
2. Save the file in your project's `examples/` folder

### Multiple Sheets

If you want to maintain separate versions (e.g., summer menu vs. winter menu):
1. Duplicate your Google Sheet tab
2. Make changes to the new tab
3. Publish the new tab and update `config.json` when ready to switch

---

## Troubleshooting

### Menu Not Updating

**Problem**: Changes in Google Sheets don't appear in the app.

**Solutions**:
- Wait a few minutes for Google's cache to expire
- Verify the CSV URL is correct in `config.json`
- Check browser console for errors
- Confirm the sheet is published with "Automatically republish" enabled

### Items Not Showing

**Problem**: Menu items don't display even though they're in the sheet.

**Solutions**:
- Verify `active` is set to `true`
- Check that the `category` matches a `category_id` in the Categories table
- Ensure the category's `menu` field is either `bar` or `cuisine`

### Formatting Issues

**Problem**: Prices or special characters display incorrectly.

**Solutions**:
- Check `csvNumberFormat` in `config.json` matches your sheet's locale
- Use UTF-8 encoding for special characters
- Avoid special formatting in Google Sheets (keep it plain text)

---

## Related Documentation

- [Data Structure Guide](DATA_STRUCTURE.md) - Complete CSV structure reference
- [Configuration Guide](CONFIGURATION.md) - Application configuration details
- [Main README](../README.md) - Project overview
