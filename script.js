const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');

let questions = [];
let currentQuestionIndex = 0;
let answers = [];


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

        optionsContainer.appendChild(optionElement);
    });

}

fetchQuestions();
