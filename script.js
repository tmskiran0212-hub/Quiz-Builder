/* =========================
   SIGNUP
========================= */

function signup() {

    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;
    let role = document.getElementById("signupRole").value;

    if (name === "" || email === "" || password === "") {
        document.getElementById("signupMessage").innerText =
            "Please fill all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        document.getElementById("signupMessage").innerText =
            "User already exists.";
        return;
    }

    users.push({
        name: name,
        email: email,
        password: password,
        role: role
    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("signupMessage").innerText =
        "Signup successful!";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}


/* =========================
   LOGIN
========================= */

function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        document.getElementById("loginMessage").innerText =
            "Invalid email or password.";
        return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "user.html";
    }
}


/* =========================
   LOGOUT
========================= */

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}


/* =========================
   ADMIN CHECK
========================= */

function checkAdmin() {

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user || user.role !== "admin") {
        window.location.href = "login.html";
    }
}


/* =========================
   USER CHECK
========================= */

function checkUser() {

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user || user.role !== "user") {
        window.location.href = "login.html";
    }
}


/* =========================
   QUIZ CREATION
========================= */

let questions = [];

function addQuestion() {

    let question = document.getElementById("question").value;

    let options = [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value
    ];

    let correctAnswer =
        Number(document.getElementById("correctAnswer").value);

    if (question === "" || options.some(option => option === "")) {
        alert("Please fill all question fields.");
        return;
    }

    questions.push({
        question: question,
        options: options,
        answer: correctAnswer
    });

    displayQuestionList();

    document.getElementById("question").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
}


/* =========================
   DISPLAY QUESTIONS
========================= */

function displayQuestionList() {

    let list = document.getElementById("questionList");

    list.innerHTML = "";

    questions.forEach((q, index) => {

        let div = document.createElement("div");

        div.className = "card";

        div.innerHTML =
            "<h3>Question " + (index + 1) + "</h3>" +
            "<p>" + q.question + "</p>";

        list.appendChild(div);
    });
}


/* =========================
   SAVE QUIZ
========================= */

function saveQuiz() {

    let title = document.getElementById("quizTitle").value;

    if (title === "" || questions.length === 0) {
        document.getElementById("quizMessage").innerText =
            "Enter quiz title and add questions.";
        return;
    }

    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    quizzes.push({
        id: Date.now(),
        title: title,
        questions: questions
    });

    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    document.getElementById("quizMessage").innerText =
        "Quiz saved successfully!";

    questions = [];
}


/* =========================
   DISPLAY QUIZZES
========================= */

function displayQuizzes() {

    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    let list = document.getElementById("quizList");

    if (quizzes.length === 0) {
        list.innerHTML = "<p>No quizzes available.</p>";
        return;
    }

    list.innerHTML = "";

    quizzes.forEach(quiz => {

        let card = document.createElement("div");

        card.className = "card";

        card.innerHTML =
            "<h2>" + quiz.title + "</h2>" +
            "<p>" + quiz.questions.length +
            " Questions</p>" +
            "<button onclick=\"openQuiz(" +
            quiz.id + ")\">Start Quiz</button>";

        list.appendChild(card);
    });
}


/* =========================
   OPEN QUIZ
========================= */

function openQuiz(id) {

    localStorage.setItem("selectedQuiz", id);

    window.location.href = "quiz.html";
}


/* =========================
   START QUIZ
========================= */

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

function startQuiz() {

    let quizzes =
        JSON.parse(localStorage.getItem("quizzes")) || [];

    let selectedId =
        Number(localStorage.getItem("selectedQuiz"));

    let quiz = quizzes.find(q => q.id === selectedId);

    if (!quiz) {
        alert("Quiz not found.");
        window.location.href = "user.html";
        return;
    }

    localStorage.setItem(
        "currentQuiz",
        JSON.stringify(quiz)
    );

    showQuestion();
}


/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    let quiz =
        JSON.parse(localStorage.getItem("currentQuiz"));

    let q = quiz.questions[currentQuestion];

    document.getElementById("quizTitle").innerText =
        quiz.title;

    document.getElementById("progress").innerText =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        quiz.questions.length;

    document.getElementById("quizQuestion").innerText =
        q.question;

    let options =
        document.getElementById("quizOptions");

    options.innerHTML = "";

    selectedAnswer = null;

    q.options.forEach((option, index) => {

        let div = document.createElement("div");

        div.className = "option";

        div.innerText = option;

        div.onclick = function () {

            selectedAnswer = index;

            document.querySelectorAll(".option")
                .forEach(item =>
                    item.classList.remove("selected")
                );

            div.classList.add("selected");
        };

        options.appendChild(div);
    });
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

    let quiz =
        JSON.parse(localStorage.getItem("currentQuiz"));

    if (selectedAnswer === null) {
        alert("Please select an answer.");
        return;
    }

    if (
        selectedAnswer ===
        quiz.questions[currentQuestion].answer
    ) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quiz.questions.length) {

        showQuestion();

    } else {

        localStorage.setItem("quizScore", score);
        localStorage.setItem(
            "quizTotal",
            quiz.questions.length
        );

        currentQuestion = 0;
        score = 0;

        window.location.href = "result.html";
    }
}


/* =========================
   QUIZ COUNT
========================= */

function displayQuizCount() {

    let quizzes =
        JSON.parse(localStorage.getItem("quizzes")) || [];

    let count = document.getElementById("quizCount");

    if (count) {
        count.innerText = quizzes.length;
    }
}