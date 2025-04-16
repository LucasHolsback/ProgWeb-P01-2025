
let currentWord = null;
let score = 0;
let words = [];

async function loadWords(level) {
    try {
        const response = await fetch(`Level${level}.txt`);
        const text = await response.text();
        return text.split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [japanese, english] = line.split('=').map(part => part.trim());
                return {
                    japanese: japanese,
                    answer: english
                };
            });
    } catch (error) {
        console.error('Error loading words:', error);
        return [];
    }
}

function updateProgress() {
    const progress = (score / 10) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('score').textContent = `Score: ${score}/10`;
}

function displayWord(word) {
    currentWord = word;
    document.getElementById('kanji').textContent = word.japanese;
    document.getElementById('reading').textContent = '';
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const correctAnswer = currentWord.answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        document.getElementById('result').textContent = 'Correct!';
        document.getElementById('result').style.color = 'green';
        score++;
        updateProgress();
        
        if (score >= 10) {
            alert('Congratulations! You completed this level!');
            window.location.href = '/levels.html';
            return;
        }
        
        setTimeout(() => {
            displayWord(words[score]);
        }, 1000);
    } else {
        document.getElementById('result').textContent = `Incorrect. Correct answer: ${currentWord.answer}`;
        document.getElementById('result').style.color = 'red';
    }
}

async function initializeLevel() {
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level')) || 1;
    
    words = await loadWords(level);
    if (words.length > 0) {
        displayWord(words[0]);
    } else {
        document.getElementById('result').textContent = 'Error loading words for this level';
        document.getElementById('result').style.color = 'red';
    }
}

function handleAnswer() {
    if (currentWord === null) return;
    checkAnswer();
}

document.getElementById('check-btn').addEventListener('click', handleAnswer);
document.getElementById('answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAnswer();
    }
});

initializeLevel();
