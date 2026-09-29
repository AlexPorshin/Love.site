
const startDate = new Date(2026, 5, 29, 13, 22, 52);


function goTo(screenNum) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen' + screenNum).classList.add('active');

  if (screenNum === 2) initHearts();
  if (screenNum === 3) startGame();
  if (screenNum === 6) startTimer();
}


let heartsCollected = 0;
const heartMessages = [
  'Спасибо, что ты рядом',
  'Я люблю тебя',
  'Ты — моя'
];

function initHearts() {
  heartsCollected = 0;
  document.getElementById('hearts-status').textContent = 'Собрано: 0 / 3';
  const container = document.getElementById('hearts-container');
  container.innerHTML = '';

  const positions = [
    { top: '20%', left: '15%' },
    { top: '50%', left: '70%' },
    { top: '75%', left: '30%' }
  ];

  positions.forEach((pos, i) => {
    const heart = document.createElement('div');
    heart.className = 'heart-item';
    heart.textContent = '❤️';
    heart.style.top = pos.top;
    heart.style.left = pos.left;
    heart.onclick = () => collectHeart(heart, i);
    container.appendChild(heart);

    const text = document.createElement('div');
    text.className = 'heart-text';
    text.textContent = heartMessages[i];
    text.style.top = `calc(${pos.top} + 60px)`;
    text.style.left = pos.left;
    text.id = 'heart-text-' + i;
    container.appendChild(text);
  });
}

function collectHeart(heart, index) {
  if (heart.classList.contains('collected')) return;
  heart.classList.add('collected');
  document.getElementById('heart-text-' + index).classList.add('show');
  heartsCollected++;
  document.getElementById('hearts-status').textContent = `Собрано: ${heartsCollected} / 3`;

  if (heartsCollected === 3) {
    setTimeout(() => goTo(3), 1200);
  }
}


let gameScore = 0;
let gameInterval;
let gameArea;

function startGame() {
  gameScore = 0;
  document.getElementById('game-score').textContent = 'Поймано: 0 / 10';
  gameArea = document.getElementById('game-area');
  gameArea.innerHTML = '';

  gameInterval = setInterval(spawnHeart, 700);
}

function spawnHeart() {
  if (gameScore >= 10) {
    clearInterval(gameInterval);
    setTimeout(() => goTo(4), 800);
    return;
  }

  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  heart.textContent = '❤️';
  heart.style.left = Math.random() * 90 + '%';
  heart.style.top = '-50px';
  gameArea.appendChild(heart);

  let top = -50;
  const speed = 2 + Math.random() * 2;
  const fall = setInterval(() => {
    top += speed;
    heart.style.top = top + 'px';

    if (top > 420) {
      clearInterval(fall);
      heart.remove();
    }
  }, 30);

  const catchHeart = (e) => {
    if (e) e.preventDefault();
    if (heart.dataset.caught) return;
    heart.dataset.caught = 'true';
    gameScore++;
    document.getElementById('game-score').textContent = `Поймано: ${gameScore} / 10`;
    heart.textContent = '💖';
    heart.style.transform = 'scale(1.5)';
    clearInterval(fall);
    setTimeout(() => heart.remove(), 300);

    if (gameScore >= 10) {
      clearInterval(gameInterval);
      setTimeout(() => goTo(4), 800);
    }
  };

  heart.addEventListener('click', catchHeart);
  heart.addEventListener('touchstart', catchHeart, { passive: false });
  heart.addEventListener('mouseenter', catchHeart);
}


function answerChoice(choice) {
  const answer = document.getElementById('choice-answer');
  answer.textContent = 'Я чувствую то же. Всегда ❤️';
  answer.classList.add('show');
  setTimeout(() => goTo(5), 2000);
}


function checkItalian() {
  const input = document.getElementById('italian-input').value.trim();
  const answer = document.getElementById('italian-answer');
  if (!input) return;

  answer.textContent = 'Ты умничка. Скоро мы будем говорить там, в Италии. Вместе ❤️';
  answer.classList.add('show');
  setTimeout(() => goTo(6), 2500);
}


let timerInterval;

function startTimer() {
  clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}


const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
  if (!music) return;

  if (music.paused) {
    music.volume = 0.4;
    music.play()
      .then(() => {
        musicBtn.textContent = '❚❚';
        musicBtn.classList.add('playing');
      })
      .catch(err => console.log('Музыка не запустилась:', err));
  } else {
    music.pause();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
  }
}