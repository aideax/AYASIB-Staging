
let lesson = document.querySelector('#lesson').textContent
let getRandom = (size) => {
    let rand = Math.floor((Math.random() * size) + 1)
    return rand
}
//GET THE SET OF QUESTIONS BASED ON THE ${LESSON} PROVIDED AS PARAMETER
let getQuestions = async () => {

    const res = await axios.get(`http://localhost:5500/lessons/get/asd`)
    if (res.data === 'denied') {
        location.href = `http://localhost:5500/lessons`
    } else {
        console.log('Axios success')
        console.log(res)
        return res.data
    }
    
}

let showQuestions = async () => {
    let data = await getQuestions()
    let allPhrases = []
    let allWords = []

    const getAllPhrases = () => {
        data.forEach(el => {
            let phrase = {
                bisaya: el.phrase,
                english: el.translation,
                id: el._id
            }
            allPhrases.push(phrase)

            el.bisayaWords.forEach(element => {
                if(!allWords.includes(element)){
                    allWords.push(element)
                }
            })
        });
    }

    console.log('All words', allWords)
    getAllPhrases()
    console.log('Allphrases', allPhrases)
    const getNewQuestion = () => {
        let question = {
            questionFormat: '',
            questionItem: '',
            correctItem: '',
            choices: [],
            id: ''
        }
        let questionItemIndex = getRandom(allPhrases.length) - 1

        const getID = () => {
            question.id = allPhrases[questionItemIndex].id
        }

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
            getID()
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
    console.log(questions)
    
    let DOM = {
        progress: document.querySelector('.progress-bar'),
        choices: document.getElementById('choices'),
        question: document.querySelector('.question'),
        btnConfirm: document.querySelector('.confirm'),
        btnNext: document.querySelector('.next'),
        btnStart: document.querySelector('.start'),
        btnUpvote: document.querySelector('.upvote'),
        btnDownvote: document.querySelector('.downvote'),
        btnComment: document.querySelector('.btnComment'),
        commentIn: document.querySelector('.comment-in'),
        usernameText: document.querySelector('.comment-username')
    }




    let randomQuestions = questions.sort(() => Math.random() - .5)
    let currentIndex = -1
    let currentQuestion;
    let answer;
    let buttonPressed;
    let score = 0
    function init() {
        clear();
    }


    DOM.btnStart.addEventListener('click', nextQuestion);
    DOM.btnConfirm.addEventListener('click', checkAnswer);
    DOM.btnNext.addEventListener('click', nextQuestion);

    function nextQuestion() {
        clear();
        DOM.choices.classList.remove('hide')
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

    function updateProgress() {
        score ++
        DOM.progress.setAttribute('aria-valuenow', (score*10));
        DOM.progress.setAttribute('style',`width: ${score*10}%`)
    }

    function setAnswer(e) {
        buttonPressed = e.target;
        answer = buttonPressed.textContent;
        let choices = Array.from(DOM.choices.children);
        choices.forEach(element => {
            buttonPressed === element ? element.classList.add('chosen') : element.classList.remove('chosen')
        });
    }

    async function checkAnswer(e) {
       
        if (answer === currentQuestion.correctItem) {
            if(score !== 10){
                updateProgress()
                buttonPressed.classList.remove('neutral')
                buttonPressed.classList.add('correct')
                DOM.btnConfirm.classList.add('hide')
                DOM.btnNext.classList.remove('hide')
            } else{
                const res = await axios.post(`http://localhost:5500/lessons/${lesson}/done`, {words: allWords, phrases: allPhrases})
                console.log('Successfully added', res)
            }
        } else {
            buttonPressed.classList.remove('neutral')
            buttonPressed.classList.add('wrong')
        }
        
       
        
        
    }


    

    DOM.btnComment.addEventListener('click', postComment)


    async function postComment () {
        console.log('Submit Button presed')
        let id = currentQuestion.id
        console.log("id", id)
        let content = DOM.commentIn.value
        let comment = {}
        if(content){
            comment.comment = content
            try{
                const res = await axios.post(`http://localhost:5500/comments/${id}/add`, {comment: content})
                console.log('Successfully added', res)
            } catch(e){
                console.log(e.message)
            }
        } else{
            
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




