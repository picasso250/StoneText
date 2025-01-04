// Initialize CodeMirror Editor
const textArea = document.getElementById('textInput');
const editor = CodeMirror.fromTextArea(textArea, {
    mode: 'markdown',
    lineNumbers: false,
    theme: 'default',
    lineWrapping: true
});

// Auto-save draft functionality
let saveTimeout;
const DRAFT_KEY = 'editor_draft';
const SAVE_DELAY = 3000; // 3 seconds

// Load draft on page load
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft) {
    editor.setValue(savedDraft);
}

// Save draft on content change
editor.on('change', () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    document.title = "文章存储地*";
    saveTimeout = setTimeout(() => {
        const content = editor.getValue();
        localStorage.setItem(DRAFT_KEY, content);
        document.title = "文章存储地";
        saveTimeout = null;
    }, SAVE_DELAY);
});

// Clear draft when form is submitted
okButton.addEventListener('click', () => {
    localStorage.removeItem(DRAFT_KEY);
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
});
