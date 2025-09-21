function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    if (tab === 'simple') {
        document.querySelector('.tab:nth-child(1)').classList.add('active');
        document.getElementById('simple-content').classList.remove('hidden');
    } else {
        document.querySelector('.tab:nth-child(2)').classList.add('active');
        document.getElementById('difficult-content').classList.remove('hidden');
    }
}
