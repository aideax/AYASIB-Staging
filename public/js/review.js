

let DOM = {
    card: document.querySelectorAll('.review-main'),
    btnCancelDelete: document.querySelector('.btnCancelDelete'),
    btnConfirmDelete: document.querySelector('.btnConfirmDelete')
}



let acceptSubmission = async (e) => {
    console.log(e.target)
}

let cardClicked = (e) => {
    if(e.target.classList.contains('edit')){
        console.log('editing')
        showForms(e.target.parentNode.parentNode)
    }
    if(e.target.classList.contains('delete')){
        console.log('deleting')
        confirmDelete(e.target.parentNode.parentNode)
    }
}

let confirmDelete = async(e) => {
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
    try{
        const res = await axios.get(`http://localhost:5500/contribute/${e.id}`)
        let contribution = res.data
        let newHTML = `<div class="card review-main" id="${contribution.id}">
                            <div class="card-body">
                                <form action="/contribute/${e.id}" method="post">
                                    <h5 class="card-title review-user" id="${contribution.contributor}"></h5>
                                    <div class="form-group">
                                    <label for="bisayaPhrase">Bisaya Phrase</label>
                                    <input type="text" class="form-control" id="bisayaPhrase" name="bisayaPhrase"
                                        value="${contribution.bisayaPhrase}">
                                    </div>
                                    <div class="form-group">
                                    <label for="englishPhrase">English Phrase</label>
                                    <input type="text" class="form-control" id="englishPhrase" name="englishPhrase"
                                        value="${contribution.englishPhrase}">
                                    </div>
                                    <div class="form-group">
                                    <label for="lesson">Select Lesson</label>
                                    <select class="form-control" id="lesson" name="lesson">
                                        <option>Greetings</option>
                                        <option>Questions</option>
                                        <option>Family</option>
                                        <option>Travelling</option>
                                    </select>
                                    </div>
                                    <button type="submit" class="btn btn-success accept ">Accept Submission</button>
                                </form>
                            </div>
                        </div>`
        let editCard = document.createElement('div')
        editCard.innerHTML = newHTML
        e.parentNode.insertBefore(editCard, e.nextStibling)
        let acceptBtn = document.querySelector('.accept')
        acceptBtn.addEventListener('click', acceptSubmission)

    } catch (error) {
        console.log(error.message)
    }
    
}



if(DOM.card){
    DOM.card.forEach(card => {
        card.addEventListener('click', cardClicked)
    });
    
}
