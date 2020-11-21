let lesson = document.querySelector('#lesson').textContent
let getRandom = (size) => {
    let rand = Math.floor((Math.random() * size) + 1)
    return rand
}
//GET THE SET OF QUESTIONS BASED ON THE ${LESSON} PROVIDED AS PARAMETER
let getQuestions = async () => {

    const res = await axios.get(`http://localhost:5500/lessons/get/${lesson}`)
    if (res.data === 'denied') {
        location.href = `http://localhost:5500/lessons`
    } else {
        return res.data
    }

}

getQuestions()

let showQuestions = async () => {
    let data = await getQuestions()
    let allPhrases = []


    const getAllPhrases = () => {
        data.forEach(el => {
            let phrase = {
                bisaya: el.phrase,
                english: el.translation
            }
            allPhrases.push(phrase)
        });

    }

    getAllPhrases()

    const getNewQuestion = () => {
        let question = {
            questionFormat: '',
            questionItem: '',
            correctItem: '',
            choices: []
        }
        let questionItemIndex = getRandom(allPhrases.length) - 1

        const getFormat = () => {
            let randFormat = getRandom(2)
            switch (randFormat) {
                case 1:
                    question.questionFormat = 'Which of these means '
                    break
                case 2:
                    question.questionFormat = 'Mark the correct translation of '
            }
        }

        const getQuestionAndCorrectItem = (lang) => {
            switch (lang) {
                case 1:
                    question.questionItem = allPhrases[questionItemIndex].bisaya
                    question.correctItem = allPhrases[questionItemIndex].english
                    question.choices.push(allPhrases[questionItemIndex].english)
                    break
                case 2:
                    question.questionItem = allPhrases[questionItemIndex].english
                    question.correctItem = allPhrases[questionItemIndex].bisaya
                    question.choices.push(allPhrases[questionItemIndex].bisaya)
                    break
            }
        }

        const getChoices = (lang) => {
            let selected = []
            selected.push(questionItemIndex)
            while (selected.length !== 4) {

                let randChoice = getRandom(allPhrases.length) - 1
                if (randChoice !== questionItemIndex && !selected.includes(randChoice)) {
                    switch (lang) {
                        case 1:
                            question.choices.push(allPhrases[randChoice].english)
                            selected.push(randChoice)
                            break
                        case 2:
                            question.choices.push(allPhrases[randChoice].bisaya)
                            selected.push(randChoice)
                            break
                    }
                }




            }

        }

        const buildQuestion = () => {
            let lang = getRandom(2)
            getFormat()
            getQuestionAndCorrectItem(lang)
            getChoices(lang)
        }

        buildQuestion()
        return question
    }






    let questions = [


    ]

    for (let i = 0; i < 10; i++) {
        questions.push(getNewQuestion())
    }

    let DOM = {
        choices: document.getElementById('choices'),
        question: document.querySelector('.question'),
        btnConfirm: document.querySelector('.confirm'),
        btnNext: document.querySelector('.next'),
        btnStart: document.querySelector('.start'),
    }




    let randomQuestions = questions.sort(() => Math.random() - .5)
    let currentIndex = -1
    let currentQuestion;
    let answer;
    let buttonPressed;
    function init() {
        clear();
    }


    DOM.btnStart.addEventListener('click', nextQuestion);
    DOM.btnConfirm.addEventListener('click', checkAnswer);
    DOM.btnNext.addEventListener('click', nextQuestion);

    function nextQuestion() {
        clear();
        DOM.btnStart.classList.add('hide')
        DOM.btnNext.classList.add('hide')
        DOM.btnConfirm.classList.remove('hide')
        currentIndex < randomQuestions.length - 1 ? currentIndex++ : currentIndex = 0;
        currentQuestion = randomQuestions[currentIndex]
        DOM.question.innerHTML = `${currentQuestion.questionFormat} <strong> ${currentQuestion.questionItem} </strong>`
        let randChoices = currentQuestion.choices.sort(() => Math.random() - .5)
        randChoices.forEach(choice => {
            let newChoice = document.createElement('button')
            newChoice.classList.add('btn', 'choice', 'neutral')
            newChoice.textContent = choice
            newChoice.addEventListener('click', setAnswer)
            DOM.choices.appendChild(newChoice)
        });
    }

    function setAnswer(e) {
        buttonPressed = e.target;
        answer = buttonPressed.textContent;
        let choices = Array.from(DOM.choices.children);
        choices.forEach(element => {
            buttonPressed === element ? element.classList.add('chosen') : element.classList.remove('chosen')
        });
    }

    function checkAnswer(e) {
        if (answer === currentQuestion.correctItem) {
            buttonPressed.classList.remove('neutral')
            buttonPressed.classList.add('correct')
            DOM.btnConfirm.classList.add('hide')
            DOM.btnNext.classList.remove('hide')
        } else {
            buttonPressed.classList.remove('neutral')
            buttonPressed.classList.add('wrong')
        }
    }










    function clear() {
        while (DOM.choices.firstElementChild) {
            DOM.choices.removeChild(DOM.choices.firstElementChild);
        }
    }

    init();

}

showQuestions()