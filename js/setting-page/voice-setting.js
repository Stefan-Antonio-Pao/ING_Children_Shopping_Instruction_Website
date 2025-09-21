// javascript
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('voice-select');
    const rate = document.getElementById('rate');
    const pitch = document.getElementById('pitch');
    const rateValue = document.getElementById('rate-value');
    const pitchValue = document.getElementById('pitch-value');
    const aiBtn = document.getElementById('ai-voice-btn');
    const resetBtn = document.getElementById('ai-voice-reset');
    const playBtn = document.querySelector('.test-area button');
    const sampleParagraph = document.querySelector('.test-area p');

    // Initialize UI from localStorage
    function loadUI() {
        rate.value = voiceCore.getSetting('selectedRate') || '1';
        pitch.value = voiceCore.getSetting('selectedPitch') || '1';
        rateValue.textContent = rate.value;
        pitchValue.textContent = pitch.value;
        const auto = voiceCore.getSetting('autoPlay') || 'off';
        if (auto === 'on') {
            aiBtn.classList.remove('off');
            aiBtn.textContent = '自动朗读：开启';
        } else {
            aiBtn.classList.add('off');
            aiBtn.textContent = '自动朗读：关闭';
        }
    }

    // Populate select (voiceCore handles waiting for voices)
    voiceCore.populateVoiceSelect(select).then(() => {
        // ensure UI select reflects stored index
        const stored = voiceCore.getSetting('selectedVoiceIndex');
        if (stored !== null && stored !== '') select.value = stored;
    });

    loadUI();

    // Handlers

    // ***** 关键修改 1: 用户手动选择时，标记为已设置 *****
    select.addEventListener('change', () => {
        voiceCore.setSetting('selectedVoiceIndex', select.value);
        voiceCore.setSetting('selectedVoiceLang', '');
        // 标记用户已手动选择
        voiceCore.setSetting('userSetVoice', 'true');
    });
    // ***** 关键修改 1 END *****

    rate.addEventListener('input', () => {
        rateValue.textContent = rate.value;
        voiceCore.setSetting('selectedRate', rate.value);
    });

    pitch.addEventListener('input', () => {
        pitchValue.textContent = pitch.value;
        voiceCore.setSetting('selectedPitch', pitch.value);
    });

    aiBtn.addEventListener('click', () => {
        const current = voiceCore.getSetting('autoPlay') || 'off';
        const next = current === 'on' ? 'off' : 'on';
        voiceCore.setSetting('autoPlay', next);
        if (next === 'on') {
            aiBtn.classList.remove('off');
            aiBtn.textContent = '自动朗读：开启';
        } else {
            aiBtn.classList.add('off');
            aiBtn.textContent = '自动朗读：关闭';
        }
    });

    resetBtn.addEventListener('click', () => {
        // ***** 关键修改 2: 重置时，清除所有语音相关的存储，并标记为未设置 *****

        // 1. 清除 voiceCore 中的 index 和用户设置标志
        voiceCore.setSetting('selectedVoiceIndex', ''); // 清除索引，允许重新选择
        voiceCore.setSetting('userSetVoice', 'false'); // 标记为未手动设置，允许智能选择

        // 2. 重置 rate/pitch
        voiceCore.setSetting('selectedRate', '1');
        voiceCore.setSetting('selectedPitch', '1');

        // 3. 更新 UI 元素
        rate.value = '1';
        pitch.value = '1';
        rateValue.textContent = '1';
        pitchValue.textContent = '1';

        // 4. 重新填充并触发智能选择
        // 由于我们将 selectedVoiceIndex 设置为空 ('' 或 null)，
        // populateVoiceSelect 会调用 pickBestChineseVoiceIndex 重新选择最佳语音。
        voiceCore.populateVoiceSelect(select);

        // ***** 关键修改 2 END *****
    });

    // const sampleText = sampleParagraph ? sampleParagraph.textContent.trim() : '这是新语音的播放效果，你可以在上方继续调整。';
    const sampleText = '这是新语音的播放效果。';
    playBtn.addEventListener('click', () => {
        // user gesture -> speak is allowed
        voiceCore.speakText(sampleText);
    });
    //
    // // optional: click on paragraph to speak
    // if (sampleParagraph) {
    //     sampleParagraph.addEventListener('click', () => voiceCore.speakText(sampleText));
    // }
});