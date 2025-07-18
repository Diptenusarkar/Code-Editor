// DOM Elements
const tabElements = document.querySelectorAll('.tab');
const fileItems = document.querySelectorAll('.file-item');
const editorWrappers = document.querySelectorAll('.editor-wrapper');
const themeToggle = document.getElementById('theme-toggle');
const saveBtn = document.getElementById('save-btn');
const formatBtn = document.getElementById('format-btn');
const resetBtn = document.getElementById('reset-btn');
const clearConsoleBtn = document.getElementById('clear-console');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const autoReloadToggle = document.getElementById('auto-reload-toggle');
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

// Reset modal elements
const resetModal = document.getElementById('reset-modal');
const confirmResetBtn = document.getElementById('confirm-reset');
const downloadAndResetBtn = document.getElementById('download-and-reset');
const cancelResetBtn = document.getElementById('cancel-reset');

// Download modal elements
const downloadModal = document.getElementById('download-modal');
const closeDownloadModal = document.getElementById('close-download-modal');
const modalDownloadCurrent = document.getElementById('modal-download-current');
const modalDownloadZip = document.getElementById('modal-download-zip');
const modalDownloadProject = document.getElementById('modal-download-project');
const downloadProgress = document.getElementById('download-progress');
const progressTitle = document.getElementById('progress-title');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

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
            // Save content of currently active tab before switching
            const currentActiveTab = document.querySelector('.tab.active');
            if (currentActiveTab && currentFile) {
                const currentEditor = 
                    currentFile.type === 'html' ? htmlEditor :
                    currentFile.type === 'css' ? cssEditor : jsEditor;
                fileContents[currentFile.type][currentFile.name] = currentEditor.textContent;
            }
            
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

// Function to setup all event listeners for a file item
function setupFileItemEvents(fileItem, fileType, fileName) {
    // Main click event to open file
    fileItem.addEventListener('click', function(e) {
        // Don't trigger if clicking action buttons
        if (e.target.closest('.file-actions')) {
            return;
        }
        
        // Deactivate all file items
        document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
        
        // Activate this file item
        this.classList.add('active');
        
        // Get current file info
        const currentFileType = this.getAttribute('data-file');
        const currentFileName = this.getAttribute('data-filename');
        
        // Check if a tab for this file already exists
        let tabExists = false;
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.getAttribute('data-filename') === currentFileName) {
                tab.click();
                tabExists = true;
            }
        });
        
        // If tab doesn't exist, create it
        if (!tabExists) {
            // Ensure file content exists
            if (!fileContents[currentFileType][currentFileName]) {
                fileContents[currentFileType][currentFileName] = fileTemplates[currentFileType];
            }
            
            openFile(currentFileType, currentFileName);
        }
    });
    
    // Rename functionality
    const renameBtn = fileItem.querySelector('.file-rename');
    if (renameBtn) {
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const oldName = fileName;
            const newName = prompt('Enter new file name (with extension):', oldName);
            if (newName && newName.trim() && newName.trim() !== oldName) {
                const trimmedNewName = newName.trim();
                
                // Check if filename has an extension
                if (!trimmedNewName.includes('.')) {
                    showToast('File name must include an extension (e.g., .html, .css, .js)', 'error');
                    return;
                }
                
                // Determine new file type from extension
                let newFileType = fileType;
                if (trimmedNewName.endsWith('.html') || trimmedNewName.endsWith('.htm')) {
                    newFileType = 'html';
                } else if (trimmedNewName.endsWith('.css')) {
                    newFileType = 'css';
                } else if (trimmedNewName.endsWith('.js') || trimmedNewName.endsWith('.mjs')) {
                    newFileType = 'js';
                } else {
                    showToast('Unsupported file type. Please use .html, .css, or .js extensions.', 'error');
                    return;
                }
                
                // Update data attributes
                fileItem.setAttribute('data-filename', trimmedNewName);
                fileItem.setAttribute('data-file', newFileType);
                fileItem.querySelector('.file-name').textContent = trimmedNewName;
                
                // Update file icon if type changed
                if (newFileType !== fileType) {
                    const iconElement = fileItem.querySelector('i');
                    iconElement.className = `fab fa-${newFileType === 'html' ? 'html5' : newFileType === 'css' ? 'css3-alt' : 'js'}`;
                    fileItem.className = `file-item file-${newFileType}`;
                }
                
                // Update file contents if opened
                if (fileContents[fileType][oldName]) {
                    // Move content to new file type and name
                    if (!fileContents[newFileType]) {
                        fileContents[newFileType] = {};
                    }
                    fileContents[newFileType][trimmedNewName] = fileContents[fileType][oldName];
                    delete fileContents[fileType][oldName];
                }
                
                showToast(`Renamed file to ${trimmedNewName}`, 'success');
            }
        });
    }
    
    // Delete functionality
    const deleteBtn = fileItem.querySelector('.file-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete file ${fileName}?`)) {
                // Remove file from tree
                fileItem.remove();
                
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
                
                showToast(`Deleted file: ${fileName}`, 'success');
            }
        });
    }
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
        <div class="folder-header">
            <i class="fas fa-folder"></i>
            <span class="file-name">${folderName}</span>
            <span class="folder-badge">0</span>
            <div class="file-actions">
                <button class="file-action-btn file-rename" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="file-action-btn file-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="folder-contents"></div>
    `;
    
    fileTree.appendChild(folderItem);
    
    // Store a reference to the folder contents container
    const folderContents = folderItem.querySelector('.folder-contents');
    folderContents.style.display = 'none';
    
    // Setup event listeners for folder
    folderItem.addEventListener('click', function(e) {
        // Only toggle if clicking the folder header or its direct children
        const folderHeader = this.querySelector('.folder-header');
        if (e.target === this || folderHeader.contains(e.target)) {
            // Don't toggle if clicking action buttons
            if (e.target.closest('.file-actions')) {
                return;
            }
            
            // Toggle folder open/closed
            this.classList.toggle('open');
            
            if (this.classList.contains('open')) {
                this.querySelector('i').classList.remove('fa-folder');
                this.querySelector('i').classList.add('fa-folder-open');
                folderContents.style.display = 'flex'; // Use flex for vertical stacking
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
        const newName = prompt('Enter new folder name (no extension):', folderName);
        if (newName && newName.trim() && newName.trim() !== folderName) {
            const trimmedName = newName.trim();
            
            // Check if the name contains a file extension
            if (trimmedName.includes('.')) {
                showToast('Folder names cannot contain extensions. Please enter a valid folder name.', 'error');
                return;
            }
            
            // Check if folder name is valid
            if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
                showToast('Folder name can only contain letters, numbers, underscores, and hyphens.', 'error');
                return;
            }
            
            folderItem.querySelector('.file-name').textContent = trimmedName;
            showToast(`Renamed folder to ${trimmedName}`, 'success');
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
    folderItem.querySelector('.folder-header .file-actions').appendChild(addFileToFolderBtn);
    
    addFileToFolderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileName = prompt('Enter file name (with extension, e.g., app.js, style.css):');
        if (fileName && fileName.trim()) {
            const trimmedFileName = fileName.trim();
            
            // Check if filename has an extension
            if (!trimmedFileName.includes('.')) {
                showToast('File name must include an extension (e.g., .html, .css, .js)', 'error');
                return;
            }
            
            // Determine file type from extension
            let fileType = 'js';
            if (trimmedFileName.endsWith('.html') || trimmedFileName.endsWith('.htm')) {
                fileType = 'html';
            } else if (trimmedFileName.endsWith('.css')) {
                fileType = 'css';
            } else if (trimmedFileName.endsWith('.js') || trimmedFileName.endsWith('.mjs')) {
                fileType = 'js';
            } else {
                showToast('Unsupported file type. Please use .html, .css, or .js extensions.', 'error');
                return;
            }
            
            // Create file in this folder
            addFileToFolder(folderContents, fileType, trimmedFileName);
            
            // Open the folder if not already open
            if (!folderItem.classList.contains('open')) {
                folderItem.click();
            }
            
            // Update the badge count
            const fileCount = folderContents.querySelectorAll('.file-item').length;
            folderItem.querySelector('.folder-header .folder-badge').textContent = fileCount;
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
    
    // Add default content if file doesn't exist yet
    if (!fileContents[fileType][fileName]) {
        fileContents[fileType][fileName] = fileTemplates[fileType];
    }
    
    // Setup all event listeners using the new function
    setupFileItemEvents(fileItem, fileType, fileName);
    
    // Activate the new file and open it immediately
    document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
    fileItem.classList.add('active');
    openFile(fileType, fileName);
    
    // Update parent folder badge
    const parentFolder = folderContents.closest('.folder');
    if (parentFolder) {
        const fileCount = folderContents.querySelectorAll('.file-item').length;
        parentFolder.querySelector('.folder-badge').textContent = fileCount;
    }
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
    
    // Save button - open download modal
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(downloadModal);
        resetDownloadModal();
    });

    // Reset button - open reset confirmation modal
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(resetModal);
    });

    // Close download modal
    closeDownloadModal.addEventListener('click', () => {
        closeModal(downloadModal);
    });

    // Download modal options
    modalDownloadCurrent.addEventListener('click', async () => {
        await handleDownloadWithProgress('current');
    });

    modalDownloadZip.addEventListener('click', async () => {
        await handleDownloadWithProgress('zip');
    });

    modalDownloadProject.addEventListener('click', async () => {
        await handleDownloadWithProgress('project');
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
        const folderName = prompt('Enter folder name (no extension):');
        if (folderName && folderName.trim()) {
            const trimmedName = folderName.trim();
            
            // Check if the name contains a file extension
            if (trimmedName.includes('.')) {
                showToast('Folder names cannot contain extensions. Please enter a valid folder name.', 'error');
                return;
            }
            
            // Check if folder name is valid (no special characters except underscore and hyphen)
            if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
                showToast('Folder name can only contain letters, numbers, underscores, and hyphens.', 'error');
                return;
            }
            
            createFolder(trimmedName);
        }
    });
    
    // Create new file button
    createNewFileBtn.addEventListener('click', () => {
        const fileName = newFilename.value.trim();
        const fileType = newFiletype.value;
        
        if (fileName) {
            // Check if filename has proper extension
            const validExtensions = {
                'html': ['.html', '.htm'],
                'css': ['.css'],
                'js': ['.js', '.mjs']
            };
            
            const hasValidExtension = validExtensions[fileType].some(ext => 
                fileName.toLowerCase().endsWith(ext)
            );
            
            if (!hasValidExtension) {
                const expectedExts = validExtensions[fileType].join(', ');
                showToast(`File must have a valid ${fileType.toUpperCase()} extension: ${expectedExts}`, 'error');
                return;
            }
            
            // Check if file already exists
            if (fileContents[fileType][fileName]) {
                showToast(`File ${fileName} already exists`, 'error');
            } else {
                // Add to file contents with template
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
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="file-action-btn file-delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                fileTree.appendChild(fileItem);
                
                // Setup complete event listeners for the new file
                setupFileItemEvents(fileItem, fileType, fileName);
                
                // Deactivate all other file items and activate the new one
                document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
                fileItem.classList.add('active');
                
                // Open the new file immediately
                openFile(fileType, fileName);
                
                // Reset and close modal
                newFilename.value = '';
                closeModal(newFileModal);
                
                showToast(`Created and opened: ${fileName}`, 'success');
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

    // Reset modal event listeners
    cancelResetBtn.addEventListener('click', () => {
        closeModal(resetModal);
    });

    confirmResetBtn.addEventListener('click', () => {
        performReset();
        closeModal(resetModal);
    });

    downloadAndResetBtn.addEventListener('click', async () => {
        // Download current work first
        try {
            await handleDownloadWithProgress('zip');
            showToast('Download completed! Now resetting editor...', 'success');
            setTimeout(() => {
                performReset();
                closeModal(resetModal);
            }, 1000);
        } catch (error) {
            showToast('Download failed. Resetting anyway...', 'warning');
            performReset();
            closeModal(resetModal);
        }
    });
}

// Auto-reload functionality
let autoReloadEnabled = false;
let autoReloadTimeout = null;
const AUTO_RELOAD_DELAY = 1000; // 1 second delay after last change

// Function to handle auto-reload toggle
function toggleAutoReload() {
    autoReloadEnabled = !autoReloadEnabled;
    
    if (autoReloadEnabled) {
        autoReloadToggle.classList.add('active');
        showToast('Auto-reload enabled', 'success');
    } else {
        autoReloadToggle.classList.remove('active');
        if (autoReloadTimeout) {
            clearTimeout(autoReloadTimeout);
            autoReloadTimeout = null;
        }
        showToast('Auto-reload disabled', 'info');
    }
}

// Function to trigger auto-reload with debouncing
function triggerAutoReload() {
    if (!autoReloadEnabled) return;
    
    // Clear existing timeout
    if (autoReloadTimeout) {
        clearTimeout(autoReloadTimeout);
    }
    
    // Set new timeout
    autoReloadTimeout = setTimeout(() => {
        updatePreview();
    }, AUTO_RELOAD_DELAY);
}

// Function to setup auto-reload event listeners
function setupAutoReloadListeners() {
    // Add auto-reload toggle event listener
    autoReloadToggle.addEventListener('click', toggleAutoReload);
    
    // Add input event listeners to all editors for auto-reload
    htmlEditor.addEventListener('input', () => {
        // Save content to fileContents
        if (currentFile.type === 'html') {
            fileContents.html[currentFile.name] = htmlEditor.textContent;
        }
        triggerAutoReload();
    });
    
    cssEditor.addEventListener('input', () => {
        // Save content to fileContents
        if (currentFile.type === 'css') {
            fileContents.css[currentFile.name] = cssEditor.textContent;
        }
        triggerAutoReload();
    });
    
    jsEditor.addEventListener('input', () => {
        // Save content to fileContents
        if (currentFile.type === 'js') {
            fileContents.js[currentFile.name] = jsEditor.textContent;
        }
        triggerAutoReload();
    });
    
    // Also listen for paste and cut events
    [htmlEditor, cssEditor, jsEditor].forEach((editor, index) => {
        const editorType = index === 0 ? 'html' : index === 1 ? 'css' : 'js';
        
        editor.addEventListener('paste', () => {
            // Small delay to ensure content is pasted
            setTimeout(() => {
                // Save content to fileContents
                if (currentFile.type === editorType) {
                    fileContents[currentFile.type][currentFile.name] = editor.textContent;
                }
                triggerAutoReload();
            }, 100);
        });

        editor.addEventListener('cut', () => {
            // Save content to fileContents
            if (currentFile.type === editorType) {
                fileContents[currentFile.type][currentFile.name] = editor.textContent;
            }
            triggerAutoReload();
        });
    });
}

// Reset functionality
function performReset() {
    // Define clean template content
    const cleanTemplate = {
        html: {
            'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Your New Project</h1>
        <p>Start building something amazing!</p>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`
        },
        css: {
            'style.css': `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}

p {
    font-size: 18px;
    color: #666;
}`
        },
        js: {
            'script.js': `// Your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Project initialized!');
    
    // Add your code here
});`
        }
    };

    // Clear all current content
    fileContents.html = {};
    fileContents.css = {};
    fileContents.js = {};

    // Set clean template content
    Object.assign(fileContents, cleanTemplate);

    // Clear the file tree and recreate with default files
    fileTree.innerHTML = `
        <div class="file-item file-html active" data-file="html" data-filename="index.html">
            <i class="fab fa-html5"></i>
            <span class="file-name">index.html</span>
            <div class="file-actions">
                <button class="file-action-btn file-rename" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="file-action-btn file-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="file-item file-css" data-file="css" data-filename="style.css">
            <i class="fab fa-css3-alt"></i>
            <span class="file-name">style.css</span>
            <div class="file-actions">
                <button class="file-action-btn file-rename" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="file-action-btn file-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="file-item file-js" data-file="js" data-filename="script.js">
            <i class="fab fa-js"></i>
            <span class="file-name">script.js</span>
            <div class="file-actions">
                <button class="file-action-btn file-rename" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="file-action-btn file-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    // Reset tabs
    tabsContainer.innerHTML = `
        <div class="tab tab-html active" data-file="html" data-filename="index.html">
            <i class="fab fa-html5"></i>
            <span class="tab-filename">index.html</span>
            <span class="tab-close">×</span>
        </div>
        <div class="tab tab-css" data-file="css" data-filename="style.css">
            <i class="fab fa-css3-alt"></i>
            <span class="tab-filename">style.css</span>
            <span class="tab-close">×</span>
        </div>
        <div class="tab tab-js" data-file="js" data-filename="script.js">
            <i class="fab fa-js"></i>
            <span class="tab-filename">script.js</span>
            <span class="tab-close">×</span>
        </div>
    `;

    // Update editor content
    htmlEditor.textContent = cleanTemplate.html['index.html'];
    cssEditor.textContent = cleanTemplate.css['style.css'];
    jsEditor.textContent = cleanTemplate.js['script.js'];

    // Set current file to index.html
    currentFile = { type: 'html', name: 'index.html' };

    // Show HTML editor
    document.querySelectorAll('.editor-wrapper').forEach(wrapper => wrapper.style.display = 'none');
    document.getElementById('html-wrapper').style.display = 'block';

    // Re-setup event listeners for new elements
    setupTabEvents();
    setupFileTreeEvents();

    // Clear console
    consoleOutput.innerHTML = '<div class="console-line console-log"><span>> Editor reset complete</span></div>';

    // Update preview
    updatePreview();

    // Highlight syntax
    highlightCurrentEditor();

    showToast('Editor reset successfully! Starting fresh with a clean template.', 'success');
}

// Initialize the application
function init() {
    // Setup events for tabs and file tree
    setupTabEvents();
    setupFileTreeEvents();
    setupEventListeners();
    setupAutoReloadListeners();
    
    // Initialize with default HTML tab active
    document.querySelector('.tab[data-file="html"]').click();
    
    // Initial preview update
    updatePreview();
    
    // Load GitHub stats
    loadGitHubStats();
    
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
    
    showToast('HTML.ORG.IN Code Editor initialized successfully', 'success');
}

// Function to load GitHub repository stats
async function loadGitHubStats() {
    // Configuration - Your actual GitHub repository
    const GITHUB_USERNAME = 'Diptenusarkar'; // Your GitHub username
    const GITHUB_REPO = 'html.org.in'; // Your repository name
    
    const starCountElement = document.getElementById('star-count');
    const forkCountElement = document.getElementById('fork-count');
    
    try {
        // GitHub API endpoint for repository information
        const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;
        
        // Fetch repository data
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            const repoData = await response.json();
            
            // Update star count
            if (starCountElement) {
                const starCount = repoData.stargazers_count;
                starCountElement.textContent = formatCount(starCount);
                starCountElement.title = `${starCount} stars`;
            }
            
            // Update fork count
            if (forkCountElement) {
                const forkCount = repoData.forks_count;
                forkCountElement.textContent = formatCount(forkCount);
                forkCountElement.title = `${forkCount} forks`;
            }
            
            // Add animation to show the numbers loaded
            [starCountElement, forkCountElement].forEach(element => {
                if (element && element.textContent !== '...') {
                    element.style.animation = 'countUp 0.5s ease-out';
                }
            });
            
        } else {
            // Fallback for API errors or rate limiting
            console.warn('GitHub API request failed:', response.status);
            setFallbackCounts();
        }
    } catch (error) {
        console.warn('Error loading GitHub stats:', error);
        setFallbackCounts();
    }
}

// Function to format large numbers (e.g., 1.2k, 3.4k, etc.)
function formatCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    } else {
        return count.toString();
    }
}

// Fallback function to show placeholder counts
function setFallbackCounts() {
    const starCountElement = document.getElementById('star-count');
    const forkCountElement = document.getElementById('fork-count');
    
    if (starCountElement) {
        starCountElement.textContent = '★';
        starCountElement.title = 'Star this project on GitHub';
    }
    
    if (forkCountElement) {
        forkCountElement.textContent = '⑂';
        forkCountElement.title = 'Fork this project on GitHub';
    }
}

// Function to reset download modal to initial state
function resetDownloadModal() {
    downloadProgress.style.display = 'none';
    document.querySelector('.download-options').style.display = 'block';
    document.querySelector('.sponsor-section').style.display = 'block';
    progressFill.style.width = '0%';
}

// Function to show download progress
function showDownloadProgress(title, text) {
    document.querySelector('.download-options').style.display = 'none';
    document.querySelector('.sponsor-section').style.display = 'none';
    downloadProgress.style.display = 'block';
    progressTitle.textContent = title;
    progressText.textContent = text;
}

// Function to update progress bar
function updateProgress(percentage) {
    progressFill.style.width = percentage + '%';
}

// Function to handle downloads with progress animation
async function handleDownloadWithProgress(type) {
    try {
        switch(type) {
            case 'current':
                showDownloadProgress('Preparing file...', 'Getting your current file ready');
                updateProgress(30);
                
                await new Promise(resolve => setTimeout(resolve, 500));
                updateProgress(70);
                
                const currentEditor = 
                    currentFile.type === 'html' ? htmlEditor :
                    currentFile.type === 'css' ? cssEditor : jsEditor;
                
                fileContents[currentFile.type][currentFile.name] = currentEditor.textContent;
                updateProgress(90);
                
                await new Promise(resolve => setTimeout(resolve, 300));
                downloadFile(currentFile.name, currentEditor.textContent, currentFile.type);
                updateProgress(100);
                
                setTimeout(() => {
                    showSuccessAndClose(`${currentFile.name} downloaded successfully!`);
                }, 500);
                break;
                
            case 'zip':
                showDownloadProgress('Creating ZIP archive...', 'Bundling all your files together');
                updateProgress(20);
                
                await new Promise(resolve => setTimeout(resolve, 500));
                updateProgress(50);
                progressText.textContent = 'Compressing files...';
                
                await downloadAllFiles();
                updateProgress(100);
                
                setTimeout(() => {
                    showSuccessAndClose('ZIP file created and downloaded!');
                }, 500);
                break;
                
            case 'project':
                showDownloadProgress('Building complete project...', 'Combining HTML, CSS, and JavaScript');
                updateProgress(25);
                
                await new Promise(resolve => setTimeout(resolve, 500));
                updateProgress(60);
                progressText.textContent = 'Embedding styles and scripts...';
                
                await new Promise(resolve => setTimeout(resolve, 500));
                updateProgress(85);
                
                downloadCompleteProject();
                updateProgress(100);
                
                setTimeout(() => {
                    showSuccessAndClose('Complete project downloaded!');
                }, 500);
                break;
        }
    } catch (error) {
        showErrorAndClose('Download failed. Please try again.');
    }
}

// Function to show success message and close modal
function showSuccessAndClose(message) {
    progressTitle.innerHTML = '<i class="fas fa-check-circle" style="color: var(--accent-green);"></i> Success!';
    progressText.textContent = message;
    progressFill.style.background = 'var(--accent-green)';
    
    downloadProgress.classList.add('download-success');
    
    setTimeout(() => {
        closeModal(downloadModal);
        showToast(message, 'success');
        downloadProgress.classList.remove('download-success');
        progressFill.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))';
    }, 2000);
}

// Function to show error message and close modal
function showErrorAndClose(message) {
    progressTitle.innerHTML = '<i class="fas fa-exclamation-circle" style="color: var(--accent-red);"></i> Error';
    progressText.textContent = message;
    progressFill.style.background = 'var(--accent-red)';
    
    setTimeout(() => {
        closeModal(downloadModal);
        showToast(message, 'error');
        progressFill.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))';
    }, 2000);
}

// Function to download file content
function downloadFile(filename, content, fileType) {
    // Create a blob with the file content
    const blob = new Blob([content], { 
        type: getContentType(fileType) 
    });
    
    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
}

// Function to download all files as a ZIP archive
async function downloadAllFiles() {
    try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            showToast('ZIP library not loaded. Downloading files individually...', 'warning');
            downloadAllFilesIndividually();
            return;
        }

        // Update current file content first
        const currentEditor = 
            currentFile.type === 'html' ? htmlEditor :
            currentFile.type === 'css' ? cssEditor : jsEditor;
        fileContents[currentFile.type][currentFile.name] = currentEditor.textContent;

        // Create a new ZIP file
        const zip = new JSZip();
        let hasFiles = false;

        // Add HTML files to ZIP
        Object.keys(fileContents.html).forEach(fileName => {
            const content = fileContents.html[fileName];
            if (content && content.trim()) {
                zip.file(fileName, content);
                hasFiles = true;
            }
        });

        // Add CSS files to ZIP
        Object.keys(fileContents.css).forEach(fileName => {
            const content = fileContents.css[fileName];
            if (content && content.trim()) {
                zip.file(fileName, content);
                hasFiles = true;
            }
        });

        // Add JavaScript files to ZIP
        Object.keys(fileContents.js).forEach(fileName => {
            const content = fileContents.js[fileName];
            if (content && content.trim()) {
                zip.file(fileName, content);
                hasFiles = true;
            }
        });

        if (!hasFiles) {
            showToast('No files to download', 'warning');
            return;
        }

        // Generate ZIP file
        showToast('Creating ZIP file...', 'info');
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        });

        // Download the ZIP file
        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'html-org-in-project.zip';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error creating ZIP file:', error);
        showToast('Error creating ZIP. Downloading files individually...', 'error');
        downloadAllFilesIndividually();
    }
}

// Fallback function to download files individually
function downloadAllFilesIndividually() {
    // Update current file content first
    const currentEditor = 
        currentFile.type === 'html' ? htmlEditor :
        currentFile.type === 'css' ? cssEditor : jsEditor;
    fileContents[currentFile.type][currentFile.name] = currentEditor.textContent;

    let downloadCount = 0;

    // Download each file type
    Object.keys(fileContents).forEach(fileType => {
        Object.keys(fileContents[fileType]).forEach(fileName => {
            const content = fileContents[fileType][fileName];
            if (content && content.trim()) {
                // Small delay between downloads to prevent browser blocking
                setTimeout(() => {
                    downloadFile(fileName, content, fileType);
                }, downloadCount * 300);
                downloadCount++;
            }
        });
    });
}

// Function to download complete project as single HTML file
function downloadCompleteProject() {
    // Update current file content first
    const currentEditor = 
        currentFile.type === 'html' ? htmlEditor :
        currentFile.type === 'css' ? cssEditor : jsEditor;
    fileContents[currentFile.type][currentFile.name] = currentEditor.textContent;

    // Get the main HTML content
    let htmlContent = fileContents.html['index.html'] || htmlEditor.textContent;
    
    // Get CSS content
    const cssFiles = Object.keys(fileContents.css);
    let allCSS = '';
    cssFiles.forEach(fileName => {
        const content = fileContents.css[fileName];
        if (content && content.trim()) {
            allCSS += `/* ${fileName} */\n${content}\n\n`;
        }
    });

    // Get JavaScript content
    const jsFiles = Object.keys(fileContents.js);
    let allJS = '';
    jsFiles.forEach(fileName => {
        const content = fileContents.js[fileName];
        if (content && content.trim()) {
            allJS += `/* ${fileName} */\n${content}\n\n`;
        }
    });

    // Create complete HTML with embedded CSS and JS
    let completeHTML = htmlContent;
    
    // Embed CSS
    if (allCSS.trim()) {
        const cssTag = `<style>\n${allCSS}</style>`;
        if (completeHTML.includes('</head>')) {
            completeHTML = completeHTML.replace('</head>', `${cssTag}\n</head>`);
        } else {
            completeHTML = `<style>\n${allCSS}</style>\n${completeHTML}`;
        }
    }
    
    // Embed JavaScript
    if (allJS.trim()) {
        const jsTag = `<script>\n${allJS}\n</script>`;
        if (completeHTML.includes('</body>')) {
            completeHTML = completeHTML.replace('</body>', `${jsTag}\n</body>`);
        } else {
            completeHTML = `${completeHTML}\n<script>\n${allJS}\n</script>`;
        }
    }

    // Download the complete project
    downloadFile('complete-project.html', completeHTML, 'html');
}

// Helper function to get the correct MIME type
function getContentType(fileType) {
    switch(fileType) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'text/javascript';
        default:
            return 'text/plain';
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
