const body = document.body;

// Header
const header = document.createElement('header');
const title = document.createElement('h1');
title.textContent = 'Markdown Editor';

const controls = document.createElement('div');
controls.className = 'controls';

const toggleThemeBtn = document.createElement('button');
toggleThemeBtn.id = 'toggle-theme';
toggleThemeBtn.innerHTML = '<span class="material-icons">dark_mode</span>';
toggleThemeBtn.title = 'Toggle Theme';

const exportPdfBtn = document.createElement('button');
exportPdfBtn.id = 'export-pdf';
exportPdfBtn.innerHTML = '<span class="material-icons">picture_as_pdf</span>';
exportPdfBtn.title = 'Export as PDF';

controls.appendChild(toggleThemeBtn);
controls.appendChild(exportPdfBtn);
header.appendChild(title);
header.appendChild(controls);
body.appendChild(header);

// Main Editor Container
const main = document.createElement('main');
main.id = 'editor-container';

const markdownInput = document.createElement('textarea');
markdownInput.id = 'markdown-input';
markdownInput.placeholder = 'Write markdown...';

const markdownPreview = document.createElement('div');
markdownPreview.id = 'markdown-preview';

main.appendChild(markdownInput);
main.appendChild(markdownPreview);
body.appendChild(main);

function renderMarkdown() {
  const rawMarkdown = markdownInput.value;
  const html = marked.parse(rawMarkdown);
  markdownPreview.innerHTML = html;
}

// Save to localStorage and render on input
markdownInput.addEventListener('input', () => {
  localStorage.setItem('markdown-content', markdownInput.value);
  renderMarkdown();
});

// === Theme Toggle ===
toggleThemeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  toggleThemeBtn.innerHTML = `<span class="material-icons">${isDark ? 'light_mode' : 'dark_mode'}</span>`;
});

// === Export to PDF ===
exportPdfBtn.addEventListener('click', () => {
  const opt = {
    margin:       0.5,
    filename:     'markdown-export.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const clone = markdownPreview.cloneNode(true);
  const wrapper = document.createElement('div');
  wrapper.appendChild(clone);

  html2pdf().set(opt).from(wrapper).save();
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    toggleThemeBtn.innerHTML = '<span class="material-icons">light_mode</span>';
  } else {
    toggleThemeBtn.innerHTML = '<span class="material-icons">dark_mode</span>';
  }

  const savedMarkdown = localStorage.getItem('markdown-content');
  if (savedMarkdown) {
    markdownInput.value = savedMarkdown;
    renderMarkdown();
  }
});
