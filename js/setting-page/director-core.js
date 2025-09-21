(() => {
    const DIRECTOR_KEY = 'selectedDirector';

    // REMOVED: function ensureDefaults() and its call.
    // The key 'selectedDirector' will now be NULL if not explicitly set.

    /**
     * Saves the selected director's ID to localStorage.
     * @param {string} directorId - The unique ID of the director.
     */
    function setDirector(directorId) {
        if (directorId === null || directorId === undefined) return;
        localStorage.setItem(DIRECTOR_KEY, String(directorId));
    }

    /**
     * Retrieves the selected director's ID from localStorage.
     * @returns {string|null} The saved director ID (null on first access).
     */
    function getDirector() {
        return localStorage.getItem(DIRECTOR_KEY);
    }

    // Expose the API to the global window object
    window.directorCore = {
        setDirector,
        getDirector,
    };
})();