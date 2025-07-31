const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const historyBox = document.getElementById('history');
const themeToggle = document.getElementById('themeToggle');
const voiceBtn = document.getElementById('voiceBtn');
const speakBtn = document.getElementById('speakBtn');

let currentInput = '';
let history = [];

function updateDisplay(value) {
  display.value = value;
}

function calculateResult() {
  try {
    let expression = currentInput.replace(/\^/g, '**');
    expression = expression.replace(/sqrt/g, 'Math.sqrt');
    const result = eval(expression);
    history.push(`${currentInput} = ${result}`);
    showHistory();
    currentInput = result.toString();
    updateDisplay(currentInput);
  } catch {
    updateDisplay('Error');
    currentInput = '';
  }
}

function handleInput(key) {
  if (key === 'C') {
    currentInput = '';
  } else if (key === 'Enter') {
    calculateResult();
    return;
  } else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
  } else if (key === 'history') {
    historyBox.style.display = historyBox.style.display === 'none' ? 'block' : 'none';
    return;
  } else if ("0123456789.+-*/%^".includes(key) || key === 'sqrt') {
    currentInput += key;
  }

  updateDisplay(currentInput);
}

function showHistory() {
  historyBox.innerHTML = history.slice(-5).reverse().map(h => `<div>${h}</div>`).join('');
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.key;
    handleInput(key);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || "0123456789.+-*/%^CBackspace".includes(e.key)) {
    e.preventDefault();
    handleInput(e.key);
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Voice Input Support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.lang = 'en-US';

voiceBtn.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/times|multiply/gi, '*')
    .replace(/divided by|divide/gi, '/')
    .replace(/power/gi, '^')
    .replace(/square root|root/gi, 'sqrt');

  currentInput += transcript;
  updateDisplay(currentInput);
});

// Voice Output Support
speakBtn.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(display.value);
  speechSynthesis.speak(utterance);
});
