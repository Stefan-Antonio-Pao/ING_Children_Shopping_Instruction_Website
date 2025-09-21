/**
 * Toggles the visibility of sub-categories in the sidebar and saves the state to localStorage.
 * @param {HTMLElement} element - The clicked main-category anchor element.
 */
function toggleSubCategories(element) {
    // Find the immediate next sibling, which should be the sub-category list (UL)
    const subCategory = element.nextElementSibling;
    // Find the toggle indicator (e.g., ▼ or ▶)
    const toggleBtn = element.querySelector('.toggle-btn');
    // Get the category's unique identifier (using inner text for simplicity)
    const categoryName = element.textContent.trim().split('▶')[0].trim().split('▼')[0].trim();
    const storageKey = 'sidebar_state_' + categoryName;

    if (subCategory && subCategory.classList.contains('sub-category')) {
        const isCurrentlyOpen = subCategory.style.display === 'block';

        if (isCurrentlyOpen) {
            // Collapse the sub-category: display ▶
            subCategory.style.display = 'none';
            if (toggleBtn) toggleBtn.textContent = '▶';
            localStorage.setItem(storageKey, 'closed');
        } else {
            // Expand the sub-category: display ▼
            subCategory.style.display = 'block';
            if (toggleBtn) toggleBtn.textContent = '▼';
            localStorage.setItem(storageKey, 'open');
        }
    }
}

/**
 * Loads the saved sidebar state from localStorage on page load.
 */
function loadSidebarState() {
    const mainCategories = document.querySelectorAll('.sidebar .main-category');

    mainCategories.forEach(element => {
        // Use both possible split symbols for robust category name extraction
        const categoryName = element.textContent.trim().split('▶')[0].trim().split('▼')[0].trim();
        const storageKey = 'sidebar_state_' + categoryName;
        const savedState = localStorage.getItem(storageKey);

        // Find the sub-category list and toggle button
        const subCategory = element.nextElementSibling;
        const toggleBtn = element.querySelector('.toggle-btn');

        if (subCategory && subCategory.classList.contains('sub-category')) {
            if (savedState === 'open') {
                // Apply 'open' state from storage: display ▼
                subCategory.style.display = 'block';
                if (toggleBtn) toggleBtn.textContent = '▼';
            } else {
                // Apply 'closed' state from storage (or default): display ▶
                subCategory.style.display = 'none';
                if (toggleBtn) toggleBtn.textContent = '▶';
            }
        }
    });
}


// Attach load function to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', loadSidebarState);