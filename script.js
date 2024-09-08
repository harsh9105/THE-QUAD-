let maxRange;
let targetNumber;
let attempts;
let remainingTime;
let timerInterval;

const scienceQuestions = [
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        answer: "H2O"
    },
    {
        question: "What planet is known as the Red Planet?",
        options: ["Mars", "Suraj", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
        answer: "Mitochondria"
    },
    {
        question: "What gas do plants need for photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide"
    },
    {
        question: "What is the most abundant gas in the Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        answer: "Nitrogen"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    updateStats();
});

function startGame() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert('Please enter your name');
        return;
    }

    maxRange = parseInt(document.getElementById('difficulty').value);
    targetNumber = Math.floor(Math.random() * maxRange) + 1;
    attempts = 0;
    remainingTime = 30;

    document.getElementById('game').style.display = 'block';
    document.getElementById('scienceQuiz').style.display = 'none';
    document.getElementById('stats').style.display = 'none';

    document.getElementById('problem').textContent = `Guess a number between 1 and ${maxRange}:`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('answer').value = '';

    startTimer();
}

function checkAnswer() {
    const guess = parseInt(document.getElementById('answer').value);
    attempts++;

    if (guess === targetNumber) {
        clearInterval(timerInterval);
        document.getElementById('feedback').textContent = 'Congratulations! You guessed the number!';
        saveScore(true);
    } else if (attempts >= 5) {
        document.getElementById('feedback').textContent = `Sorry, the correct number was ${targetNumber}. Better luck next time!`;
        clearInterval(timerInterval);
        saveScore(false);
    } else {
        document.getElementById('feedback').textContent = guess < targetNumber ? 'Too low!' : 'Too high!';
    }
}

function startTimer() {
    document.getElementById('time').textContent = remainingTime;
    timerInterval = setInterval(() => {
        remainingTime--;
        document.getElementById('time').textContent = remainingTime;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            document.getElementById('feedback').textContent = `Time's up! The correct number was ${targetNumber}.`;
            saveScore(false);
        }
    }, 1000);
}

function saveScore(won) {
    const playerName = document.getElementById('playerName').value;
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const score = won ? 100 : 0;
    leaderboard.push({ playerName, score });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 5); // Keep top 5 scores

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();

    const stats = JSON.parse(localStorage.getItem('playerStats')) || {};
    if (!stats[playerName]) {
        stats[playerName] = { gamesPlayed: 0, wins: 0, losses: 0 };
    }
    stats[playerName].gamesPlayed++;
    if (won) {
        stats[playerName].wins++;
    } else {
        stats[playerName].losses++;
    }
    localStorage.setItem('playerStats', JSON.stringify(stats));

    updateStats();
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const table = document.getElementById('leaderboard');
    table.innerHTML = `
        <tr>
            <th>Player</th>
            <th>Score</th>
        </tr>
    `;

    leaderboard.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.playerName}</td><td>${entry.score}</td>`;
        table.appendChild(row);
    });
}

function updateStats() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        document.getElementById('stats').style.display = 'none';
        return;
    }

    const stats = JSON.parse(localStorage.getItem('playerStats')) || {};
    const playerStats = stats[playerName] || { gamesPlayed: 0, wins: 0, losses: 0 };

    document.getElementById('playerStats').textContent = `
        Games Played: ${playerStats.gamesPlayed}
        Wins: ${playerStats.wins}
        Losses: ${playerStats.losses}
    `;
    document.getElementById('stats').style.display = 'block';
}

function startScienceQuiz() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert('Please enter your name');
        return;
    }

    document.getElementById('game').style.display = 'none';
    document.getElementById('scienceQuiz').style.display = 'block';
    document.getElementById('stats').style.display = 'none';

    const question = getRandomQuestion();
    document.getElementById('quizQuestion').textContent = question.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkQuizAnswer(option, question.answer);
        optionsDiv.appendChild(button);
    });
}

function getRandomQuestion() {
    return scienceQuestions[Math.floor(Math.random() * scienceQuestions.length)];
}

function checkQuizAnswer(selectedAnswer, correctAnswer) {
    const feedback = document.createElement('p');
    if (selectedAnswer === correctAnswer) {
        feedback.textContent = 'Correct! Well done!';
        saveScore(true);
    } else {
        feedback.textContent = `Incorrect. The correct answer was ${correctAnswer}.`;
        saveScore(false);
    }
    document.getElementById('scienceQuiz').appendChild(feedback);
}
