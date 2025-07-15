document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos HTML ---
    const mainScreen = document.getElementById('main-screen');
    const surveyScreen = document.getElementById('survey-screen');
    const resultScreen = document.getElementById('result-screen');
    const adminPanelScreen = document.getElementById('admin-panel-screen');

    const startSurveyBtn = document.getElementById('start-survey-btn');
    const submitSurveyBtn = document.getElementById('submit-survey-btn');
    const resetSurveyBtn = document.getElementById('reset-survey-btn');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const backToMainFromAdminBtn = document.getElementById('back-to-main-from-admin');

    const surveyForm = document.getElementById('anxiety-survey-form');
    const resultMessage = document.getElementById('result-message');
    const userNameInput = document.getElementById('userName');
    const adminDataDiv = document.getElementById('admin-data');

    let currentUserName = ''; // Variable para almacenar el nombre del usuario actual
    let selectedEmoji = ''; // Variable para almacenar el emoji seleccionado

    // --- Definición de las preguntas (AHORA 10 PREGUNTAS) ---
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
        },
        {
            id: 'q8',
            text: "¿Con qué frecuencia tienes problemas para concentrarte en tus estudios o tareas?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q9',
            text: "¿Con qué frecuencia sientes cansancio o poca energía, incluso después de dormir?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        },
        {
            id: 'q10',
            text: "¿Con qué frecuencia experimentas tensión muscular, dolores de cabeza o malestar físico debido al estrés?",
            options: [
                { text: "Casi nunca", score: 0 },
                { text: "Algunos días", score: 1 },
                { text: "Más de la mitad de los días", score: 2 },
                { text: "Casi todos los días", score: 3 }
            ]
        }
    ];

    // --- FUNCIONES DE ALMACENAMIENTO DE DATOS ---

    // Obtener todos los datos de usuarios desde localStorage
    function getAllUserData() {
        const data = localStorage.getItem('anxietySurveyData');
        return data ? JSON.parse(data) : {}; // Si no hay datos, retorna un objeto vacío
    }

    // Guardar todos los datos de usuarios en localStorage
    function saveAllUserData(data) {
        localStorage.setItem('anxietySurveyData', JSON.stringify(data));
    }

    // Función para obtener el inicio de la semana (Lunes) de una fecha dada
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para Lunes
        const startOfWeek = new Date(d.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día
        return startOfWeek.toISOString().slice(0, 10);
    }

    // Añadir o actualizar la respuesta de un usuario para un día específico
    function addOrUpdateUserResponse(userName, score, selectedEmoji) {
        const allData = getAllUserData();
        if (!allData[userName]) {
            allData[userName] = []; // Si el usuario no existe, crea un array para sus respuestas
        }

        const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
        
        // Buscar si ya hay una respuesta para hoy
        const existingEntryIndex = allData[userName].findIndex(entry => entry.date === today);

        if (existingEntryIndex > -1) {
            // Actualizar la entrada existente
            allData[userName][existingEntryIndex].score = score;
            allData[userName][existingEntryIndex].emoji = selectedEmoji; // Actualizar el emoji
            allData[userName][existingEntryIndex].timestamp = new Date().toISOString(); // Actualizar hora
        } else {
            // Añadir nueva entrada si no existe para hoy
            allData[userName].push({
                date: today,
                score: score,
                emoji: selectedEmoji, // Guardar el emoji
                timestamp: new Date().toISOString()
            });
        }
        saveAllUserData(allData);
        alert(`¡Gracias ${userName}! Tu puntuación de hoy (${today}) ha sido guardada.`);
    }

    // --- Función para generar las preguntas en el formulario ---
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
                radioInput.name = q.id;
                radioInput.value = option.score;
                radioInput.id = `${q.id}-${option.score}`;

                const optionLabel = document.createElement('label');
                optionLabel.htmlFor = `${q.id}-${option.score}`;
                optionLabel.textContent = option.text;

                optionsDiv.appendChild(radioInput);
                optionsDiv.appendChild(optionLabel);
                optionsDiv.appendChild(document.createElement('br'));
            });
            questionDiv.appendChild(optionsDiv);
            surveyForm.appendChild(questionDiv);
        });
    }

    // --- FUNCIONES PARA OBTENER MENSAJES ALEATORIOS Y NIVELES DE ANSIEDAD ---
    function getRandomMessage(messagesArray) {
        const randomIndex = Math.floor(Math.random() * messagesArray.length);
        return messagesArray[randomIndex];
    }

    const motivationMessages = {
        level0: [
            "¡Excelente! Parece que manejas muy bien el estrés. ¡Sigue así, tu bienestar es clave para tu éxito académico!",
            "Estás demostrando una gran fortaleza y equilibrio. ¡Mantén esa actitud positiva!",
            "Tu tranquilidad es una inspiración. ¡Continúa cultivando ese bienestar!",
            "Muy bien. Tus niveles de estrés son bajos, un buen signo de que estás en el camino correcto."
        ],
        level1: [
            "Es normal sentir algo de estrés ocasionalmente. Pequeños ajustes en tu rutina o un respiro pueden ayudarte mucho. ¡Eres fuerte!",
            "Identificar el estrés es el primer paso. Considera pequeñas pausas o actividades relajantes. ¡Confía en ti!",
            "Un poco de preocupación es natural. Recuerda que cada desafío es una oportunidad para crecer.",
            "Estás bien, solo un pequeño recordatorio para cuidarte. Tu bienestar es prioritario."
        ],
        level2: [
            "Reconocer lo que sientes es el primer paso hacia el bienestar. Busca momentos para relajarte, organiza tu tiempo y no dudes en hablar con alguien de confianza. ¡Puedes con esto!",
            "Estás en un punto donde puedes tomar el control. Intenta técnicas de respiración, una caminata, o habla con alguien que te entienda. ¡No estás solo(a)!",
            "Tu sentir es válido. Enfócate en una cosa a la vez y celebra tus pequeños logros. ¡Pide ayuda si la necesitas!",
            "Es un buen momento para reflexionar sobre lo que te causa estrés y buscar soluciones prácticas. ¡Cada paso cuenta!"
        ],
        level3: [
            "Entiendo que estés pasando por un momento difícil. Es importante que te tomes un tiempo para ti, practiques técnicas de relajación y consideres buscar apoyo profesional. ¡No estás solo(a)! Puedes agendar una cita con Bienestar Estudiantil de tu universidad.",
            "Tus sentimientos son una señal para buscar más apoyo. No dudes en acercarte a un consejero o un profesional. ¡Mereces sentirte mejor!",
            "La vida académica puede ser exigente. Recuerda que cuidar tu salud mental es tan importante como tus estudios. ¡Hay recursos esperando para ayudarte!",
            "Respira profundo. Es momento de priorizar tu paz. Busca apoyo y establece límites. ¡Eres más fuerte de lo que crees!"
        ],
        level4: [
            "Tus sentimientos son válidos y es fundamental que busques ayuda urgente. Habla con un consejero escolar, un psicólogo o un adulto de confianza inmediatamente. Hay recursos y personas dispuestas a apoyarte. ¡Tu salud mental es lo más importante! No dudes en contactar a los servicios de salud mental de tu universidad.",
            "Es crucial que recibas apoyo profesional ahora mismo. No estás solo(a) en esto y hay muchos recursos disponibles para ayudarte a sentirte mejor. ¡Da el primer paso hoy!",
            "La valentía de reconocer que necesitas ayuda es inmensa. Acércate a los servicios de apoyo. Ellos están ahí para guiarte en este proceso. ¡Hay esperanza y soluciones!",
            "Tu bienestar emocional es primordial. No pospongas buscar asistencia. Comparte lo que sientes con alguien de confianza y busca orientación profesional sin demora."
        ]
    };

    function getMotivationMessageForScore(score) {
        // Cálculo del total posible de puntos basado en el número actual de preguntas
        const totalPossibleScore = questions.length * 3;

        if (score <= (totalPossibleScore * 0.15)) { // 0-15% del total
            return getRandomMessage(motivationMessages.level0);
        } else if (score <= (totalPossibleScore * 0.35)) { // 16-35% del total
            return getRandomMessage(motivationMessages.level1);
        } else if (score <= (totalPossibleScore * 0.55)) { // 36-55% del total
            return getRandomMessage(motivationMessages.level2);
        } else if (score <= (totalPossibleScore * 0.80)) { // 56-80% del total
            return getRandomMessage(motivationMessages.level3);
        } else { // 81-100% del total
            return getRandomMessage(motivationMessages.level4);
        }
    }

    // --- LÓGICA DEL PANEL DE ADMINISTRACIÓN ---
    function renderAdminPanel() {
        const allUserData = getAllUserData();
        adminDataDiv.innerHTML = '<h3>Datos de Usuarios:</h3>';

        if (Object.keys(allUserData).length === 0) {
            adminDataDiv.innerHTML += '<p>No hay datos de usuarios registrados aún.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';

        for (const userName in allUserData) {
            const li = document.createElement('li');
            li.style.marginBottom = '20px';
            li.style.border = '1px solid #eee';
            li.style.padding = '15px';
            li.style.borderRadius = '8px';
            li.style.backgroundColor = '#f9f9f9';
            li.style.textAlign = 'left';

            const userTitle = document.createElement('h4');
            userTitle.textContent = `Usuario: ${userName}`;
            userTitle.style.color = '#007bff';
            userTitle.style.marginBottom = '10px';
            li.appendChild(userTitle);

            const userResponses = allUserData[userName]; // Todas las respuestas históricas de este usuario
            
            if (userResponses.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No hay respuestas registradas para este usuario.';
                li.appendChild(p);
            } else {
                const responseList = document.createElement('ul');
                responseList.style.listStyle = 'disc';
                responseList.style.paddingLeft = '20px';

                // Ordenar todas las respuestas por fecha (más reciente primero)
                userResponses.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Filtrar para obtener solo las respuestas de la semana actual
                const currentWeekStart = getStartOfWeek(new Date());
                const weeklyResponses = userResponses.filter(response => getStartOfWeek(response.date) === currentWeekStart);
                
                let weeklyScore = 0;
                let dailyCounts = 0;
                let emojiCounts = {}; // Para contar la frecuencia de cada emoji en la semana

                // Mostrar las respuestas de la semana actual en la lista
                weeklyResponses.forEach(response => {
                    const responseLi = document.createElement('li');
                    responseLi.textContent = `Fecha: ${response.date}, Puntuación: ${response.score}, Emoji: ${response.emoji || 'N/A'}`;
                    responseList.appendChild(responseLi);
                    weeklyScore += response.score;
                    dailyCounts++;

                    // Contar emojis para el análisis semanal
                    if (response.emoji) {
                        emojiCounts[response.emoji] = (emojiCounts[response.emoji] || 0) + 1;
                    }
                });

                li.appendChild(responseList);

                // Análisis semanal detallado
                if (dailyCounts > 0) {
                    // El mensaje de ansiedad se basa en la suma total de la semana
                    const anxietyLevelMessage = getMotivationMessageForScore(weeklyScore); 
                    // Tomamos la primera frase del mensaje para el resumen
                    const summaryMessage = anxietyLevelMessage.split('.')[0]; 

                    const weeklyAnalysis = document.createElement('p');
                    weeklyAnalysis.style.fontWeight = 'bold';
                    weeklyAnalysis.style.marginTop = '10px';
                    weeklyAnalysis.style.color = '#333';
                    weeklyAnalysis.innerHTML = `Análisis de la Semana Actual (<span style="color: #007bff;">${currentWeekStart}</span>):<br>
                                                 Días con respuesta: <span style="color: #007bff;">${dailyCounts}</span><br>
                                                 Puntuación Total Semanal: <span style="color: #007bff;">${weeklyScore}</span><br>
                                                 Nivel de Ansiedad Sugerido: <span style="color: #d9534f;">${summaryMessage}</span>`;
                    
                    // Encontrar el emoji más frecuente de la semana
                    let mostFrequentEmoji = 'N/A';
                    let maxCount = 0;
                    for (const emoji in emojiCounts) {
                        if (emojiCounts[emoji] > maxCount) {
                            maxCount = emojiCounts[emoji];
                            mostFrequentEmoji = emoji;
                        }
                    }
                    weeklyAnalysis.innerHTML += `<br>Te has sentido principalmente: <span style="font-size: 1.5em;">${mostFrequentEmoji}</span>`;

                    li.appendChild(weeklyAnalysis);
                } else {
                     const p = document.createElement('p');
                     p.textContent = 'No hay respuestas en la semana actual para un análisis.';
                     li.appendChild(p);
                }

                // Opcional: Si quieres mostrar TODO el historial, no solo la semana actual, puedes descomentar esto:
                // const historyTitle = document.createElement('h5');
                // historyTitle.textContent = 'Historial Completo:';
                // li.appendChild(historyTitle);
                // const historyList = document.createElement('ul');
                // historyList.style.listStyle = 'circle';
                // historyList.style.paddingLeft = '20px';
                // userResponses.forEach(response => {
                //     const historyLi = document.createElement('li');
                //     historyLi.textContent = `Fecha: ${response.date}, Puntuación: ${response.score}, Emoji: ${response.emoji || 'N/A'}`;
                //     historyList.appendChild(historyLi);
                // });
                // li.appendChild(historyList);
            }
            ul.appendChild(li);
        }
        adminDataDiv.appendChild(ul);
    }

    // --- Event Listeners ---
    // Evento para seleccionar emoji
    document.querySelectorAll('.emojis span').forEach(emojiSpan => {
        emojiSpan.addEventListener('click', () => {
            // Remover borde de todos los emojis
            document.querySelectorAll('.emojis span').forEach(s => s.style.border = 'none');
            // Añadir borde al emoji seleccionado
            emojiSpan.style.border = '2px solid #007bff';
            emojiSpan.classList.add('selected'); // Añadir clase para estilos CSS
            selectedEmoji = emojiSpan.textContent; // Guardar el emoji
        });
    });

    startSurveyBtn.addEventListener('click', () => {
        currentUserName = userNameInput.value.trim(); // Obtener y limpiar el nombre
        if (currentUserName === '') {
            alert('Por favor, ingresa tu nombre para empezar la encuesta.');
            return;
        }
        if (selectedEmoji === '') { // Validar selección de emoji
            alert('Por favor, selecciona un emoji para indicar cómo te sientes.');
            return;
        }
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

        // Guardar la respuesta del usuario, incluyendo el emoji
        addOrUpdateUserResponse(currentUserName, totalScore, selectedEmoji);

        const message = getMotivationMessageForScore(totalScore);
        resultMessage.textContent = `Hola ${currentUserName}, tu puntuación de hoy es: ${totalScore}. ${message}`;
        
        surveyScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    });

    resetSurveyBtn.addEventListener('click', () => {
        // Limpiar selecciones del formulario
        surveyForm.reset();
        // Volver a la pantalla principal
        resultScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        userNameInput.value = ''; // Limpiar el campo de nombre
        currentUserName = '';
        selectedEmoji = ''; // Limpiar el emoji seleccionado
        // Quitar el borde del emoji seleccionado anteriormente
        document.querySelectorAll('.emojis span').forEach(s => s.style.border = 'none');
        document.querySelectorAll('.emojis span').forEach(s => s.classList.remove('selected'));
    });

    // Evento para el botón del panel de administración
    adminPanelBtn.addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        adminPanelScreen.classList.remove('hidden');
        renderAdminPanel(); // Renderizar los datos de administración
    });

    // Evento para volver desde el panel de administración
    backToMainFromAdminBtn.addEventListener('click', () => {
        adminPanelScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    });

    // Iniciar la aplicación mostrando la pantalla principal al cargar
    mainScreen.classList.remove('hidden');
    surveyScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    adminPanelScreen.classList.add('hidden'); // Asegurarse de que el admin panel esté oculto al inicio
});