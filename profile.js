
async function loadProfile() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/';
        return;
    }

    document.getElementById('username').textContent = username;
    
    try {
        const response = await fetch(`http://0.0.0.0:5000/api/profile/${username}`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('currentLevel').textContent = data.progress.level;
            document.getElementById('newLessonsCount').textContent = '5'; // Mock data
            document.getElementById('reviewCount').textContent = '10'; // Mock data
            document.getElementById('levelProgress').style.width = '60%'; // Mock progress
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

function startNewLessons() {
    alert('New lessons feature coming soon!');
}

function startReviews() {
    alert('Reviews feature coming soon!');
}

// Load profile when page loads
loadProfile();
