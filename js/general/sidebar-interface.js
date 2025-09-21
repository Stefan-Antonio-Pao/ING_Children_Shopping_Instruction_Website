// NOTE: This file assumes sidebarData.js is loaded before it.
// The code utilizes localStorage for state persistence and dynamic path calculation for deployment compatibility.

// --- Path Logic: Dynamically Calculate Prefix ---

/**
 * Calculates the required path prefix (e.g., '', '../', '../../')
 * to go from the current page's directory to the project root.
 * It counts the number of directory levels in the URL path, ensuring compatibility
 * with both local file access (file://) and server deployment (http://).
 * @returns {string} The path prefix (e.g., '../' or '../../').
 */
function calculatePathPrefix() {
    let pathname = window.location.pathname.toLowerCase();

    // 1. Clean pathname: Remove the filename and potential trailing slashes.
    pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);

    // 2. Remove common web root symbols (like '/', '\') to prevent counting the root itself.
    // Handles both Linux/Mac '/' and Windows '\' separators.
    pathname = pathname.replace(/^(\/|\\)/, '');

    // 3. Count path separators. This represents the depth of the current directory relative to the root.
    const separatorCount = (pathname.match(/(\/|\\)/g) || []).length;

    // 4. Generate prefix: Each level needs one '../'
    let prefix = '';
    for (let i = 0; i < separatorCount; i++) {
        prefix += '../';
    }

    return prefix;
}

// --- State Control Functions ---

/**
 * Toggles the visibility of sub-categories and saves the state to localStorage.
 * @param {HTMLElement} element - The clicked anchor element with data-category.
 */
function toggleSubCategories(element) {
    const subCategory = element.nextElementSibling;
    const toggleBtn = element.querySelector('.toggle-btn');
    const categoryName = element.getAttribute('data-category');
    const storageKey = 'sidebar_state_' + categoryName;

    if (subCategory && subCategory.classList.contains('sub-category')) {
        const isCurrentlyOpen = subCategory.style.display === 'block';

        if (isCurrentlyOpen) {
            // Collapse: Display ▶
            subCategory.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '▶';
            localStorage.setItem(storageKey, 'closed');
        } else {
            // Expand: Display ▼
            subCategory.style.display = 'block';
            if (toggleBtn) toggleBtn.textContent = '▼';
            localStorage.setItem(storageKey, 'open');
        }
    }
}

/**
 * Loads the saved sidebar state from localStorage and applies it to all rendered elements.
 */
function loadSidebarState() {
    // Select all collapsible anchors (those with the data-category attribute) across all levels.
    const collapsibles = document.querySelectorAll('.sidebar a[data-category]');

    collapsibles.forEach(element => {
        const categoryName = element.getAttribute('data-category');
        if (!categoryName) return;

        const storageKey = 'sidebar_state_' + categoryName;
        const savedState = localStorage.getItem(storageKey);

        const subCategory = element.nextElementSibling;
        const toggleBtn = element.querySelector('.toggle-btn');

        if (subCategory && subCategory.classList.contains('sub-category')) {
            if (savedState === 'open') {
                // Restore open state: Display ▼
                subCategory.style.display = 'block';
                if (toggleBtn) toggleBtn.textContent = '▼';
            } else {
                // Restore closed state or apply default closed state: Display ▶
                subCategory.style.display = 'none';
                if (toggleBtn) toggleBtn.textContent = '▶';
            }
        }
    });
}

// --- Core Recursive Rendering Logic ---

/**
 * Recursive function to render nested UL/LI structure from the data array.
 * @param {Array} data - The navigation data for the current level.
 * @param {string} pathPrefix - The calculated relative path prefix (e.g., '../').
 * @param {string} currentPath - The lowercase current URL path for highlighting.
 * @returns {string} The generated HTML string for the current list level.
 */
function renderList(data, pathPrefix, currentPath) {
    let html = '';

    // Helper to check if a link matches the current page URL for highlighting.
    const isCurrentPage = (href) => {
        if (!href || href === '#') return false;
        // The comparison uses currentPath.endsWith(normalizedHref) to match the path.
        let normalizedHref = href.toLowerCase();
        return currentPath.endsWith(normalizedHref);
    };

    data.forEach(item => {
        // 1. Prepare link details and styling.
        const fullHref = item.href ? pathPrefix + item.href : '#';
        const isActive = item.href && isCurrentPage(item.href);
        const style = isActive ? 'style="background-color: #ddd"' : '';
        const categoryIdentifier = item.title.replace(/\s/g, ''); // Unique ID for state saving (e.g., "网站设置")

        // 2. Check for child categories (Recursive condition).
        if (item.subCategories && item.subCategories.length > 0) {
            // A. Render collapsible category item.
            // The anchor uses 'data-category' for state persistence and 'onclick' for collapse/expand.
            html += `
                <li>
                    <a class="main-category toggle-category" 
                       onclick="toggleSubCategories(this)" 
                       data-category="${categoryIdentifier}"
                       ${style}>
                        <span class="toggle-btn">▶</span>${item.title}
                    </a>
                    <ul class="sub-category">
                        ${renderList(item.subCategories, pathPrefix, currentPath)} 
                    </ul>
                </li>
            `;
        } else {
            // B. Render simple link item (Leaf node).
            html += `
                <li><a href="${fullHref}" ${style}>${item.title}</a></li>
            `;
        }
    });
    return html;
}

// --- Entry Point Function ---

/**
 * Initiates the sidebar rendering process.
 * @param {Array} data - The top-level navigation data from sidebarData.js.
 */
function renderSidebar(data) {
    const sidebar = document.querySelector('.sidebar ul');
    if (!sidebar || !data) return;

    const pathPrefix = calculatePathPrefix();
    const currentPath = window.location.pathname.toLowerCase();

    // Clear existing content and start recursive rendering.
    // The top-level UL is already present in the HTML structure.
    sidebar.innerHTML = renderList(data, pathPrefix, currentPath);

    // After rendering, restore saved collapse/expand state.
    loadSidebarState();
}


// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if the global variable is defined (i.e., sidebar-data.js loaded).
    if (typeof sidebarData !== 'undefined') {
        renderSidebar(sidebarData);
    } else {
        console.error("Error: sidebarData is not defined. Ensure sidebar-data.js is loaded before user-interface.js.");
    }

    document.addEventListener('click', (e) => {
        // Find the closest ancestor that is an <a> tag and is inside the sidebar
        const link = e.target.closest('.sidebar a');

        // Check if the link is a valid navigation target and is not the current page
        if (link && link.href && link.href !== '#' && !link.classList.contains('toggle-category')) {

            // 1. Check if the link is under the "模块选择" (Module Selection) category
            // We can check if the link's parent structure contains "模块选择"
            // The sidebarData structure shows "模块选择" is the third top-level item.

            // For simplicity and robustness against sidebar structure changes,
            // we will check if the link is one of the target modules (e.g., 人民币教学, 线上支付教学, etc.)

            // Find the top-level parent list item (LI) for the clicked link
            const topLevelLI = link.closest('.sidebar > ul > li:nth-child(3)');

            // Check if the link is under the '模块选择' section (which is the 3rd LI)
            if (topLevelLI) {
                const mainTitle = topLevelLI.querySelector('.main-category').textContent.trim();
                if (mainTitle.includes('模块选择')) {

                    // 2. Check if a director has been selected
                    const selectedDirectorId = window.directorCore ? window.directorCore.getDirector() : null;

                    if (!selectedDirectorId || selectedDirectorId === '') {
                        // 3. NO director selected! Prevent navigation and set default 'bear'.
                        e.preventDefault();

                        // Set 'bear' as the default director
                        if (window.directorCore) {
                            window.directorCore.setDirector('bear');
                        }

                        // 4. Force the navigation to continue after setting the default
                        window.location.href = link.href;
                    }
                }
            }
        }
    });
});