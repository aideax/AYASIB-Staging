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
                if (!allWords.includes(element)) {
                    allWords.push(element)
                }
            })
        });
    }

    getAllPhrases()
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

    let questions = []

    for (let i = 0; i < 10; i++) {
        questions.push(getNewQuestion())
    }

    let DOM = {
        username: document.querySelector('#username'),
        progress: document.querySelector('.progress-bar'),
        choices: document.getElementById('choices'),
        question: document.querySelector('.question'),
        btnConfirm: document.querySelector('.confirm'),
        btnNext: document.querySelector('.next'),
        btnStart: document.querySelector('.start'),
        btnComment: document.querySelector('.btnComment'),
        commentIn: document.querySelector('.comment-in'),
        usernameText: document.querySelector('.comment-username'),
        commentContainer: document.querySelector('.comment-container'),
        commentMain: document.querySelector('.comment-main'),
        btnLoadComment: document.querySelector('.btnLoadComment'),
        commentSection: document.querySelector('.comments-section'),
        modalConfirm: document.querySelector('.modalConfirm'),
        modalLater: document.querySelector('.modalLater'),
        modalBtnLogin: document.querySelector('#modalBtnLogin')
    }




    let randomQuestions = questions.sort(() => Math.random() - .5)
    let currentIndex = -1
    let currentQuestion;
    let answer;
    let buttonPressed;
    let score = 0




    DOM.btnStart.addEventListener('click', nextQuestion);
    DOM.btnConfirm.addEventListener('click', checkAnswer);
    DOM.btnNext.addEventListener('click', nextQuestion);
    DOM.btnLoadComment.addEventListener('click', showCommentsSection)
    DOM.commentIn.addEventListener("focus", checkLogIn)
    DOM.btnComment.addEventListener('click', postComment)

    function nextQuestion() {
        clear();
        DOM.btnLoadComment.classList.remove('hide')
        DOM.commentSection.classList.add('hide')
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
            
            updateProgress()
            buttonPressed.classList.remove('neutral')
            buttonPressed.classList.add('correct')
            DOM.btnConfirm.classList.add('hide')
            DOM.btnNext.classList.remove('hide')
           
        } else {
            buttonPressed.classList.remove('neutral')
            buttonPressed.classList.add('wrong')
        }
    }






    //COMMENTS FUNCTIONS
    async function postComment() {
        if (DOM.username) {
            let id = currentQuestion.id
            let content = DOM.commentIn.value
            let comment = {}
            if (content) {
                comment.comment = content
                try {
                    const res = await axios.post(`http://localhost:5500/comments/${id}/add`, {
                        comment: content
                    })
                    console.log('Successfully added', res)
                    DOM.commentIn.value = ''

                    showSuccess()
                    loadComments()

                } catch (e) {
                    window.alert(`There has been an error! ${e.message}`)
                }
            }
        } else {
            if (window.confirm('You must be logged in to post a comment. Log in now?')) {
                window.location.href = "http://localhost:5500/user/login"
            }
        }

    }

    async function loadComments() {
        DOM.btnComment.classList.add('hide')
        DOM.commentIn.addEventListener('input', () => {
            if (DOM.commentIn.value !== '') {
                DOM.btnComment.classList.remove('hide')
            } else {
                DOM.btnComment.classList.add('hide')
            }
        })
        let questionid = currentQuestion.id
        let comments = []
        try {
            if (!DOM.username) {
                const res = await axios.get(`http://localhost:5500/comments/${questionid}/guest`)
                console.log(res)
                clearComments()
                res.data.forEach(element => {
                    comments.push(element)
                })
            } else {
                const res = await axios.get(`http://localhost:5500/comments/${questionid}`)
                console.log(res)
                clearComments()
                res.data.forEach(element => {
                    comments.push(element)
                })
            }

        } catch (e) {
            console.log(e.message)
        }

        if (comments.length >= 1) {
            console.log(comments)
            comments.forEach(element => {
                let newClone = DOM.commentMain.cloneNode(true)
                let newHTML = `<div class="card-header comment-username" id="${element.id}">
                                ${element.username}
                                </div>
                                <div class="card-body col-8">
                                <p class="card-text">${element.comment}</p>
                                <a class="btnLoadReply"><i class="far fa-comments"></i><small>  Toggle replies </small></a>
                                </div>
                                
                                <div class="container replies hide">
                                <div class="form-group">
                                <label for="comment-text">Leave a Reply</label>
                                <textarea class="form-control comment-in" id="comment-text" name="comment-text" rows="2"></textarea>
                                </div>
                                <div class="card-header comment-username">
                                    Username
                                </div>
                                <div class="card-body col-8">
                                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                </div>
                                </div>`
                newClone.classList.remove('hide')
                newClone.id = element.id
                newClone.innerHTML = newHTML
                DOM.commentContainer.appendChild(newClone)
                document.querySelector('.btnLoadReply').addEventListener('click', (e) => {
                    console.log('Target', e.target)
                    loadReplies(element)
                })
                
            })

        } else {
            let noCommentHTML = `<div class="alert alert-light" role="alert">This question has no comments yet. Start a conversation!</div>`
            DOM.commentContainer.innerHTML = noCommentHTML
        }
        location.href = '#comments'
    }

    function showCommentsSection() {
        DOM.commentSection.classList.toggle('hide')
        loadComments()
    }

    function clearComments() {
        while (DOM.commentContainer.firstElementChild) {
            DOM.commentContainer.removeChild(DOM.commentContainer.firstElementChild);
        }
        let reset = `<div class="card comment-main hide"><div class="wrapper"><div class="box1"><div class="card-header comment-username">Username</div><div class="row"><div class="card-body col-8"><p class="card-text">With supporting text below as a natural lead-in to additional content.</p></div></div></div><div class="box2"><button class="upvote"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16"class="bi bi-hand-thumbs-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" /></svg></button></div><div class="box3"><button class="downvote"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16"class="bi bi-hand-thumbs-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28v1c.563 0 .901.272 1.066.56.086.15.121.3.121.416 0 .12-.035.165-.04.17l-.354.353.353.354c.202.202.407.512.505.805.104.312.043.44-.005.488l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.415-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.353.352.373.714.267 1.021-.122.35-.396.593-.571.651-.653.218-1.447.224-2.11.164a8.907 8.907 0 0 1-1.094-.17l-.014-.004H9.62a.5.5 0 0 0-.595.643 8.34 8.34 0 0 1 .145 4.725c-.03.112-.128.215-.288.255l-.262.066c-.306.076-.642-.156-.667-.519-.075-1.081-.239-2.15-.482-2.85-.174-.502-.603-1.267-1.238-1.977C5.597 8.926 4.715 8.23 3.62 7.93 3.226 7.823 3 7.534 3 7.28V3.279c0-.26.22-.515.553-.55 1.293-.138 1.936-.53 2.491-.869l.04-.024c.27-.165.495-.296.776-.393.277-.096.63-.163 1.14-.163h3.5v-1H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" /></svg></button></div></div></div>`
        DOM.commentContainer.innerHTML = reset

    }

    async function loadReplies(e){
        console.log('Loading Replies', e)

    }



    function showSuccess() {
        let newHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">Comment added!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`
        let alert = document.createElement('div')
        alert.innerHTML = newHTML
        document.querySelector('.comments-section').prepend(alert)
    }




    async function updateProgress() {
        score++
        DOM.progress.setAttribute('aria-valuenow', (score * 10));
        DOM.progress.setAttribute('style', `width: ${score*10}%`)
        if(score === 10){
                if(!DOM.username){
                    console.log('no user')
                } else {
                    const res = await axios.post(`http://localhost:5500/lessons/${lesson}/done`, {
                        words: allWords,
                        phrases: allPhrases
                    })
                    console.log('Successfully added', res)
                    
                }

                return location.href = `http://localhost:5500/lessons/${lesson}/done`
                
                
        }
    }



    // RATINGS FUNCTIONS

    function voteListeners(e) {
        
        console.log(e.target)
        if (e.target.classList.contains('upvote')) {
            checkLogIn()
            if (e.target.classList.contains('voted')) {
                console.log('downvoting')
                downvoteComment()
            } else {
                console.log('upvoting')
                upvoteComment(e.target)
            }
        } else if (e.target.classList.contains('downvote')) {
            checkLogIn()
            console.log('downvoting')
            downvoteComment()
        }
    }

    async function upvoteComment(target) {
        let id = target.parentNode.parentNode.parentNode.id
        console.log('upvoting')
        console.log('You are clicking', target)
        target.classList.toggle('voted')
        target.firstChild.style.color = 'green'
        console.log('After click', target)
        const res = await axios.post(`http://localhost:5500/ratings/upvote/${id}`)
        console.log(res)

    }
    async function downvoteComment() {
        console.log('downvoting')
    }


















    async function login() {
        const res = await axios.post(`http://localhost:5500/users/login/quick`)
    }


    function checkLogIn() {
        if (!DOM.username) {
            $('#checkLoginModal').modal('show');
            DOM.modalConfirm.addEventListener('click', () => {
                $('#checkLoginModal').modal('hide')
                $('#loginModal').modal('show')
                DOM.modalBtnLogin.addEventListener('click', login)
            })
            DOM.modalLater.addEventListener('click', () => {
                $('#checkLoginModal').modal('hide')
            })
        }
    }

    function clear() {
        while (DOM.choices.firstElementChild) {
            DOM.choices.removeChild(DOM.choices.firstElementChild);
        }
        clearComments()
    }

    function init() {
        clear();
    }
    init();

}

showQuestions()