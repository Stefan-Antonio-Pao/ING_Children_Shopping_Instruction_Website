// js/setting-page/director-setting.js
document.addEventListener('DOMContentLoaded', () => {
    // --- DATA: Character Information ---
    // You can add more characters here. Just ensure the asset paths are correct.
    const directors = [
        {
            id: 'bear',
            name: '小熊',
            avatar: '../../assets/director/bear.png',
            video: '../../assets/director/bear.mp4'
        },
        {
            id: 'cat',
            name: '小猫',
            avatar: '../../assets/director/cat.png',
            video: '../../assets/director/cat.mp4'
        },
        {
            id: 'dog',
            name: '小狗',
            avatar: '../../assets/director/dog.png',
            video: '../../assets/director/dog.mp4'
        },
        {
            id: 'rabbit',
            name: '小兔',
            avatar: '../../assets/director/rabbit.png',
            video: '../../assets/director/rabbit.mp4'
        }
    ];

    // --- DOM Elements ---
    const avatarsContainer = document.getElementById('director-avatars');
    const displayArea = document.getElementById('director-display-area');
    const nextButton = document.getElementById('next-step-btn');

    /**
     * Updates the UI to show the selected character and saves the choice.
     * @param {string} selectedId - The ID of the character to select.
     */
    function selectCharacter(selectedId) {
        const character = directors.find(d => d.id === selectedId);
        if (!character) {
            console.error('Character not found:', selectedId);
            return;
        }

        // 1. Update avatar styles to show which is selected
        document.querySelectorAll('.director-avatar').forEach(avatar => {
            avatar.classList.toggle('selected', avatar.dataset.id === selectedId);
        });

        // 2. Update display area with the showcase video
        displayArea.innerHTML = ''; // Clear placeholder or previous video
        const video = document.createElement('video');
        video.src = character.video;
        video.autoplay = true;
        video.loop = false; // <-- Disable looping
        video.muted = false; // <-- Unmute the video. NOTE: Autoplay with sound is often blocked by browsers.
        video.playsInline = true; // Important for iOS compatibility
        video.controls = false; // <-- Add video player controls
        video.preload = "metadata"; // Preload video metadata to get duration and first frame information quickly.

        // When the video ends, it will naturally stay on the last frame. This is a failsafe.
        video.addEventListener('ended', () => {
            video.pause(); // Make sure the video is paused at the end.
        });

        displayArea.appendChild(video);

        // 3. Make the "Next" button visible
        nextButton.classList.add('visible');

        // 4. Save the selection using the core library
        if (window.directorCore) {
            window.directorCore.setDirector(selectedId);
        }
    }

    /**
     * Initializes the character selection interface.
     */
    function initialize() {
        if (!avatarsContainer || !displayArea || !nextButton) {
            console.error('Required DOM elements are missing.');
            return;
        }

        // 1. Dynamically create and append avatar elements from the data array
        directors.forEach(director => {
            const avatarWrapper = document.createElement('div');
            avatarWrapper.className = 'director-avatar';
            avatarWrapper.dataset.id = director.id;
            avatarWrapper.title = `${director.name}`;

            const avatarImg = document.createElement('img');
            avatarImg.src = director.avatar;
            avatarImg.alt = director.name;
            avatarWrapper.appendChild(avatarImg);

            // Add a click event listener to each avatar
            avatarWrapper.addEventListener('click', () => {
                selectCharacter(director.id);
            });

            avatarsContainer.appendChild(avatarWrapper);
        });

        // 2. On page load, check for a previously saved selection and restore it
        if (window.directorCore) {
            const savedDirectorId = window.directorCore.getDirector();

            if (savedDirectorId && savedDirectorId !== '') {
                // If a character was previously saved, select it and update the display.
                selectCharacter(savedDirectorId);
            } else {
                // If no character was saved, ensure the display area shows the initial placeholder text.
                displayArea.innerHTML = '<p class="placeholder">请选择你的小伙伴！</p>';
                // Make sure the "Next" button is hidden.
                nextButton.classList.remove('visible');
            }
        } else {
            // If directorCore fails to load, also maintain the initial state.
            displayArea.innerHTML = '<p class="placeholder">请选择你的小伙伴！</p>';
            nextButton.classList.remove('visible');
        }
    }

    // --- Run Initialization ---
    initialize();
});