
document.querySelectorAll('.level-btn').forEach(button => {
    button.addEventListener('click', function() {
        const level = this.dataset.level;
        window.location.href = `/learn.html?level=${level}`;
    });
});
