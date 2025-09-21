document.addEventListener('DOMContentLoaded', () => {

    // --- DATA: Course Modules and Difficulty Levels ---
    const courses = [
        {
            id: 'chinese-yuan-recognition',
            title: '人民币教学',
            description: '了解不同种类的人民币，并尝试辨别。',
            image: '../../assets/chinese-yuan/ten.png', // Placeholder path
            difficulties: [
                { level: 1, name: '简单', desc: '学习1元、5元、10元、20元、50元人民币。' },
                { level: 2, name: '进阶', desc: '学习1元、5元、10元、20元、50元、100元人民币。' },
                { level: 4, name: '挑战', desc: '学习1角、5角、1元、5元、10元、20元、50元、100元人民币。' },
            ]
        },
        {
            id: 'online-payment',
            title: '线上支付教学',
            description: '了解如何使用微信/支付宝进行线上支付。',
            image: '../../assets/chinese-yuan/one.png', // Placeholder path
            difficulties: [
                { level: 1, name: '简单', desc: '学习线上支付的基本流程。' },
            ]
        },
        {
            id: 'calculation-exercise',
            title: '练习环节',
            description: '简单的金额加减法计算问题。',
            image: '../../assets/shop-good/study-tool/pencil.png', // Placeholder path
            difficulties: [
                { level: 1, name: '简单', desc: '1-50元的加减法（整数1、5、10、20、50的加减法）。' },
                { level: 2, name: '进阶', desc: '1-100元的加减法（整数）。' },
                { level: 4, name: '挑战', desc: '1-100元的加减法（整数与小数）。' },
            ]
        },
        {
            id: 'calculation-exercise',
            title: '应用环节',
            description: '体验完整的购物与支付流程。',
            image: '../../assets/shop-good/fruit/apple.png', // Placeholder path
            difficulties: [
                { level: 1, name: '简单', desc: '整数价格的商品。支付钱币大于等于应付钱币即算成功。' },
                { level: 2, name: '进阶', desc: '整数价格的商品。支付钱币正好等于应付钱币，或正确计算找零才算成功。' },
                { level: 3, name: '进阶+', desc: '整数价格的商品，限制花费金额。支付钱币小于上限情况下，正好等于应付钱币，或正确计算找零才算成功。' },
                { level: 4, name: '挑战', desc: '整数与小数价格的商品，限制花费金额。支付钱币小于上限情况下，正好等于应付钱币，或正确计算找零才算成功。' },
            ]
        },
        // Add more courses here...
    ];

    // --- DOM Elements ---
    const catalogView = document.getElementById('module-catalog');
    const difficultyView = document.getElementById('difficulty-selection');
    const cardsContainer = document.getElementById('course-cards-container');
    const backButton = document.getElementById('back-to-catalog-btn');
    const difficultyTitle = document.getElementById('difficulty-course-title');

    const difficultyButtonsContainer = document.querySelector('#difficulty-selection .difficulty-buttons');

    const difficultyDesc = document.getElementById('difficulty-description');
    const selectDifficultyBtn = document.getElementById('select-difficulty-btn');

    let currentSelectedCourse = null;
    let currentSelectedDifficulty = null;


    // --- State Management ---

    /**
     * Switches the view to the module catalog.
     */
    function showCatalogView() {
        difficultyView.classList.add('hidden');
        catalogView.classList.remove('hidden');
        currentSelectedCourse = null;
        currentSelectedDifficulty = null;
    }

    /**
     * Switches the view to the difficulty selection for a specific course.
     * @param {object} course - The course object to display.
     */
    function showDifficultyView(course) {
        if (!catalogView || !difficultyView || !cardsContainer) {
            console.error('错误：未找到主要的视图容器元素。请检查 module-catalog.html 中的 ID 拼写。');
            return;
        }

        currentSelectedCourse = course;
        currentSelectedDifficulty = null;

        catalogView.classList.add('hidden');
        difficultyView.classList.remove('hidden');

        difficultyTitle.textContent = `${course.title} - 难度选择`;

        // Reset and populate difficulty buttons
        difficultyButtonsContainer.innerHTML = '';
        difficultyDesc.textContent = '请在上方选择一个难度级别。';
        selectDifficultyBtn.disabled = true;

        course.difficulties.forEach(diff => {
            const button = document.createElement('button');
            button.className = 'difficulty-btn';
            button.dataset.level = diff.level;
            button.textContent = diff.name;
            button.addEventListener('click', () => selectDifficulty(diff, button));
            difficultyButtonsContainer.appendChild(button);
        });
    }

    /**
     * Updates the UI when a difficulty level is selected.
     * @param {object} difficulty - The selected difficulty object.
     * @param {HTMLElement} buttonEl - The button element that was clicked.
     */
    function selectDifficulty(difficulty, buttonEl) {
        currentSelectedDifficulty = difficulty;

        // 1. Update button styles
        difficultyButtonsContainer.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        buttonEl.classList.add('selected');

        // 2. Update description
        difficultyDesc.textContent = `[${difficulty.name}] 难度内容：${difficulty.desc}`;

        // 3. Enable the final selection button
        selectDifficultyBtn.disabled = false;
        selectDifficultyBtn.textContent = `选择 ${difficulty.name} 难度`;
    }

    // --- Rendering and Event Handlers ---

    /**
     * Creates and appends the course card to the container.
     * @param {object} course - The course data object.
     */
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="card-title">${course.title}</div>
            <p class="card-description">${course.description}</p>
            <img class="card-image" src="${course.image}" alt="${course.title}图片">
            <div class="card-action">选择该课程 →</div>
        `;
        card.addEventListener('click', () => showDifficultyView(course));
        cardsContainer.appendChild(card);
    }

    /**
     * Final action when 'Select Difficulty' is clicked.
     */
    function handleSelectDifficulty() {
        if (!currentSelectedCourse || !currentSelectedDifficulty) {
            console.error('No course or difficulty selected!');
            return;
        }

        // --- Core Action: Start Course ---
        const courseId = currentSelectedCourse.id;
        const difficultyLevel = currentSelectedDifficulty.level;

        // For now, log the selection, and you can implement the actual page transition here.
        console.log(`Starting Course: ${courseId} at Difficulty: ${difficultyLevel}`);

        // Example: window.location.href = `../course-page/${courseId}_L${difficultyLevel}.html`;
        alert(`已选择课程: ${currentSelectedCourse.title}, 难度: ${currentSelectedDifficulty.name}`);
    }

    // --- Initialization ---
    function initialize() {
        // Render all course cards
        courses.forEach(createCourseCard);

        // Set up main event listeners
        backButton.addEventListener('click', showCatalogView);
        selectDifficultyBtn.addEventListener('click', handleSelectDifficulty);
    }

    initialize();
});