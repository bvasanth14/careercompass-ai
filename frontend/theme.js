// theme.js - Fully automated global theme applicator (Requires zero HTML changes on other pages)
(function() {
    // 1. Get saved theme or fallback to default Neon Magenta
    const savedTheme = localStorage.getItem('app_theme_preset');
    const theme = savedTheme ? JSON.parse(savedTheme) : { 
        from: '#ff2a85', 
        to: '#c026d3', 
        glow: 'rgba(255, 42, 133, 0.3)' 
    };

    // 2. Inject dynamic CSS variables and global override rules into the page head
    const style = document.createElement('style');
    style.id = 'auto-global-theme';
    style.innerHTML = `
        :root {
            --theme-from: ${theme.from};
            --theme-to: ${theme.to};
            --theme-glow: ${theme.glow};
        }
        
        /* Automatically override any hardcoded pink/purple gradients or accents across all pages */
        [class*="from-[#"], .group:hover [class*="text-[#"] {
            background-image: linear-gradient(to right, var(--theme-from), var(--theme-to)) !important;
            box-shadow: 0 10px 25px -5px var(--theme-glow) !important;
        }
    `;
    document.head.appendChild(style);

    // 3. Automatically scan and update active sidebars, buttons, and accents when the page loads
    window.addEventListener('DOMContentLoaded', () => {
        // Target active sidebar links, primary buttons, and logo badges across all pages
        const elementsToUpdate = document.querySelectorAll(`
            aside a.font-semibold, 
            aside a[class*="bg-gradient"], 
            header span[class*="bg-"], 
            button[class*="bg-gradient"]
        `);

        elementsToUpdate.forEach(el => {
            el.style.backgroundImage = `linear-gradient(to right, ${theme.from}, ${theme.to})`;
            el.style.boxShadow = `0 10px 25px -5px ${theme.glow}`;
        });
    });
})();