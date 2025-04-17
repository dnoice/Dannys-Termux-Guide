document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement; // Target <html> for data-theme

    // --- Dark Mode Logic ---
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Optional: Update button aria-label or text if needed
        if (themeToggleButton) {
            themeToggleButton.setAttribute('aria-pressed', theme === 'dark');
        }
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check for OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine initial theme: saved > OS preference > default (light)
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // Add toggle button listener
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // Optional: Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Only change if no theme is explicitly saved by the user
        if (!localStorage.getItem('theme')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });


    // --- Smooth Scrolling for TOC Links ---
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align top of element to top of viewport
                });
                // Optional: Add focus for accessibility
                // targetElement.focus({ preventScroll: true }); // preventScroll might be needed if scrollIntoView causes issues
            }
        });
    });


    // --- Add Copy Buttons to Code Blocks ---
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        // Check if there's a <code> element inside
        if (block.querySelector('code')) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');
            block.appendChild(copyButton);

            copyButton.addEventListener('click', async () => {
                const codeElement = block.querySelector('code');
                const codeToCopy = codeElement.innerText || codeElement.textContent; // Get text content

                try {
                    await navigator.clipboard.writeText(codeToCopy);
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    // Reset button text after a short delay
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                        copyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code: ', err);
                    copyButton.textContent = 'Error';
                    // Optionally provide more user-friendly error feedback
                }
            });
        }
    });

}); // End DOMContentLoaded
