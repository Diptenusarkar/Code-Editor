# CodeStudio Pro - Web-Based Code Editor

**Last Updated:** 2025-07-17

## Overview

CodeStudio Pro is a feature-rich, web-based code editor built with HTML, CSS, and JavaScript. It mimics the look and feel of modern IDEs like Visual Studio Code while running entirely in the browser. The editor provides a complete environment for web development with support for HTML, CSS, and JavaScript files, including syntax highlighting, file management, and live preview capabilities.

## Features

- **Multi-file Editor**: Edit HTML, CSS, and JavaScript files simultaneously
- **Syntax Highlighting**: Powered by Prism.js for clear, readable code
- **Live Preview**: See your web page rendered in real-time
- **Integrated Console**: JavaScript console output and interactive input
- **File Management**: Create, rename, and delete files and folders
- **Folder Organization**: Create folders and organize your files hierarchically
- **Dark/Light Themes**: Switch between color themes for comfortable coding
- **Code Formatting**: Format your code with a click
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

CodeStudio Pro is a single-page application that includes:
- A file explorer panel on the left
- Code editor in the center
- Preview and console panels on the right
- Status bar at the bottom

The editor manages file content in memory, allowing you to work with multiple files and switch between them using tabs or the file explorer.

## Getting Started

1. Open `index.html` in a modern web browser
2. The editor loads with three default files: index.html, style.css, and script.js
3. Edit any file by clicking on its tab or selecting it from the file explorer
4. Click the "Run" button or "Refresh Preview" to see your changes in the preview panel
5. Use the console to test JavaScript code or view console output
6. Create new files using the "+" button in the file explorer
7. Create new folders to organize your files
8. Save your work using the "Save" button

## File Structure

The application consists of the following files:

- **index.html**: Main HTML file with UI structure and CSS styling
- **editor.js**: JavaScript file containing all the application logic
- **readme.md**: This documentation file

## How to Use

### Getting Started

1. Open the `index.html` file in a modern web browser
2. The editor loads with default HTML, CSS, and JavaScript files
3. Edit any file by clicking on its tab or in the file explorer
4. Click the "Run" button to see your changes in the preview panel

### File Operations

#### Creating Files

1. Click the "New File" button (document with plus icon) in the file explorer header
2. Enter a filename and select the file type (HTML, CSS, or JavaScript)
3. Click "Create" to add the file to your workspace

#### Creating Folders

1. Click the "New Folder" button (folder icon) in the file explorer header
2. Enter a folder name in the prompt
3. A new folder will be created in the file explorer

#### Adding Files to Folders

1. Click on a folder to expand it
2. Click the "+" icon in the folder's action menu
3. Enter a filename when prompted
4. The file will be created inside the folder

#### Renaming Files

1. Hover over a file in the file explorer
2. Click the pencil icon that appears
3. Enter the new filename in the prompt dialog

#### Managing Folders

1. Click on a folder to expand or collapse it
2. Use the rename (pencil) icon to rename the folder
3. Use the delete (trash) icon to delete the folder and its contents
4. Use the add (plus) icon to add new files directly to the folder

#### Deleting Files

1. Hover over a file in the file explorer
2. Click the trash icon that appears
3. Confirm deletion in the popup dialog

### Switching Themes

- Click the moon/sun icon in the top-right corner to toggle between dark and light themes

### Formatting Code

- Click the "Format" button in the top-right to format the current file's code

### Using the Console

- The console panel shows JavaScript output
- Type JavaScript commands in the console input and press Enter to execute them
- Click "Clear" to clear the console output

### Previewing Your Code

- The preview panel shows the rendered output of your HTML, CSS, and JavaScript
- Click "Run" or the refresh button to update the preview

## Customizing CodeStudio Pro

### Adding New File Types

To add support for additional file types, modify:

1. The file templates in the JavaScript section:
```javascript
const fileTemplates = {
    // Add your file type here
    md: `# New Markdown File\n\nWrite your content here.`,
};