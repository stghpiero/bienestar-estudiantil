// --- Elementos del DOM ---
const mainScreen = document.getElementById('main-screen');
const userNameInput = document.getElementById('userNameInput');
const emojis = document.querySelectorAll('.emoji');
const startSurveyBtn = document.getElementById('startSurveyBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const userStreakDisplay = document.getElementById('userStreakDisplay');

const surveyScreen = document.getElementById('survey-screen');
const progressBar = document.getElementById('progressBar');
const questionContainer = document.getElementById('question-container');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const submitSurveyBtn = document.getElementById('submitSurveyBtn');

const resultsScreen = document.getElementById('results-screen');
const resultsUserName = document.getElementById('resultsUserName');
const anxietyLevel = document.getElementById('anxietyLevel');
const moodReported = document.getElementById('moodReported');
const recommendationsDiv = document.getElementById('recommendations');
const newSurveyBtn = document.getElementById('newSurveyBtn');
const viewResourcesBtn = document.getElementById('viewResourcesBtn');

const historyScreen = document.getElementById('history-screen');
const historyUserName = document.getElementById('historyUserName');
const historyContainer = document.getElementById('history-container');
const backToMainFromHistoryBtn = document.getElementById('backToMainFromHistory');
const viewResourcesFromHistoryBtn = document.getElementById('viewResourcesFromHistory');

const adminPanel = document.getElementById('admin-panel');
const avgAnxietyScoreSpan = document.getElementById('avgAnxietyScore');
const anxietyLevelDistributionDiv = document.getElementById('anxietyLevelDistribution');
const userSearchInput = document.getElementById('userSearchInput');
const userSearchBtn = document.getElementById('userSearchBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const backToMainFromAdminBtn = document.getElementById('backToMainFromAdmin');
const adminDataDiv = document.getElementById('admin-data-display');

const resourcesModal = document.getElementById('resources-modal');
const closeResourcesModalBtn = document.getElementById('closeResourcesModal');
const resourcesContentDiv = document.getElementById('resources-content');

const userProfileModal = document.getElementById('user-profile-modal');
const closeUserProfileModalBtn = document.getElementById('closeUserProfileModal');
const profileUserName = document.getElementById('profileUserName');
const profileUserStreak = document.getElementById('profileUserStreak');
const profileHistoryTable = document.getElementById('profileHistoryTable');

const anxietyChartCanvas = document.getElementById('anxietyChart');


// --- Variables de Estado Globales ---
let currentUserName = '';
let selectedEmoji = '';
let currentQuestionIndex = 0;
let userAnswers = {};
let surveyScore = 0;
let myAnxietyChart = null;
const adminUsername = 'capibara';
const adminPassword = 'meza';

// --- Preguntas de la Encuesta (7 sets de 10 preguntas para cada día de la semana) ---
const weeklyQuestions = [
    // Domingo (0) - Enfoque en descanso y preparación
    [
        { id: 'q1', text: '¿Con qué frecuencia te has sentido ansioso/a por la semana que empieza?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia te ha costado concentrarte en tus tareas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia te has sentido irritable o con el temperamento corto?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te has sentido cansado/a sin razón aparente?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia has tenido problemas para conciliar el sueño?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia te ha costado disfrutar de actividades que solías hacer?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia te has sentido abrumado/a por tus pensamientos?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia has tenido ganas de llorar?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia te has sentido con la energía muy baja?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te has sentido solo/a o aislado/a de los demás?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Lunes (1) - Enfoque en inicio de semana
    [
        { id: 'q1', text: '¿Con qué frecuencia has tenido un nudo en el estómago o malestar por nervios?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia te has preocupado demasiado por diferentes cosas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia te ha costado dormir por la noche?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te ha costado relajarte en tu tiempo libre?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia te has sentido irritable o con el temperamento corto?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia te ha costado concentrarte en tus tareas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia te has sentido sin energía para empezar el día?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia te has sentido desconectado/a de tus amigos o compañeros?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia has tenido pensamientos acelerados?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te ha costado tomar decisiones?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Martes (2) - Enfoque en rendimiento y presión
    [
        { id: 'q1', text: '¿Con qué frecuencia te has sentido abrumado/a por tus responsabilidades académicas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia has tenido pensamientos negativos sobre ti mismo/a?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia has tenido dolores de cabeza o molestias físicas por estrés?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te has sentido nervioso/a o con los nervios de punta?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia te ha costado concentrarte en tus estudios?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia has notado cambios en tu apetito?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia has evitado responsabilidades por sentirte agobiado/a?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia has tenido sentimientos de desesperanza?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia te has sentido fácilmente irritable con los demás?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te has sentido cansado/a al despertar?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Miércoles (3) - Enfoque en motivación y estado de ánimo
    [
        { id: 'q1', text: '¿Con qué frecuencia te ha costado encontrar motivación para tus actividades?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia has perdido interés en actividades que antes disfrutabas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia te ha costado concentrarte en una sola cosa?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te has sentido inquieto/a o incapaz de quedarte quieto/a?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia te has sentido aburrido/a o con poca energía?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia has tenido ganas de llorar?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia has sentido que te falta el aire o que tu corazón se acelera?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia te has sentido sin esperanza sobre tu futuro?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia has notado que te aíslas de amigos y familia?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te ha costado relajarte, incluso en tus momentos de ocio?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Jueves (4) - Enfoque en interacciones y pensamientos
    [
        { id: 'q1', text: '¿Con qué frecuencia te has sentido solo/a o aislado/a?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia has evitado situaciones sociales o salir con amigos?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia has tenido pensamientos repetitivos y no deseados?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te ha costado tomar decisiones?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia te has sentido nervioso/a o con los nervios de punta?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia has notado cambios en tus hábitos de sueño?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia te has sentido demasiado irritable con los demás?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia te ha costado disfrutar de cosas que normalmente te gustan?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia has tenido un nudo en la garganta o en el estómago?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te has sentido abrumado/a por el trabajo escolar?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Viernes (5) - Enfoque en cierre de semana y liberación
    [
        { id: 'q1', text: '¿Con qué frecuencia te has sentido desesperanzado/a sobre el fin de semana?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia te ha costado dormir por la preocupación?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia has sentido que no puedes controlar tu respiración?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia te ha costado disfrutar del fin de semana?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia has evitado hablar de tus sentimientos con los demás?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia te has sentido abrumado/a por tus pensamientos?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia te has sentido irritado/a o impaciente con otras personas?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia has tenido pensamientos sobre errores pasados?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia te has sentido cansado/a o con poca energía?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia te ha costado concentrarte en tus tareas escolares?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ],
    // Sábado (6) - Enfoque en descanso y bienestar general
    [
        { id: 'q1', text: '¿Con qué frecuencia te has sentido con la energía muy baja?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q2', text: '¿Con qué frecuencia te ha costado salir de la cama?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q3', text: '¿Con qué frecuencia te has sentido aburrido/a sin motivo aparente?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q4', text: '¿Con qué frecuencia has tenido ganas de llorar?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q5', text: '¿Con qué frecuencia has notado que te aíslas de amigos y familia?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q6', text: '¿Con qué frecuencia has tenido pensamientos negativos sobre tu valor personal?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q7', text: '¿Con qué frecuencia te has sentido desconectado/a de tus emociones?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q8', text: '¿Con qué frecuencia te ha costado relajarte, incluso en tus momentos de ocio?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q9', text: '¿Con qué frecuencia te has sentido inquieto/a o incapaz de quedarte quieto/a?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] },
        { id: 'q10', text: '¿Con qué frecuencia has evitado hacer planes con tus amigos?', options: [{ text: 'Casi nunca', score: 0 }, { text: 'Algunos días', score: 1 }, { text: 'Más de la mitad de los días', score: 2 }, { text: 'Casi todos los días', score: 3 }] }
    ]
];

// Asignar el conjunto de preguntas del día de la semana actual
const today = new Date();
const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
const questions = weeklyQuestions[dayOfWeek];

// --- Funciones de Navegación de Pantallas ---
function showScreen(screenToShow) {
    [mainScreen, surveyScreen, resultsScreen, adminPanel, historyScreen, resourcesModal, userProfileModal].forEach(screen => {
        screen.classList.add('hidden');
    });
    screenToShow.classList.remove('hidden');

    if (myAnxietyChart) {
        myAnxietyChart.destroy();
        myAnxietyChart = null;
    }
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function displayQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = `
        <div class="question">
            <p>${index + 1}. ${question.text}</p>
            <div class="options">
                ${question.options.map(option => `
                    <label>
                        <input type="radio" name="${question.id}" value="${option.text}" data-score="${option.score}"
                        ${userAnswers[question.id] === option.text ? 'checked' : ''}>
                        ${option.text}
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    prevQuestionBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    nextQuestionBtn.classList.toggle('hidden', currentQuestionIndex === questions.length - 1);
    submitSurveyBtn.classList.toggle('hidden', currentQuestionIndex !== questions.length - 1);
    updateProgressBar();
}

function calculateAnxietyLevel(score) {
    // Escala ajustada para 10 preguntas
    if (score >= 0 && score <= 6) {
        return 'Mínima';
    } else if (score >= 7 && score <= 13) {
        return 'Leve';
    } else if (score >= 14 && score <= 20) {
        return 'Moderada';
    } else if (score >= 21 && score <= 30) {
        return 'Grave';
    }
    return 'Desconocido';
}

function getRecommendations(score, mood) {
    let recs = [];
    if (score >= 21 || mood === 'triste' || mood === 'preocupado') {
        recs.push('Considera hablar con un consejero o profesional. ¡No estás solo!');
        recs.push('Busca actividades que te relajen y te desconecten, como escuchar música o hacer ejercicio ligero.');
    }
    if (score >= 14 && score <= 20) {
        recs.push('Practica la respiración profunda: inhala 4s, sostén 7s, exhala 8s.');
        recs.push('Identifica las fuentes de tu estrés y busca formas de gestionarlas.');
    }
    if (score >= 7 && score <= 13) {
        recs.push('Recuerda tomarte un descanso. Sal a caminar o estírate.');
        recs.push('Habla con un amigo de confianza sobre cómo te sientes.');
    }
    if (score >= 0 && score <= 6) {
        recs.push('¡Vas por buen camino! Mantén tus hábitos saludables.');
        recs.push('Considera el mindfulness o meditación para mantener tu paz mental.');
    }
    if (mood === 'feliz' || mood === 'emocionado') {
        recs.push('¡Excelente! Mantén esa energía positiva y compártela con los demás.');
    }
    recs.push('Si te sientes abrumado, recuerda que buscar ayuda es un acto de valentía.');
    return [...new Set(recs)]; // Elimina duplicados
}

function renderResourcesContent() {
    resourcesContentDiv.innerHTML = `
        <h4>Técnicas de Respiración</h4>
        <p>
            La respiración profunda ayuda a calmar el sistema nervioso. Intenta la técnica 4-7-8:
            Inhala por la nariz durante 4 segundos, mantén el aire 7 segundos y exhala por la boca durante 8 segundos. Repite 3-4 veces.
        </p>
        <h4>Mindfulness</h4>
        <p>
            La atención plena (mindfulness) consiste en centrarse en el momento presente. Prueba concentrarte en una sensación (ej. el tacto de tu ropa o los sonidos a tu alrededor) durante un minuto sin juzgar tus pensamientos.
        </p>
        <h4>Consejos para el Estrés Académico</h4>
        <ul>
            <li>Organiza tu tiempo con un horario de estudio.</li>
            <li>Toma descansos cortos y frecuentes.</li>
            <li>Establece límites para el uso de pantallas.</li>
        </ul>
        <p>
            Si la ansiedad o la tristeza persisten, es importante que hables con un adulto de confianza, un consejero escolar o un profesional de la salud.
        </p>
    `;
}

// --- Manejo de Datos (localStorage) ---
function saveUserData(data) {
    let users = JSON.parse(localStorage.getItem('userData')) || {};
    let userEntry = users[data.userName] || { history: [], streak: 0, lastSurveyDate: null };

    // Lógica para la racha
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = userEntry.lastSurveyDate ? new Date(userEntry.lastSurveyDate) : null;
    let newStreak = userEntry.streak;

    if (lastDate) {
        const lastDay = new Date(lastDate);
        lastDay.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (today.getTime() === lastDay.getTime()) {
            // No hacer nada, ya se completó la encuesta hoy
        } else if (yesterday.getTime() === lastDay.getTime()) {
            newStreak++;
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    userEntry.history.push({
        mood: data.mood,
        score: data.score,
        anxietyLevel: data.anxietyLevel,
        answers: data.answers,
        timestamp: new Date().toISOString()
    });
    userEntry.streak = newStreak;
    userEntry.lastSurveyDate = today.toISOString();

    users[data.userName] = userEntry;
    localStorage.setItem('userData', JSON.stringify(users));
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData')) || {};
}

function clearAllUserData() {
    if (confirm('¿Estás seguro de que quieres borrar TODOS los datos de usuario? Esta acción es irreversible.')) {
        localStorage.removeItem('userData');
        renderAdminPanel();
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

function showUserProfileDetails(userName) {
    const allUserData = getUserData();
    const userEntry = allUserData[userName];

    if (!userEntry) {
        alert('Usuario no encontrado.');
        return;
    }

    profileUserName.textContent = `Perfil de ${userName}`;
    profileUserStreak.textContent = `Racha actual: ${userEntry.streak} días`;

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Estado de Ánimo</th>
                    <th>Nivel de Ansiedad</th>
                    <th>Puntaje</th>
                </tr>
            </thead>
            <tbody>
                ${userEntry.history.map(entry => `
                    <tr>
                        <td>${new Date(entry.timestamp).toLocaleDateString()}</td>
                        <td>${entry.mood}</td>
                        <td>${entry.anxietyLevel}</td>
                        <td>${entry.score}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    profileHistoryTable.innerHTML = tableHTML;
    userProfileModal.classList.remove('hidden');
}

// --- Lógica de Vistas (Paneles) ---
function renderAdminPanel(searchTerm = '') {
    showScreen(adminPanel);
    const allUserData = getUserData();
    
    // 1. Resumen General y Gráfica
    let totalScore = 0;
    let totalEntries = 0;
    const anxietyLevelsCount = { 'Mínima': 0, 'Leve': 0, 'Moderada': 0, 'Grave': 0 };
    const questionScores = Array(questions.length).fill(0);
    const questionCounts = Array(questions.length).fill(0);

    for (const userName in allUserData) {
        allUserData[userName].history.forEach(entry => {
            totalScore += entry.score;
            totalEntries++;
            if (anxietyLevelsCount.hasOwnProperty(entry.anxietyLevel)) {
                anxietyLevelsCount[entry.anxietyLevel]++;
            }
            questions.forEach((q, index) => {
                const answerText = entry.answers[q.id];
                if (answerText) {
                    const chosenOption = q.options.find(opt => opt.text === answerText);
                    if (chosenOption) {
                        questionScores[index] += chosenOption.score;
                        questionCounts[index]++;
                    }
                }
            });
        });
    }

    const avgScore = totalEntries > 0 ? (totalScore / totalEntries).toFixed(2) : 'N/A';
    avgAnxietyScoreSpan.textContent = avgScore;

    anxietyLevelDistributionDiv.innerHTML = ``;
    for (const level in anxietyLevelsCount) {
        const count = anxietyLevelsCount[level];
        const percentage = totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(1) : 0;
        anxietyLevelDistributionDiv.innerHTML += `
            <p>${level}: ${count} (${percentage}%)</p>
        `;
    }

    if (myAnxietyChart) {
        myAnxietyChart.destroy();
    }
    const questionLabels = questions.map((q, index) => `P${index + 1}`);
    const avgScoresPerQuestion = questionScores.map((score, index) => 
        questionCounts[index] > 0 ? (score / questionCounts[index]).toFixed(2) : 0);

    myAnxietyChart = new Chart(anxietyChartCanvas, {
        type: 'bar',
        data: {
            labels: questionLabels,
            datasets: [{
                label: 'Puntaje Promedio por Pregunta',
                data: avgScoresPerQuestion,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 3 },
                x: { title: { display: true, text: 'Preguntas' } }
            },
            plugins: {
                title: { display: true, text: 'Puntaje de Ansiedad Promedio por Pregunta' }
            }
        }
    });

    // 2. Búsqueda y listado de usuarios
    adminDataDiv.innerHTML = '<h3>Datos de Usuarios:</h3>';
    const usersArray = Object.entries(allUserData).map(([name, data]) => ({
        userName: name,
        streak: data.streak,
        history: data.history
    }));

    const filteredUsers = usersArray.filter(user => user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filteredUsers.length === 0) {
        adminDataDiv.innerHTML += '<p>No se encontraron datos de usuarios.</p>';
        return;
    }

    const ul = document.createElement('ul');
    filteredUsers.forEach(userData => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <strong>${userData.userName}</strong>
                <br>
                <small>Racha: ${userData.streak} días</small>
            </span>
            <div>
                <button class="admin-button" data-action="view-profile" data-username="${userData.userName}">Ver Perfil</button>
                <button class="admin-button delete-btn" data-action="delete" data-username="${userData.userName}">Borrar</button>
            </div>
        `;
        ul.appendChild(li);
    });

    adminDataDiv.innerHTML = '';
    adminDataDiv.appendChild(ul);
}

function renderHistoryPanel() {
    showScreen(historyScreen);
    historyUserName.textContent = currentUserName;
    historyContainer.innerHTML = '';
    
    const allUserData = getUserData();
    const userEntry = allUserData[currentUserName];

    if (!userEntry || userEntry.history.length === 0) {
        historyContainer.innerHTML = '<p>No hay encuestas registradas para este usuario.</p>';
        return;
    }

    userEntry.history.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('history-entry');
        entryDiv.innerHTML = `
            <strong>Fecha:</strong> ${new Date(entry.timestamp).toLocaleString()} <br>
            <strong>Estado de Ánimo:</strong> ${entry.mood} <br>
            <strong>Puntaje:</strong> ${entry.score} <br>
            <strong>Nivel de Ansiedad:</strong> ${entry.anxietyLevel}
        `;
        historyContainer.appendChild(entryDiv);
    });
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
        alert('Por favor, ingresa tu nombre para empezar.');
        return;
    }
    if (selectedEmoji === '') {
        alert('Por favor, selecciona un emoji para indicar cómo te sientes.');
        return;
    }
    
    const allUserData = getUserData();
    const userEntry = allUserData[currentUserName];
    const today = new Date();
    today.setHours(0,0,0,0);
    const lastSurveyDate = userEntry && userEntry.lastSurveyDate ? new Date(userEntry.lastSurveyDate) : null;

    if (lastSurveyDate && today.getTime() === lastSurveyDate.getTime()) {
        alert('Ya has completado la encuesta de hoy. Vuelve mañana para una nueva encuesta.');
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = {};
    surveyScore = 0;
    displayQuestion(currentQuestionIndex);
    showScreen(surveyScreen);
});

viewHistoryBtn.addEventListener('click', () => {
    currentUserName = userNameInput.value.trim();
    if (currentUserName === '') {
        alert('Por favor, ingresa tu nombre para ver el historial.');
        return;
    }
    renderHistoryPanel();
});

adminPanelBtn.addEventListener('click', () => {
    const userName = prompt('Ingresa el nombre de usuario para el Panel de Administración:');
    if (userName === adminUsername) {
        const password = prompt('Ingresa la contraseña:');
        if (password === adminPassword) {
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

    userAnswers[currentQuestion.id] = selectedOption.value;

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

    userAnswers[currentQuestion.id] = selectedOption.value;

    surveyScore = questions.reduce((sum, q) => {
        const answerText = userAnswers[q.id];
        const chosenOption = q.options.find(opt => opt.text === answerText);
        return sum + (chosenOption ? chosenOption.score : 0);
    }, 0);

    const finalAnxietyLevel = calculateAnxietyLevel(surveyScore);
    const recommendations = getRecommendations(surveyScore, selectedEmoji);

    saveUserData({
        userName: currentUserName,
        mood: selectedEmoji,
        score: surveyScore,
        anxietyLevel: finalAnxietyLevel,
        answers: userAnswers,
    });

    resultsUserName.textContent = currentUserName;
    anxietyLevel.textContent = finalAnxietyLevel;
    moodReported.textContent = selectedEmoji;

    recommendationsDiv.innerHTML = '<h3>Recomendaciones Personalizadas:</h3>';
    const ul = document.createElement('ul');
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        ul.appendChild(li);
    });
    recommendationsDiv.appendChild(ul);

    showScreen(resultsScreen);
});

// Pantalla de Resultados
newSurveyBtn.addEventListener('click', () => {
    userNameInput.value = '';
    emojis.forEach(e => e.classList.remove('selected'));
    currentUserName = '';
    selectedEmoji = '';
    showScreen(mainScreen);
    updateMainScreenState();
});
viewResourcesBtn.addEventListener('click', () => {
    renderResourcesContent();
    resourcesModal.classList.remove('hidden');
});

// Pantalla de Historial
backToMainFromHistoryBtn.addEventListener('click', () => showScreen(mainScreen));
viewResourcesFromHistoryBtn.addEventListener('click', () => {
    renderResourcesContent();
    resourcesModal.classList.remove('hidden');
});

// Panel de Administración
userSearchBtn.addEventListener('click', () => {
    renderAdminPanel(userSearchInput.value);
});
clearDataBtn.addEventListener('click', clearAllUserData);
backToMainFromAdminBtn.addEventListener('click', () => showScreen(mainScreen));
adminDataDiv.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const userName = e.target.dataset.username;
    if (action === 'delete') {
        deleteUser(userName);
    } else if (action === 'view-profile') {
        showUserProfileDetails(userName);
    }
});

// Modal de Recursos
closeResourcesModalBtn.addEventListener('click', () => {
    resourcesModal.classList.add('hidden');
});

// Modal de Perfil de Usuario
closeUserProfileModalBtn.addEventListener('click', () => {
    userProfileModal.classList.add('hidden');
});


// Función para actualizar la pantalla principal (visibilidad de botones y racha)
function updateMainScreenState() {
    const users = getUserData();
    const userName = userNameInput.value.trim();
    if (users[userName] && users[userName].history.length > 0) {
        viewHistoryBtn.classList.remove('hidden');
        userStreakDisplay.textContent = `¡Tu racha actual es de ${users[userName].streak} días!`;
        userStreakDisplay.classList.remove('hidden');
    } else {
        viewHistoryBtn.classList.add('hidden');
        userStreakDisplay.classList.add('hidden');
    }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    showScreen(mainScreen);
    userNameInput.addEventListener('input', updateMainScreenState);
});