# Element Selector and Copier Chrome Extension

## Description

This Chrome extension allows users to select HTML elements on a webpage and copy them as either HTML or Markdown. It provides two methods for selection: using the mouse or entering a CSS selector.

## Features

- Select elements by clicking on them with the mouse
- Select elements by entering a CSS selector
- Copy selected elements as HTML or Markdown
- Visual highlight of the selected element
- Keyboard shortcuts for quick copying

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Click the extension icon in the Chrome toolbar
2. Choose either "Select element with mouse" or "Enter CSS selector"
3. If using the mouse, click on the desired element on the webpage
4. If using a CSS selector, enter the selector and click "Apply"
5. In the confirmation modal, choose to copy as HTML or Markdown
6. The selected content is now copied to your clipboard

### Keyboard Shortcuts

- Press `H` to copy as HTML
- Press `M` to copy as Markdown
- Press `Esc` to cancel the selection

## Files

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface
- `popup.js`: Popup functionality
- `content.js`: Content script for webpage interaction
- `turndown.js`: Library for converting HTML to Markdown

## Dependencies

- [Turndown](https://github.com/domchristie/turndown): Used for HTML to Markdown conversion

## License

This project is licensed under the MIT License. See the LICENSE file for details.
