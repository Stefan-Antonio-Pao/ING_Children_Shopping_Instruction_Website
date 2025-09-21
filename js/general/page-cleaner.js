document.addEventListener('DOMContentLoaded', () => {
    const clearDataButton = document.getElementById('clear-data-btn');

    if (clearDataButton) {
        clearDataButton.addEventListener('click', () => {
            // 1. Reset Voice Settings (selected voice, rate, pitch, userSetVoice flag)
            localStorage.clear();
            voiceCore.setSetting('selectedVoiceIndex', '');
            voiceCore.setSetting('selectedRate', '1');
            voiceCore.setSetting('selectedPitch', '1');
            voiceCore.setSetting('userSetVoice', 'false'); // Reset userSetVoice flag
            voiceCore.ensureDefaults();

            // 3. Reload the page to apply the cleared/reset state
            window.location.reload();
        });
    }
});

/**
 * NOTE: The 'clearStorage' function below performs a full localStorage wipe.
 * It is safer to use the specific clear/reset functions provided by
 * directorCore and voiceSetting, which is what the click listener does now.
 */
function clearStorage() {
    localStorage.clear();
    console.warn("所有网站设置已重置！(WARNING: This clears ALL localStorage for the site)");
}