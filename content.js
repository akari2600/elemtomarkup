// content.js
let selectedElement = null;
let hoverElement = null;
let isSelecting = false;

function createHighlightOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'extension-highlight-overlay';
  overlay.style.cssText = `
position: fixed;
pointer-events: none;
z-index: 10000;
background-color: rgba(137, 196, 244, 0.3);
border: 1px solid #89c4f4;
box-shadow: 0 0 0 1px #89c4f4;
transition: all 0.2s ease-in-out;
display: none;
`;
  document.body.appendChild(overlay);
  return overlay;
}

const highlightOverlay = createHighlightOverlay();

function updateHighlight(element) {
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    highlightOverlay.style.top = `${rect.top}px`;
    highlightOverlay.style.left = `${rect.left}px`;
    highlightOverlay.style.width = `${rect.width}px`;
    highlightOverlay.style.height = `${rect.height}px`;
    highlightOverlay.style.display = 'block';
  } else {
    highlightOverlay.style.display = 'none';
  }
}

function handleMouseMove(event) {
  if (isSelecting) {
    hoverElement = event.target;
    updateHighlight(hoverElement);
  }
}

function handleMouseClick(event) {
  if (isSelecting) {
    event.preventDefault();
    event.stopPropagation();
    selectedElement = hoverElement;
    isSelecting = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleMouseClick, true);
    showConfirmationModal();
  }
}

function showConfirmationModal() {
  updateHighlight(selectedElement); // Ensure the highlight stays on the selected element
  const modal = document.createElement('div');
  modal.id = 'extension-confirmation-modal';
  modal.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background: white;
padding: 20px;
border: 1px solid black;
z-index: 10001;
`;
  modal.innerHTML = `
<p>Select output format:</p>
<button id="copyHtmlBtn">Copy as HTML</button>
<button id="copyMarkdownBtn">Copy as Markdown</button>
<button id="cancelBtn">Cancel</button>
<p><small>Press H for HTML, M for Markdown, or Esc to cancel</small></p>
`;
  document.body.appendChild(modal);

  document.getElementById('copyHtmlBtn').addEventListener('click', () => confirmSelection('html'));
  document.getElementById('copyMarkdownBtn').addEventListener('click', () => confirmSelection('markdown'));
  document.getElementById('cancelBtn').addEventListener('click', cancelSelection);
}

function confirmSelection(format) {
  if (selectedElement) {
    let content;
    if (format === 'html') {
      content = selectedElement.outerHTML;
    } else if (format === 'markdown') {
      content = convertHTMLWithTurndown(selectedElement.outerHTML);
    }

    navigator.clipboard.writeText(content).then(function() {
      // alert(`Content copied to clipboard as ${format.toUpperCase()}!`);
    }).catch(function(err) {
      console.error('Failed to copy text: ', err);
    });
  }
  cleanupSelection();
}

function cancelSelection() {
  cleanupSelection();
}

function convertHTMLWithTurndown(html) {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  return markdown;
}

function cleanupSelection() {
  selectedElement = null;
  hoverElement = null;
  isSelecting = false;
  highlightOverlay.style.display = 'none';
  document.body.style.cursor = 'default';
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleMouseClick, true);
  document.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('scroll', handleScroll, true);
  const modalElement = document.getElementById('extension-confirmation-modal');
  if (modalElement) {
    modalElement.remove();
  }
}

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    cancelSelection();
  } else if (event.key === 'h' || event.key === 'H') {
    confirmSelection('html');
  } else if (event.key === 'm' || event.key === 'M') {
    confirmSelection('markdown');
  }
}

function convertHTMLtoMarkdown(html) {
  // Create a temporary element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  let markdown = [];

  // Helper function to convert a node to Markdown
  function nodeToMarkdown(node) {
    switch (node.nodeName) {
      case 'H2':
        return `## ${node.textContent}\n\n`;
      case 'H3':
        return `### ${node.textContent}\n\n`;
      case 'P':
        return `${node.textContent}\n\n`;
      case 'STRONG':
        return `**${node.textContent}**`;
      case 'EM':
        return `*${node.textContent}*`;
      case 'UL':
        return Array.from(node.children).map(li => `- ${li.textContent}\n`).join('') + "\n";
      case 'TABLE':
        // For simplicity, we'll just convert table contents to plain text
        return Array.from(node.querySelectorAll('td, th'))
          .map(cell => cell.textContent)
          .join("\n\n") + "\n\n";
      default:
        return node.textContent;
    }
  }

  // Process all child nodes
  tempDiv.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      markdown.push(nodeToMarkdown(node));
    }
  });

  return markdown.join("\n");
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "selectWithMouse") {
    isSelecting = true;
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleMouseClick, true);
    document.addEventListener('keydown', handleKeyDown);
  } else if (request.action === "selectWithSelector") {
    const element = document.querySelector(request.selector);
    if (element) {
      selectedElement = element;
      updateHighlight(selectedElement);
      showConfirmationModal();
    } else {
      alert('No element found with the given selector.');
    }
  }
});

function handleScroll() {
  if (selectedElement || (isSelecting && hoverElement)) {
    updateHighlight(selectedElement || hoverElement);
  }
}

window.addEventListener('scroll', handleScroll, true);



