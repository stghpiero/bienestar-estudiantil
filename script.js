document.addEventListener('DOMContentLoaded', () => {
    const mainScreen = document.getElementById('main-screen');
    const surveyScreen = document.getElementById('survey-screen');
    const resultScreen = document.getElementById('result-screen');
    const startSurveyBtn = document.getElementById('start-survey-btn');
    const submitSurveyBtn = document.getElementById('submit-survey-btn');
    const resetSurveyBtn = document.getElementById('reset-survey-btn');
    const surveyForm = document.getElementById('anxiety-survey-form');
    const resultMessage = document.getElementById('result-message');

    // Definición de las preguntas (puedes añadir más o modificarlas)
    const questions = [
        {
            id: 'q1',
            text: "¿Con qué frecuencia te sientes nervioso(a), ansioso(a) o con los nervios de punta?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q2',
            text: "¿Con qué frecuencia te sientes incapaz de parar o controlar las preocupaciones?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q3',
            text: "¿Con qué frecuencia te preocupas demasiado por diferentes cosas?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q4',
            text: "¿Con qué frecuencia tienes dificultad para relajarte?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q5',
            text: "¿Con qué frecuencia te sientes tan inquieto(a) que te resulta difícil permanecer sentado(a)?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q6',
            text: "¿Con qué frecuencia te irritas o enfadas fácilmente?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q7',
            text: "¿Con qué frecuencia tienes miedo de que algo terrible pueda pasar?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        }
    ];

    // Función para generar las preguntas en el formulario
    function renderQuestions() {
        surveyForm.innerHTML = ''; // Limpiar el formulario
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            const questionLabel = document.createElement('label');
            questionLabel.textContent = `${index + 1}. ${q.text}`;
            questionDiv.appendChild(questionLabel);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('question-options');

            q.options.forEach(option => {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = q.id; // Agrupar radio buttons por pregunta
                radioInput.value = option.score; // El valor es la puntuación
                radioInput.id = `${q.id}-${option.score}`; // ID único para cada opción

                const optionLabel = document.createElement('label');
                optionLabel.htmlFor = `${q.id}-${option.score}`;
                optionLabel.textContent = option.text;

                optionsDiv.appendChild(radioInput);
                optionsDiv.appendChild(optionLabel);
                optionsDiv.appendChild(document.createElement('br')); // Salto de línea para cada opción
            });
            questionDiv.appendChild(optionsDiv);
            surveyForm.appendChild(questionDiv);
        });
    }

    // Función para obtener el mensaje motivador según la puntuación
    function getMotivationMessageForScore(score) {
        const totalPossibleScore = questions.length * 3; // 3 es la puntuación máxima por pregunta

        if (score <= (totalPossibleScore * 0.15)) {
            return "Parece que manejas muy bien el estrés. ¡Sigue así, tu bienestar es clave para tu éxito académico!";
        } else if (score <= (totalPossibleScore * 0.35)) {
            return "Es normal sentir algo de estrés. Pequeños cambios en tu rutina o un respiro pueden ayudarte mucho. ¡Eres fuerte!";
        } else if (score <= (totalPossibleScore * 0.55)) {
            return "Reconocer lo que sientes es el primer paso. Busca momentos para relajarte, organiza tu tiempo y no dudes en hablar con alguien de confianza. ¡Puedes con esto!";
        } else if (score <= (totalPossibleScore * 0.80)) {
            return "Entiendo que estés pasando por un momento difícil. Es importante que te tomes un tiempo para ti, practiques técnicas de relajación y consideres buscar apoyo profesional. ¡No estás solo(a)!";
        } else {
            return "Tus sentimientos son válidos y es fundamental que busques ayuda. Habla con un consejero escolar, un psicólogo o un adulto de confianza. Hay recursos y personas dispuestas a apoyarte. ¡Tu salud mental es lo más importante!";
        }
    }

    // Event Listeners
    startSurveyBtn.addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        surveyScreen.classList.remove('hidden');
        renderQuestions(); // Generar las preguntas al entrar a la encuesta
    });

    submitSurveyBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        let totalScore = 0;
        let allAnswered = true;

        questions.forEach(q => {
            const selectedOption = document.querySelector(`input[name="${q.id}"]:checked`);
            if (selectedOption) {
                totalScore += parseInt(selectedOption.value);
            } else {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        const message = getMotivationMessageForScore(totalScore);
        resultMessage.textContent = `Tu puntuación total es: ${totalScore}. ${message}`;

        surveyScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    });

    resetSurveyBtn.addEventListener('click', () => {
        // Limpiar selecciones del formulario
        surveyForm.reset();
        // Volver a la pantalla principal
        resultScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    });

    // Iniciar la aplicación mostrando la pantalla principal al cargar
    mainScreen.classList.remove('hidden');
    surveyScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
});