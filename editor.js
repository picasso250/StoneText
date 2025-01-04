// Initialize CodeMirror Editor
const textArea = document.getElementById('textInput');
const editor = CodeMirror.fromTextArea(textArea, {
    mode: 'markdown',
    lineNumbers: false,
    theme: 'default',
    lineWrapping: true
});

// Initialize tab functionality
const editTab = document.getElementById('editTab');
const previewTab = document.getElementById('previewTab');
const editorWrapper = document.querySelector('.editor-wrapper');
const previewWrapper = document.querySelector('.preview-wrapper');
const preview = document.getElementById('preview');

function updatePreview() {
    const content = editor.getValue();
    preview.innerHTML = marked.parse(content, {
        sanitize: true,
        breaks: true
    });
    
    // Apply syntax highlighting
    preview.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
    
    // Re-render MathJax after content update
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise && MathJax.typesetPromise();
    }
}

function switchTab(activeTab) {
    // Update tab buttons
    editTab.classList.remove('active');
    previewTab.classList.remove('active');
    activeTab.classList.add('active');

    // Update content visibility
    editorWrapper.classList.remove('active');
    previewWrapper.classList.remove('active');
    editorWrapper.style.display = 'none';
    previewWrapper.style.display = 'none';
    
    if (activeTab === editTab) {
        editorWrapper.classList.add('active');
        editorWrapper.style.display = 'block';
    } else {
        updatePreview();
        previewWrapper.classList.add('active');
        previewWrapper.style.display = 'block';
    }
}

editTab.addEventListener('click', () => switchTab(editTab));
previewTab.addEventListener('click', () => switchTab(previewTab));

// Initialize with edit tab active
switchTab(editTab);

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
