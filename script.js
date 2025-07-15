// --- Elementos del DOM ---
const mainScreen = document.getElementById('main-screen');
const userNameInput = document.getElementById('userNameInput');
const emojis = document.querySelectorAll('.emoji');
const startSurveyBtn = document.getElementById('startSurveyBtn');
const getPreliminaryHelpBtn = document.getElementById('getPreliminaryHelpBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');

const surveyScreen = document.getElementById('survey-screen');
const questionContainer = document.getElementById('question-container');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document = document.getElementById('nextQuestionBtn');
const submitSurveyBtn = document.getElementById('submitSurveyBtn');

const resultsScreen = document.getElementById('results-screen');
const resultsUserName = document.getElementById('resultsUserName');
const anxietyLevel = document.getElementById('anxietyLevel');
const moodReported = document.getElementById('moodReported');
const recommendationsDiv = document.getElementById('recommendations');
const newSurveyBtn = document.getElementById('newSurveyBtn');
const viewAdminPanelFromResultsBtn = document.getElementById('viewAdminPanelFromResults');
const anxietyChartCanvas = document.getElementById('anxietyChart'); // Referencia al canvas del gráfico

const adminPanel = document.getElementById('admin-panel');
const clearDataBtn = document.getElementById('clearDataBtn');
const backToMainFromAdminBtn = document.getElementById('backToMainFromAdmin');
const adminDataDiv = document.getElementById('admin-data-display');

const helpModal = document.getElementById('help-modal');
const closeHelpModalBtn = document.getElementById('closeHelpModal');

// --- Variables de Estado Globales ---
let currentUserName = '';
let selectedEmoji = '';
let currentQuestionIndex = 0;
let userAnswers = {}; // { q1: 'optionId', q2: 'optionId' }
let surveyScore = 0;
let myAnxietyChart = null; // Variable para almacenar la instancia del gráfico

// --- Preguntas de la Encuesta ---
const questions = [
    {
        id: 'q1',
        text: '¿Con qué frecuencia te has sentido nervioso/a, ansioso/a o con los nervios de punta?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q2',
        text: '¿Con qué frecuencia no has podido dejar de preocuparte o controlar la preocupación?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q3',
        text: '¿Con qué frecuencia te has preocupado demasiado por diferentes cosas?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q4',
        text: '¿Con qué frecuencia has tenido dificultad para relajarte?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q5',
        text: '¿Con qué frecuencia te has vuelto tan inquieto/a que te ha sido difícil mantenerte quieto/a?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q6',
        text: '¿Con qué frecuencia te has sentido fácilmente irritable o enojado/a?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    },
    {
        id: 'q7',
        text: '¿Con qué frecuencia has tenido miedo de que algo terrible pueda pasar?',
        options: [
            { text: 'Casi nunca', score: 0 },
            { text: 'Algunos días', score: 1 },
            { text: 'Más de la mitad de los días', score: 2 },
            { text: 'Casi todos los días', score: 3 }
        ]
    }
];

// --- Funciones de Navegación de Pantallas ---
function showScreen(screenToShow) {
    mainScreen.classList.add('hidden');
    surveyScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    adminPanel.classList.add('hidden');
    helpModal.classList.add('hidden'); // Asegura que el modal también se oculte al cambiar de pantalla

    screenToShow.classList.remove('hidden');

    // Destruir el gráfico existente al cambiar de pantalla
    if (myAnxietyChart) {
        myAnxietyChart.destroy();
        myAnxietyChart = null;
    }
}

function displayQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = `
        <div class="question">
            <p>${index + 1}. ${question.text}</p>
            <div class="options">
                ${question.options.map((option, i) => `
                    <label>
                        <input type="radio" name="${question.id}" value="${option.text}" data-score="${option.score}"
                        ${userAnswers[question.id] === option.text ? 'checked' : ''}>
                        ${option.text}
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    // Manejar visibilidad de botones de navegación
    prevQuestionBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextQuestionBtn.classList.toggle('hidden', currentQuestionIndex === questions.length - 1);
    submitSurveyBtn.classList.toggle('hidden', currentQuestionIndex !== questions.length - 1);
}

function calculateAnxietyLevel(score) {
    if (score >= 0 && score <= 4) {
        return 'Mínima';
    } else if (score >= 5 && score <= 9) {
        return 'Leve';
    } else if (score >= 10 && score <= 14) {
        return 'Moderada';
    } else if (score >= 15 && score <= 21) {
        return 'Grave';
    }
    return 'Desconocido';
}

function getRecommendations(score) {
    let recs = [];
    if (score >= 0 && score <= 4) {
        recs.push('Mantén tus hábitos saludables de manejo del estrés, como el ejercicio regular y una buena alimentación.');
        recs.push('Considera aprender técnicas básicas de relajación para el día a día.');
    } else if (score >= 5 && score <= 9) {
        recs.push('Practica técnicas de relajación (respiración profunda, meditación) diariamente.');
        recs.push('Identifica las fuentes de tu estrés y busca formas de gestionarlas.');
        recs.push('Mantente activo físicamente para liberar tensión.');
    } else if (score >= 10 && score <= 14) {
        recs.push('Considera hablar con un consejero escolar o un profesional de la salud mental. Ellos pueden ofrecerte estrategias personalizadas.');
        recs.push('Establece rutinas de sueño regulares y asegúrate de descansar lo suficiente.');
        recs.push('Limita la cafeína y otros estimulantes.');
        recs.push('Dedica tiempo a actividades que disfrutes y te relajen.');
    } else if (score >= 15 && score <= 21) {
        recs.push('Es fundamental buscar apoyo profesional lo antes posible. Habla con un psicólogo, psiquiatra o el personal de salud de tu institución.');
        recs.push('Evita el aislamiento. Conéctate con amigos y familiares que te apoyen.');
        recs.push('Practica la atención plena para anclarte en el presente.');
        recs.push('Revisa tu carga académica o laboral y busca formas de reducir el estrés.');
    }
    return recs;
}

// --- Manejo de Datos (localStorage) ---
function saveUserData(data) {
    let users = JSON.parse(localStorage.getItem('userData')) || {};
    users[data.userName] = data; // Usa el nombre de usuario como clave
    localStorage.setItem('userData', JSON.stringify(users));
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData')) || {};
}

function clearAllUserData() {
    if (confirm('¿Estás seguro de que quieres borrar TODOS los datos de usuario? Esta acción es irreversible.')) {
        localStorage.removeItem('userData');
        renderAdminPanel(); // Volver a renderizar el panel para mostrar que está vacío
        alert('Todos los datos de usuario han sido borrados.');
    }
}

function deleteUser(userName) {
    let users = getUserData();
    if (confirm(`¿Estás seguro de que quieres borrar los datos de ${userName}?`)) {
        delete users[userName];
        localStorage.setItem('userData', JSON.stringify(users));
        renderAdminPanel();
        alert(`Los datos de ${userName} han sido borrados.`);
    }
}

// --- Lógica del Panel de Administración ---
function renderAdminPanel() {
    showScreen(adminPanel);
    const allUserData = getUserData();
    adminDataDiv.innerHTML = '<h3>Datos de Usuarios:</h3>';

    if (Object.keys(allUserData).length === 0) {
        adminDataDiv.innerHTML += '<p>No hay datos de usuarios registrados aún.</p>';
        return;
    }

    const ul = document.createElement('ul');
    for (const userName in allUserData) {
        const userData = allUserData[userName];
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <strong>${userData.userName}</strong> - 
                Ánimo: ${userData.mood} - 
                Ansiedad: ${userData.anxietyLevel} (Puntaje: ${userData.score})
            </span>
            <button data-username="${userName}">Borrar</button>
        `;
        li.querySelector('button').addEventListener('click', (e) => {
            deleteUser(e.target.dataset.username);
        });
        ul.appendChild(li);
    }
    adminDataDiv.appendChild(ul);
}

// --- Event Listeners ---

// Pantalla Principal
emojis.forEach(emoji => {
    emoji.addEventListener('click', () => {
        emojis.forEach(e => e.classList.remove('selected'));
        emoji.classList.add('selected');
        selectedEmoji = emoji.dataset.mood;
    });
});

startSurveyBtn.addEventListener('click', () => {
    currentUserName = userNameInput.value.trim();
    if (currentUserName === '') {
        alert('Por favor, ingresa tu nombre para empezar la encuesta.');
        return;
    }
    if (selectedEmoji === '') {
        alert('Por favor, selecciona un emoji para indicar cómo te sientes.');
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = {};
    surveyScore = 0;
    displayQuestion(currentQuestionIndex);
    showScreen(surveyScreen);
});

getPreliminaryHelpBtn.addEventListener('click', () => {
    showScreen(helpModal);
});

// MODIFICADO: Agrega un nombre de usuario y contraseña al panel de administración
adminPanelBtn.addEventListener('click', () => {
    const userName = prompt('Ingresa el nombre de usuario para el Panel de Administración:');
    if (userName === 'capibara') {
        const password = prompt('Ingresa la contraseña para el Panel de Administración:');
        if (password === 'meza') {
            renderAdminPanel();
        } else {
            alert('Contraseña incorrecta.');
        }
    } else {
        alert('Nombre de usuario incorrecto.');
    }
});


// Pantalla de Encuesta
nextQuestionBtn.addEventListener('click', () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = document.querySelector(`input[name="${currentQuestion.id}"]:checked`);

    if (!selectedOption) {
        alert('Por favor, selecciona una opción para continuar.');
        return;
    }

    userAnswers[currentQuestion.id] = selectedOption.value; // Guardar el texto de la opción

    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
});

prevQuestionBtn.addEventListener('click', () => {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
});

submitSurveyBtn.addEventListener('click', () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = document.querySelector(`input[name="${currentQuestion.id}"]:checked`);

    if (!selectedOption) {
        alert('Por favor, selecciona una opción para enviar la encuesta.');
        return;
    }

    userAnswers[currentQuestion.id] = selectedOption.value; // Guardar el texto de la opción

    // Calcular el puntaje final
    surveyScore = 0;
    questions.forEach(q => {
        const answerText = userAnswers[q.id];
        if (answerText) {
            const chosenOption = q.options.find(opt => opt.text === answerText);
            if (chosenOption) {
                surveyScore += chosenOption.score;
            }
        }
    });

    const finalAnxietyLevel = calculateAnxietyLevel(surveyScore);
    const recommendations = getRecommendations(surveyScore);

    // Guardar datos del usuario
    saveUserData({
        userName: currentUserName,
        mood: selectedEmoji,
        score: surveyScore,
        anxietyLevel: finalAnxietyLevel,
        answers: userAnswers,
        timestamp: new Date().toISOString()
    });

    // Mostrar resultados
    resultsUserName.textContent = currentUserName;
    anxietyLevel.textContent = finalAnxietyLevel;
    moodReported.textContent = selectedEmoji;

    recommendationsDiv.innerHTML = '<h3>Recomendaciones Personalizadas:</h3>';
    if (recommendations.length > 0) {
        const ul = document.createElement('ul');
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            ul.appendChild(li);
        });
        recommendationsDiv.appendChild(ul);
    } else {
        recommendationsDiv.innerHTML += '<p>No hay recomendaciones específicas en este momento.</p>';
    }

    // --- Lógica para el Gráfico (Integración de Chart.js) ---
    // Destruir gráfico anterior si existe para evitar duplicados
    if (myAnxietyChart) {
        myAnxietyChart.destroy();
    }

    const questionLabels = questions.map((q, index) => `P${index + 1}`); // Etiquetas cortas para el gráfico
    const userScoresPerQuestion = questions.map(q => {
        const answerText = userAnswers[q.id];
        if (answerText) {
            const chosenOption = q.options.find(opt => opt.text === answerText);
            return chosenOption ? chosenOption.score : 0;
        }
        return 0;
    });

    myAnxietyChart = new Chart(anxietyChartCanvas, {
        type: 'bar', // Tipo de gráfico: 'bar', 'line', 'pie', etc.
        data: {
            labels: questionLabels,
            datasets: [{
                label: 'Puntaje por Pregunta',
                data: userScoresPerQuestion,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Puntaje Total', // Un segundo dataset para mostrar el puntaje total
                data: Array(questions.length).fill(surveyScore), // Rellena con el puntaje total para cada barra
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permitir que el tamaño se ajuste al contenedor
            scales: {
                y: {
                    beginAtZero: true,
                    max: 3, // El máximo puntaje posible por pregunta es 3
                    title: {
                        display: true,
                        text: 'Puntaje'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Preguntas'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Puntaje de Ansiedad por Pregunta y Total'
                }
            }
        }
    });
    // --- FIN Lógica para el Gráfico ---

    showScreen(resultsScreen);
});

// Pantalla de Resultados
newSurveyBtn.addEventListener('click', () => {
    // Resetear variables para una nueva encuesta
    currentUserName = '';
    userNameInput.value = ''; // Limpiar el input
    selectedEmoji = '';
    emojis.forEach(e => e.classList.remove('selected')); // Deseleccionar emojis
    currentQuestionIndex = 0;
    userAnswers = {};
    surveyScore = 0;
    showScreen(mainScreen);
});

viewAdminPanelFromResultsBtn.addEventListener('click', () => {
    const userName = prompt('Ingresa el nombre de usuario para el Panel de Administración:');
    if (userName === 'capibara') {
        const password = prompt('Ingresa la contraseña para el Panel de Administración:');
        if (password === 'meza') {
            renderAdminPanel();
        } else {
            alert('Contraseña incorrecta.');
        }
    } else {
        alert('Nombre de usuario incorrecto.');
    }
});

// Panel de Administración
clearDataBtn.addEventListener('click', clearAllUserData);
backToMainFromAdminBtn.addEventListener('click', () => {
    showScreen(mainScreen);
});

// Modal de Ayuda Rápida
closeHelpModalBtn.addEventListener('click', () => {
    helpModal.classList.add('hidden');
    // Si el modal se abrió desde la pantalla principal, volver a ella
    // Si se abrió desde los resultados, también volver a la principal para simplificar
    showScreen(mainScreen);
});

// --- Inicialización ---
// Asegurarse de que la pantalla principal sea la primera en mostrarse
document.addEventListener('DOMContentLoaded', () => {
    showScreen(mainScreen);
});