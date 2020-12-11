let DOM = {
    card: document.querySelectorAll('.review-main'),
    btnCancelDelete: document.querySelector('.btnCancelDelete'),
    btnConfirmDelete: document.querySelector('.btnConfirmDelete')
}




let cardClicked = (e) => {
    if (e.target.classList.contains('edit')) {
        console.log('editing')
        showForms(e.target.parentNode.parentNode)
    }
    if (e.target.classList.contains('delete')) {
        console.log('deleting')
        confirmDelete(e.target.parentNode.parentNode)
    }
    if (e.target.classList.contains('accept')) {
        console.log('accepting')
        acceptSubmission(e.target.parentNode.parentNode)
    }

}

let acceptSubmission = async (e) => {
    let card = e
    let usernameElement = card.firstChild.nextElementSibling.firstChild.nextElementSibling
    let bisayaPhraseElement = usernameElement.nextElementSibling
    let bisayaMeaningElement = bisayaPhraseElement.nextElementSibling
    let englishPhraseElement = bisayaMeaningElement.nextElementSibling
    let englishMeaningElement = englishPhraseElement.nextElementSibling

    let username = usernameElement.textContent
    let bisayaWord = bisayaPhraseElement.firstChild.nextElementSibling.nextElementSibling.value
    let bisayaMeaning = bisayaMeaningElement.firstChild.nextElementSibling.nextElementSibling.value
    let englishWord = englishPhraseElement.firstChild.nextElementSibling.nextElementSibling.value
    let englishMeaning = englishMeaningElement.firstChild.nextElementSibling.nextElementSibling.value
    const deleteRes = await axios.delete(`http://localhost:5500/contribute/${e.id}/success`)
    const postRes = await axios.post(`http://localhost:5500/dictionary/add/success`, {
        bisayaWord: bisayaWord,
        englishWord: englishWord,
        bisayaMeaning: bisayaMeaning,
        englishMeaning: englishMeaning,
        partOfSpeech: ' ',
        contributor: username
    })
    window.location.href = `http://localhost:5500/contribute/review`
}


let confirmDelete = async (e) => {
    console.log('want to delete?')
    console.log(e)
    document.querySelector('#deleteID').action = `/contribute/${e.id}?_method=DELETE`
    console.log(document.querySelector('#deleteID'))
    $('#modalConfirmDelete').modal('show')
    DOM.btnCancelDelete.addEventListener('click', () => {
        $('#modalConfirmDelete').modal('hide')
    })

}

let showForms = async (e) => {
    console.log(e)
    try {
        const res = await axios.get(`http://localhost:5500/contribute/${e.id}`)
        let contribution = res.data
        let newHTML = `<div class="card review-main editCard" id="${contribution._id}">
                            <div class="card-body">
                            <h5 class="card-title review-user" id="">${contribution.contributor.username}</h5>
                            <div class="form-group">
                                <label for="bisayaPhrase">Cebuano Phrase</label>
                                <input type="text" class="form-control"  name="bisayaPhrase"
                                value="${contribution.bisayaPhrase}">
                            </div>
                            <div class="form-group">
                                <label for="bisayaMeaning">Cebuano Meaning</label>
                                <input type="text" class="form-control" name="bisayaMeaning"
                                value="${contribution.bisayaMeaning}">
                            </div>
                            <div class="form-group">
                                <label for="englishPhrase">English Phrase</label>
                                <input type="text" class="form-control"  name="englishPhrase"
                                value="${contribution.englishPhrase}">
                            </div>
                            <div class="form-group">
                                <label for="englishMeaning">English Meaning</label>
                                <input type="text" class="form-control"  name="englishMeaning"
                                value="${contribution.englishMeaning}">
                            </div>
                            <button type="submit" class="btn btn-success accept ">Accept Submission</button>
                        </div>
                        </div>`
        let editCard = document.createElement('div')
        editCard.innerHTML = newHTML
        e.parentNode.insertBefore(editCard, e.nextStibling)
        setEventListeners()

    } catch (error) {
        console.log(error.message)
    }

}


function setEventListeners() {
    let editCards = document.querySelectorAll('.editCard')
    editCards.forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept')) {
                acceptSubmission(e.target.parentNode.parentNode)
            }
        })
    });
}

function displayAcceptAlert() {

}


if (DOM.card) {
    DOM.card.forEach(card => {
        card.addEventListener('click', cardClicked)
    });

}