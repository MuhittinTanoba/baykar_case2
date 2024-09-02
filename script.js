const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const timerElement = document.getElementById('timer');
const resultContainer = document.getElementById('result-container');
const resultTableBody = document.getElementById('result-table').getElementsByTagName('tbody')[0];

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
            question: post.title,
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
    
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    optionsContainer.innerHTML = '';
    question.options.forEach((option,index) => {
        const optionElement = document.createElement('div');
        const optionWord = String.fromCharCode(65 + index);
        optionElement.className = 'option';
        optionElement.textContent = `${optionWord}-${option}`;
        optionElement.onclick = () => handleOptionClick(option);
        optionsContainer.appendChild(optionElement);
    });
    
    startTimer();
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

function startTimer() {
    timeLeft = 30;
    isClickable = false;
    timerElement.textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 29) {
            isClickable = true;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentQuestionIndex++;
            displayQuestion();
        }
    }, 1000);
}

function displayResults() {
    clearInterval(timer);
    timerElement.innerHTML = '';
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    answers.forEach(answer => {
        const row = resultTableBody.insertRow();
        const questionCell = row.insertCell(0);
        const answerCell = row.insertCell(1);
        questionCell.textContent = answer.question;
        answerCell.textContent = answer.answer;
    });
}

fetchQuestions();
