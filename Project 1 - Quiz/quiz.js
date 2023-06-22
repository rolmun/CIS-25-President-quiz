let quiz = [];
let score = 0;
let currentQuestionIndex = 0;
let userName = "";

function startQuiz() {
 fetch("quiz.json")
  .then((response) => response.json())
  .then((data) => {
   quiz = getRandomQuestions(data, 5); // Get 5 random questions from the JSON data
   score = 0;
   currentQuestionIndex = 0;
   displayQuestion();
  })
  .catch((error) => console.log(error));
}

function getRandomQuestions(data, count) {
 const shuffledData = data.slice(); // Create a copy of the data
 shuffleArray(shuffledData); // Shuffle the copied array
 return shuffledData.slice(0, count); // Select the first 'count' questions
}

function shuffleArray(array) {
 for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
 }
}

function loadQuiz() {
 userName = document.getElementById("nameInput").value;
 if (userName.trim() === "") {
  alert("Please enter your name.");
  return;
 }
 if (confirm("Are you ready for the quiz, " + userName + "?")) {
  startQuiz();
 }
}
// Function to handle Enter key press event
function handleKeyPress(event) {
 if (event.keyCode === 13) {
  // Enter key is pressed
  loadQuiz();
 }
}
function displayQuestion() {
 // Check if there are still questions left
 if (currentQuestionIndex >= quiz.length) {
  // All questions answered, show results page
  displayResults();
  return;
 }

 const question = quiz[currentQuestionIndex];

 // Update the HTML to display the question
 const container = document.getElementsByClassName("container")[0];
 container.innerHTML = `
        <h1>Question ${currentQuestionIndex + 1}</h1>
        <p>${question.text}</p>
        <form id="quizForm">
            ${question.options
             .map(
              (option, index) => `
                <label>
                    <input type="radio" name="ANSWER" value="${option}" />
                    ${option}
                </label>
            `
             )
             .join("")}
        </form>
        <button onclick="checkAnswer()">NEXT</button>
    `;
}

function checkAnswer() {
 // Get the selected answer
 const selectedOption = document.querySelector("input[type='radio']:checked");

 // Validate if an option is selected
 if (!selectedOption) {
  alert("Please select an option.");
  return;
 }

 // Check if the answer is correct
 const question = quiz[currentQuestionIndex];
 if (selectedOption.value === question.answer) {
  score += 1;
 }

 // Move to the next question
 currentQuestionIndex += 1;

 // Check if it's the last question
 if (currentQuestionIndex >= quiz.length) {
  displayResults();
 } else {
  displayQuestion();
 }
}

function displayResults() {
 const container = document.getElementsByClassName("container")[0];
 container.innerHTML = `
    <h1>Results</h1>
    <p>You scored ${score} out of ${quiz.length}.</p>
    <button onclick="startOver()">Start Over</button>
  `;

 // Reset variables
 score = 0;
 currentQuestionIndex = 0;
}

function startOver() {
 fetch("quiz.json")
  .then((response) => response.json())
  .then((data) => {
   quiz = getRandomQuestions(data, 5); // Get 5 random questions from the JSON data
   score = 0;
   currentQuestionIndex = 0;
   displayQuestion();
  })
  .catch((error) => console.log(error));
}
// Event listener for the start button
document.getElementById("startButton").addEventListener("click", loadQuiz);
document.getElementById("nameInput").addEventListener("keypress", handleKeyPress);
