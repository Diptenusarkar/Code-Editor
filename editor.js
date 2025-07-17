// DOM Elements
const tabElements = document.querySelectorAll('.tab');
const fileItems = document.querySelectorAll('.file-item');
const editorWrappers = document.querySelectorAll('.editor-wrapper');
const themeToggle = document.getElementById('theme-toggle');
const saveBtn = document.getElementById('save-btn');
const formatBtn = document.getElementById('format-btn');
const clearConsoleBtn = document.getElementById('clear-console');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const runButton = document.getElementById('run-button');
const consoleOutput = document.getElementById('console-output');
const consoleInput = document.getElementById('console-input');
const previewFrame = document.getElementById('preview-frame');
const newFileBtn = document.getElementById('new-file-btn');
const newFolderBtn = document.getElementById('new-folder-btn');
const fileTree = document.getElementById('file-tree');
const tabsContainer = document.getElementById('tabs');
const currentLanguage = document.getElementById('current-language');
const toastContainer = document.getElementById('toast-container');

// Modal elements
const newFileModal = document.getElementById('new-file-modal');
const newFilename = document.getElementById('new-filename');
const newFiletype = document.getElementById('new-filetype');
const createNewFileBtn = document.getElementById('create-new-file');
const cancelNewFileBtn = document.getElementById('cancel-new-file');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const deleteModal = document.getElementById('delete-modal');
const deleteFilename = document.getElementById('delete-filename');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Store file contents
const fileContents = {
    'html': {},
    'css': {},
    'js': {}
};

// Current file being edited
let currentFile = {
    type: 'html',
    name: 'index.html'
};

// Default file templates
const fileTemplates = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML File</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World</h1>
    
    <script src="script.js"></script>
</body>
</html>`,
    css: `/* Styles for the new CSS file */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
    color: #333;
}

h1 {
    color: #2188ff;
}`,
    js: `// JavaScript for the new file
document.addEventListener('DOMContentLoaded', function() {
    console.log('New JavaScript file loaded!');
    
    // Your code here
});`
};

// Initialize editors
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');

// Store default content
fileContents.html['index.html'] = htmlEditor.textContent;
fileContents.css['style.css'] = cssEditor.textContent;
fileContents.js['script.js'] = jsEditor.textContent;

// Tab switching
function setupTabEvents() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Deactivate all tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Activate clicked tab
            this.classList.add('active');
            
            // Hide all editors
            editorWrappers.forEach(wrapper => wrapper.style.display = 'none');
            
            // Show the corresponding editor
            const fileType = this.getAttribute('data-file');
            const fileName = this.getAttribute('data-filename');
            
            if (fileType === 'html') {
                document.getElementById('html-wrapper').style.display = 'flex';
                currentFile = { type: 'html', name: fileName };
                currentLanguage.textContent = 'HTML';
            } else if (fileType === 'css') {
                document.getElementById('css-wrapper').style.display = 'flex';
                currentFile = { type: 'css', name: fileName };
                currentLanguage.textContent = 'CSS';
            } else if (fileType === 'js') {
                document.getElementById('js-wrapper').style.display = 'flex';
                currentFile = { type: 'js', name: fileName };
                currentLanguage.textContent = 'JavaScript';
            }
        });
    });
}

// File tree item click event
function setupFileTreeEvents() {
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', function() {
            // Deactivate all file items
            document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
            
            // Activate clicked file item
            this.classList.add('active');
            
            // Get file info
            const fileType = this.getAttribute('data-file');
            const fileName = this.getAttribute('data-filename');
            
            // Check if a tab for this file already exists
            let tabExists = false;
            document.querySelectorAll('.tab').forEach(tab => {
                if (tab.getAttribute('data-filename') === fileName) {
                    // Activate this tab
                    tab.click();
                    tabExists = true;
                }
            });
            
            // If tab doesn't exist, create it
            if (!tabExists) {
                openFile(fileType, fileName);
            }
        });
    });
}

// Open file function - creates tabs and loads content
function openFile(fileType, fileName) {
    // Create new tab
    const newTab = document.createElement('div');
    newTab.className = `tab tab-${fileType}`;
    newTab.setAttribute('data-file', fileType);
    newTab.setAttribute('data-filename', fileName);
    newTab.innerHTML = `
        <i class="fab fa-${fileType === 'html' ? 'html5' : fileType === 'css' ? 'css3-alt' : 'js'}"></i>
        <span class="tab-filename">${fileName}</span>
        <span class="tab-close">×</span>
    `;
    
    // Add tab to tabs container
    tabsContainer.appendChild(newTab);
    
    // Setup tab click event
    newTab.addEventListener('click', function() {
        // Deactivate all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Activate this tab
        this.classList.add('active');
        
        // Hide all editors
        editorWrappers.forEach(wrapper => wrapper.style.display = 'none');
        
        // Show the corresponding editor
        if (fileType === 'html') {
            document.getElementById('html-wrapper').style.display = 'flex';
            currentFile = { type: 'html', name: fileName };
            currentLanguage.textContent = 'HTML';
            htmlEditor.textContent = fileContents.html[fileName] || fileTemplates.html;
        } else if (fileType === 'css') {
            document.getElementById('css-wrapper').style.display = 'flex';
            currentFile = { type: 'css', name: fileName };
            currentLanguage.textContent = 'CSS';
            cssEditor.textContent = fileContents.css[fileName] || fileTemplates.css;
        } else if (fileType === 'js') {
            document.getElementById('js-wrapper').style.display = 'flex';
            currentFile = { type: 'js', name: fileName };
            currentLanguage.textContent = 'JavaScript';
            jsEditor.textContent = fileContents.js[fileName] || fileTemplates.js;
        }
        
        // Highlight code
        highlightCurrentEditor();
    });
    
    // Setup tab close event
    newTab.querySelector('.tab-close').addEventListener('click', function(e) {
        e.stopPropagation();
        closeTab(newTab);
    });
    
    // Activate the new tab
    newTab.click();
}

// Close tab function
function closeTab(tabElement) {
    const fileType = tabElement.getAttribute('data-file');
    const fileName = tabElement.getAttribute('data-filename');
    
    // Remove tab
    tabsContainer.removeChild(tabElement);
    
    // If it was the active tab, activate another tab if available
    if (tabElement.classList.contains('active') && tabsContainer.children.length > 0) {
        tabsContainer.children[tabsContainer.children.length - 1].click();
    }
    
    // Show toast notification
    showToast(`Closed ${fileName}`, 'info');
}

// Function to create a new folder in the file explorer
function createFolder(folderName) {
    // Create folder item in explorer
    const folderItem = document.createElement('div');
    folderItem.className = 'file-item folder';
    folderItem.innerHTML = `
        <i class="fas fa-folder"></i>
        <span class="file-name">${folderName}</span>
        <div class="file-actions">
            <button class="file-action-btn file-rename" title="Rename">
                <i class="fas fa-edit"></i>
            </button>
            <button class="file-action-btn file-delete" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="folder-contents"></div>
    `;
    
    fileTree.appendChild(folderItem);
    
    // Store a reference to the folder contents container
    const folderContents = folderItem.querySelector('.folder-contents');
    folderContents.style.display = 'none';
    
    // Setup event listeners for folder
    folderItem.addEventListener('click', function(e) {
        // Only toggle if clicking the folder item itself, not its children
        if (e.target === this || e.target === this.querySelector('i') || e.target === this.querySelector('.file-name')) {
            // Toggle folder open/closed
            this.classList.toggle('open');
            
            if (this.classList.contains('open')) {
                this.querySelector('i').classList.remove('fa-folder');
                this.querySelector('i').classList.add('fa-folder-open');
                folderContents.style.display = 'block';
            } else {
                this.querySelector('i').classList.remove('fa-folder-open');
                this.querySelector('i').classList.add('fa-folder');
                folderContents.style.display = 'none';
            }
        }
    });
    
    // Add event listeners for rename and delete buttons
    folderItem.querySelector('.file-rename').addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Enter new folder name:', folderName);
        if (newName && newName.trim() && newName.trim() !== folderName) {
            folderItem.querySelector('.file-name').textContent = newName;
            showToast(`Renamed folder to ${newName}`, 'success');
        }
    });
    
    folderItem.querySelector('.file-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete folder ${folderName}?`)) {
            fileTree.removeChild(folderItem);
            showToast(`Deleted folder ${folderName}`, 'info');
        }
    });
    
    // Add ability to add files to this folder
    const addFileToFolderBtn = document.createElement('button');
    addFileToFolderBtn.className = 'file-action-btn add-file';
    addFileToFolderBtn.title = 'Add File';
    addFileToFolderBtn.innerHTML = '<i class="fas fa-plus"></i>';
    folderItem.querySelector('.file-actions').appendChild(addFileToFolderBtn);
    
    addFileToFolderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileName = prompt('Enter file name (with extension):');
        if (fileName && fileName.trim()) {
            // Determine file type from extension
            let fileType = 'js';
            if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
                fileType = 'html';
            } else if (fileName.endsWith('.css')) {
                fileType = 'css';
            }
            
            // Create file in this folder
            addFileToFolder(folderContents, fileType, fileName);
            
            // Open the folder if not already open
            if (!folderItem.classList.contains('open')) {
                folderItem.click();
            }
        }
    });
    
    showToast(`Created folder: ${folderName}`, 'success');
    return folderItem;
}

// Helper function to add a file to a folder
function addFileToFolder(folderContents, fileType, fileName) {
    // Create file item
    const fileItem = document.createElement('div');
    fileItem.className = `file-item file-${fileType}`;
    fileItem.setAttribute('data-file', fileType);
    fileItem.setAttribute('data-filename', fileName);
    fileItem.innerHTML = `
        <i class="fab fa-${fileType === 'html' ? 'html5' : fileType === 'css' ? 'css3-alt' : 'js'}"></i>
        <span class="file-name">${fileName}</span>
        <div class="file-actions">
            <button class="file-action-btn file-rename" title="Rename">
                <i class="fas fa-edit"></i>
            </button>
            <button class="file-action-btn file-delete" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    folderContents.appendChild(fileItem);
    
    // Add the same click event as other file items
    fileItem.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent folder from toggling
        
        // Deactivate all file items
        document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
        
        // Activate this file item
        this.classList.add('active');
        
        // Handle file opening
        const fileType = this.getAttribute('data-file');
        const fileName = this.getAttribute('data-filename');
        
        // Check if a tab for this file already exists
        let tabExists = false;
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.getAttribute('data-filename') === fileName) {
                tab.click();
                tabExists = true;
            }
        });
        
        // If tab doesn't exist, create it
        if (!tabExists) {
            // Add default content if file doesn't exist yet
            if (!fileContents[fileType][fileName]) {
                fileContents[fileType][fileName] = fileTemplates[fileType];
            }
            
            openFile(fileType, fileName);
        }
    });
    
    // Add event listeners for file actions
    fileItem.querySelector('.file-rename').addEventListener('click', (e) => {
        e.stopPropagation();
        const oldName = fileName;
        const newName = prompt('Enter new file name:', oldName);
        if (newName && newName.trim() && newName.trim() !== oldName) {
            // Update data attributes
            fileItem.setAttribute('data-filename', newName);
            fileItem.querySelector('.file-name').textContent = newName;
            
            // Update file contents if opened
            if (fileContents[fileType][oldName]) {
                fileContents[fileType][newName] = fileContents[fileType][oldName];
                delete fileContents[fileType][oldName];
            }
            
            showToast(`Renamed file to ${newName}`, 'success');
        }
    });
    
    fileItem.querySelector('.file-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete file ${fileName}?`)) {
            // Remove file from folder
            folderContents.removeChild(fileItem);
            
            // Remove any open tabs
            document.querySelectorAll('.tab').forEach(tab => {
                if (tab.getAttribute('data-filename') === fileName) {
                    closeTab(tab);
                }
            });
            
            // Delete from file contents
            if (fileContents[fileType][fileName]) {
                delete fileContents[fileType][fileName];
            }
            
            showToast(`Deleted file ${fileName}`, 'info');
        }
    });
    
    return fileItem;
}

// Function to update the preview
function updatePreview() {
    // Get all file contents
    const htmlContent = currentFile.type === 'html' ? htmlEditor.textContent : fileContents.html['index.html'];
    const cssContent = currentFile.type === 'css' ? cssEditor.textContent : fileContents.css['style.css'];
    const jsContent = currentFile.type === 'js' ? jsEditor.textContent : fileContents.js['script.js'];
    
    // Update current file content in storage
    fileContents[currentFile.type][currentFile.name] = 
        currentFile.type === 'html' ? htmlEditor.textContent : 
        currentFile.type === 'css' ? cssEditor.textContent : 
        jsEditor.textContent;
    
    // Create a blob with the combined content
    const blob = new Blob([
        `<html>
        <head>
            <style>${cssContent}</style>
        </head>
        <body>
            ${htmlContent}
            <script>${jsContent}</script>
        </body>
        </html>`
    ], {type: 'text/html'});
    
    // Set the preview iframe src to the blob
    previewFrame.src = URL.createObjectURL(blob);
    
    // Show toast notification
    showToast('Preview updated', 'success');
}

// Function to highlight code
function highlightCurrentEditor() {
    if (typeof Prism !== 'undefined') {
        if (currentFile.type === 'html') {
            Prism.highlightElement(htmlEditor);
        } else if (currentFile.type === 'css') {
            Prism.highlightElement(cssEditor);
        } else if (currentFile.type === 'js') {
            Prism.highlightElement(jsEditor);
        }
    }
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 
                'fa-info-circle'
            }"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show the toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Add close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Modal functions
function openModal(modalElement) {
    modalElement.classList.add('active');
}

function closeModal(modalElement) {
    modalElement.classList.remove('active');
}

// Setup event listeners
function setupEventListeners() {
    // Run button
    runButton.addEventListener('click', updatePreview);
    
    // Refresh preview button
    refreshPreviewBtn.addEventListener('click', updatePreview);
    
    // Clear console button
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
        showToast('Console cleared', 'info');
    });
    
    // Console input
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const code = consoleInput.value.trim();
            if (code) {
                // Add the command to console
                const commandLine = document.createElement('div');
                commandLine.className = 'console-line console-log';
                commandLine.innerHTML = `<span>> ${code}</span>`;
                consoleOutput.appendChild(commandLine);
                
                // Clear the input
                consoleInput.value = '';
                
                // Try to execute and show result
                try {
                    const result = eval(code);
                    if (result !== undefined) {
                        const resultLine = document.createElement('div');
                        resultLine.className = 'console-line console-log';
                        resultLine.innerHTML = `<span>< ${result}</span>`;
                        consoleOutput.appendChild(resultLine);
                    }
                } catch (error) {
                    const errorLine = document.createElement('div');
                    errorLine.className = 'console-line console-error';
                    errorLine.innerHTML = `<span>< Error: ${error.message}</span>`;
                    consoleOutput.appendChild(errorLine);
                }
                
                // Scroll to bottom
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Update icon
        if (document.body.classList.contains('light-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        showToast('Theme switched', 'info');
    });
    
    // Save button
    saveBtn.addEventListener('click', () => {
        // Update current file content in storage
        fileContents[currentFile.type][currentFile.name] = 
            currentFile.type === 'html' ? htmlEditor.textContent : 
            currentFile.type === 'css' ? cssEditor.textContent : 
            jsEditor.textContent;
            
        showToast(`${currentFile.name} saved successfully`, 'success');
    });
    
    // Format button
    formatBtn.addEventListener('click', () => {
        // Basic formatting - you can expand this with proper formatting libraries
        if (currentFile.type === 'html') {
            // Very simple HTML formatting
            const formatted = htmlEditor.textContent
                .replace(/>\s+</g, '>\n<')
                .replace(/\n\s+/g, '\n  ');
            htmlEditor.textContent = formatted;
        } else if (currentFile.type === 'css') {
            // Very simple CSS formatting
            const formatted = cssEditor.textContent
                .replace(/\s*{\s*/g, ' {\n  ')
                .replace(/;\s*/g, ';\n  ')
                .replace(/\s*}\s*/g, '\n}\n\n');
            cssEditor.textContent = formatted;
        } else if (currentFile.type === 'js') {
            // Very simple JS formatting
            const formatted = jsEditor.textContent
                .replace(/{\s*/g, ' {\n  ')
                .replace(/;\s*/g, ';\n  ')
                .replace(/}\s*/g, '\n}\n\n');
            jsEditor.textContent = formatted;
        }
        
        // Highlight code
        highlightCurrentEditor();
        showToast('Code formatted', 'success');
    });
    
    // Modal close buttons
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal-overlay'));
        });
    });
    
    // New file button
    newFileBtn.addEventListener('click', () => {
        openModal(newFileModal);
        newFilename.focus();
    });
    
    // New folder button
    newFolderBtn.addEventListener('click', () => {
        // Simple prompt for folder name
        const folderName = prompt('Enter folder name:');
        if (folderName && folderName.trim()) {
            createFolder(folderName.trim());
        }
    });
    
    // Create new file button
    createNewFileBtn.addEventListener('click', () => {
        const fileName = newFilename.value.trim();
        const fileType = newFiletype.value;
        
        if (fileName) {
            // Check if file already exists
            if (fileContents[fileType][fileName]) {
                showToast(`File ${fileName} already exists`, 'error');
            } else {
                // Add to file contents
                fileContents[fileType][fileName] = fileTemplates[fileType];
                
                // Create file item in explorer
                const fileItem = document.createElement('div');
                fileItem.className = `file-item file-${fileType}`;
                fileItem.setAttribute('data-file', fileType);
                fileItem.setAttribute('data-filename', fileName);
                fileItem.innerHTML = `
                    <i class="fab fa-${fileType === 'html' ? 'html5' : fileType === 'css' ? 'css3-alt' : 'js'}"></i>
                    <span class="file-name">${fileName}</span>
                    <div class="file-actions">
                        <button class="file-action-btn file-rename" title="Rename">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="file-action-btn file-delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                fileTree.appendChild(fileItem);
                
                // Setup event listener for the new file item
                fileItem.addEventListener('click', function() {
                    document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    const fileType = this.getAttribute('data-file');
                    const fileName = this.getAttribute('data-filename');
                    
                    let tabExists = false;
                    document.querySelectorAll('.tab').forEach(tab => {
                        if (tab.getAttribute('data-filename') === fileName) {
                            tab.click();
                            tabExists = true;
                        }
                    });
                    
                    if (!tabExists) {
                        openFile(fileType, fileName);
                    }
                });
                
                // Open the new file
                openFile(fileType, fileName);
                
                // Reset and close modal
                newFilename.value = '';
                closeModal(newFileModal);
                
                showToast(`Created new file: ${fileName}`, 'success');
            }
        } else {
            showToast('Please enter a valid file name', 'warning');
        }
    });
    
    // Cancel new file button
    cancelNewFileBtn.addEventListener('click', () => {
        newFilename.value = '';
        closeModal(newFileModal);
    });
}

// Initialize the application
function init() {
    // Setup events for tabs and file tree
    setupTabEvents();
    setupFileTreeEvents();
    setupEventListeners();
    
    // Initialize with default HTML tab active
    document.querySelector('.tab[data-file="html"]').click();
    
    // Initial preview update
    updatePreview();
    
    // Load Prism.js for syntax highlighting if available
    if (typeof Prism !== 'undefined') {
        highlightCurrentEditor();
    } else {
        // Dynamically load Prism if not available
        const prismCss = document.createElement('link');
        prismCss.rel = 'stylesheet';
        prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css';
        document.head.appendChild(prismCss);
        
        const prismJs = document.createElement('script');
        prismJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
        document.head.appendChild(prismJs);
        
        const prismHtml = document.createElement('script');
        prismHtml.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-markup.min.js';
        document.head.appendChild(prismHtml);
        
        const prismCssLang = document.createElement('script');
        prismCssLang.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-css.min.js';
        document.head.appendChild(prismCssLang);
        
        const prismJs2 = document.createElement('script');
        prismJs2.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-javascript.min.js';
        document.head.appendChild(prismJs2);
        
        prismJs.onload = () => {
            setTimeout(highlightCurrentEditor, 500);
        };
    }
    
    // Load Font Awesome if not available
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    showToast('CodeStudio Pro initialized successfully', 'success');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
