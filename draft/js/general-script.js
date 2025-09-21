let synth = window.speechSynthesis;
let voices = [];

// Replace Special Characters
function filterSpecialCharacters(text) {
    return text.replace(/<[^>]*>?/gm, '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5，。、？！：“”‘’（）]/g, '');
}

function populateVoices() {
    voices = synth.getVoices();
    const voiceSelect = document.getElementById('voice-select');
    const currentValue = voiceSelect.value; // save current selection
    voiceSelect.innerHTML = ''; // clear existing options
    let defaultVoiceIndex = 0;

    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = i;
        voiceSelect.appendChild(option);

        // try to find a default Chinese voice
        if (voice.lang === 'zh-CN' && voice.localService) {
            defaultVoiceIndex = i;
        }
    });

    // restore previous selection if possible
    if (currentValue && voices[currentValue]) {
        voiceSelect.value = currentValue;
    } else {
        voiceSelect.value = defaultVoiceIndex;
    }
}

synth.onvoiceschanged = populateVoices;

function toggleSpeech(pageId) {
    const pageElement = document.getElementById(pageId);
    const hasVideo = pageElement.querySelector('video') !== null;
    let elements;
    if (hasVideo) {
        // exclude h3 and buttons within options if there's a video
        elements = document.querySelectorAll(`#${pageId} [data-speech]:not(h3):not(.options button[data-speech])`);
    } else {
        // capture all elements with data-speech attribute
        elements = document.querySelectorAll(`#${pageId} [data-speech]`);
    }
    const status = document.getElementById(`${pageId}-status`);
    if (synth.speaking) {
        synth.cancel();
        status.textContent = '已停止';
        return;
    }
    const voiceSelect = document.getElementById('voice-select');
    const voiceIndex = voiceSelect.value;
    if (voices[voiceIndex]) {
        elements.forEach((element) => {
            let text = filterSpecialCharacters(element.dataset.speech);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voices[voiceIndex];
            utterance.rate = parseFloat(document.getElementById('rate').value);
            utterance.pitch = parseFloat(document.getElementById('pitch').value);
            synth.speak(utterance);
        });
        status.textContent = '正在朗读...';
        synth.onend = () => {
            status.textContent = '已完成';
        };
    }
}

function changeVoice() {
    const voiceIndex = document.getElementById('voice-select').value;
    const utterance = new SpeechSynthesisUtterance('这是新的语音效果。');
    utterance.voice = voices[voiceIndex];
    synth.speak(utterance);
}

function updateSpeechRate() {
    const rate = document.getElementById('rate').value;
    document.getElementById('rate-value').textContent = rate;
}

function updateSpeechPitch() {
    const pitch = document.getElementById('pitch').value;
    document.getElementById('pitch-value').textContent = pitch;
}

function toggleAIVoice() {
    const btn = document.getElementById('ai-voice-btn');
    if (btn.classList.contains('off')) {
        btn.classList.remove('off');
        btn.textContent = 'AI语音：开启';
    } else {
        btn.classList.add('off');
        btn.textContent = 'AI语音：关闭';
    }
}

// Catalog Toggle
function toggleSubCategories(button) {
    const subCategory = button.nextElementSibling;
    const toggleBtn = button.querySelector('.toggle-btn');
    if (subCategory.style.display === 'none' || subCategory.style.display === '') {
        subCategory.style.display = 'block';
        toggleBtn.textContent = '▲';
    } else {
        subCategory.style.display = 'none';
        toggleBtn.textContent = '▼';
    }
}