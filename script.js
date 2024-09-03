const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const timerElement = document.getElementById('timer');
const resultContainer = document.getElementById('result-container');
const resultTableBody = document.getElementById('result-table').getElementsByTagName('tbody')[0];
const progressBarFill = document.getElementById('progress-bar-fill');
const questionCountElement = document.getElementById('question-count');
const container = document.getElementById('container');

let questions = [];
let currentQuestionIndex = 0;
let answers = [];
let timer;
let timeLeft = 30;
let isClickable = false;

async function fetchQuestions() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        questions = data.slice(0, 10).map(post => ({
            question: post.body,
            options: [post.body.slice(0, 10), post.body.slice(10, 20), post.body.slice(20, 30), post.body.slice(30, 40)],
            answer: post.body.slice(0, 10)
        }));
        displayQuestion();
    } catch (error) {
        console.error('Soru verileri alınamadı:', error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        displayResults();
        return;
    }
    
    questionCountElement.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        const optionLetter = String.fromCharCode(65 + index);
        optionElement.className = 'option';
        optionElement.innerHTML = `<div class="option-letter">${optionLetter}</div> <div class="option-text">${option}</div>`;
        optionElement.onclick = () => {
            if (isClickable) {
                handleOptionClick(option);
            }
        };
        optionsContainer.appendChild(optionElement);
    });
    
    startTimer();
}

function startTimer() {
    timeLeft = 30;
    isClickable = false;
    timerElement.textContent = timeLeft;
    progressBarFill.style.transform = 'scaleX(1)';
    updateOptionStyles();
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        progressBarFill.style.transform = `scaleX(${timeLeft / 30})`;
        
        if (timeLeft <= 20) {
            isClickable = true;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            answers.push({
                question: questions[currentQuestionIndex].question,
                answer: "-"
            });
            currentQuestionIndex++;
            displayQuestion();
        }
        updateOptionStyles();
    }, 1000);
}

function updateOptionStyles() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.className = `option ${isClickable ? 'option-clickable' : 'option-disabled'}`;
    });
}

function handleOptionClick(selectedOption) {
    if (isClickable) {
        answers.push({
            question: questions[currentQuestionIndex].question,
            answer: selectedOption
        });
        currentQuestionIndex++;
        displayQuestion();
    }
}

function displayResults() {
    clearInterval(timer);
    progressBarFill.style.transform = 'scaleX(0)';
    timerElement.innerHTML = 'Quiz is over!';
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    container.style.marginTop = '35%';
    answers.forEach(answer => {
        const row = resultTableBody.insertRow();
        const questionCell = row.insertCell(0);
        const answerCell = row.insertCell(1);
        questionCell.textContent = answer.question;
        answerCell.textContent = answer.answer;
    });
}

fetchQuestions();
