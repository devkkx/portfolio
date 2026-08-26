// Global JavaScript Controller for Kshirod's Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Terminal Loading Animation
    initTerminalLoader();

    // 2. Dark / Light Theme Manager
    initThemeManager();

    // 3. Scroll Progress Indicator & Sticky Navigation
    initScrollTracker();

    // 4. Mobile Sidebar Navigation Toggle
    initMobileNav();

    // 5. Active Link Underliner
    setActiveNavLink();
});

// Terminal Loader Logic
function initTerminalLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Check if user has already loaded the site in this session to prevent loading fatigue
    const alreadyLoaded = sessionStorage.getItem('portfolioLoaded');
    if (alreadyLoaded) {
        loader.style.display = 'none';
        return;
    }

    const terminalBody = document.querySelector('.terminal-body');
    const lines = [
        { text: 'guest@kshirod:~$ initialize portfolio --all', delay: 100 },
        { text: 'Initializing portfolio system core elements...', delay: 600 },
        { text: 'Loading stylesheets, resources, and custom canvas...', delay: 1100 },
        { text: 'Connecting to virtual Java Full Stack Environment... [OK]', delay: 1500 },
        { text: 'Retrieving radar telemetry processing units... [OK]', delay: 1900 },
        { text: 'Profile: Kshirod Kumar Sahoo (CSE Student / Aspiring SE)', delay: 2200 },
        { text: 'Loading complete. Starting UI display...', delay: 2600 }
    ];

    lines.forEach((line) => {
        setTimeout(() => {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line';
            lineEl.textContent = line.text;
            
            // Insert before the cursor
            const cursor = document.querySelector('.terminal-cursor');
            terminalBody.insertBefore(lineEl, cursor);
        }, line.delay);
    });

    // Fade out and remove the loader after all prints are completed
    setTimeout(() => {
        loader.classList.add('fade-out');
        sessionStorage.setItem('portfolioLoaded', 'true');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600); // match transition duration
    }, 3200);
}

// Dark/Light Theme Switching Logic
function initThemeManager() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    // Check saved theme
    const savedTheme = localStorage.getItem('selected-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('selected-theme', theme);
    });
}

// Scroll Progress & Sticky Nav Bar Header
function initScrollTracker() {
    const progressIndicator = document.getElementById('scroll-progress');
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        // Sticky header classes
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll percentage calculations
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressIndicator) {
            const percentage = (window.scrollY / docHeight) * 100;
            progressIndicator.style.width = `${percentage}%`;
        }
    });
}

// Mobile Collapsible Menu Control
function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
        const expanded = toggle.classList.contains('active') ? 'true' : 'false';
        toggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking navigation items
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target) && links.classList.contains('active')) {
            toggle.classList.remove('active');
            links.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Highlight current page link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Handle root / index matching
        if (currentPath === '/' || currentPath.endsWith('index.html')) {
            if (linkPath === 'index.html' || linkPath === './index.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } else if (linkPath && currentPath.includes(linkPath.replace('../', ''))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
