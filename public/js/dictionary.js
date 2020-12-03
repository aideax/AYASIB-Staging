let currentPage = 1
let previousPage
let nextPage = currentPage + 1
let lastPage




let DOM = {
    searchInput: document.querySelector('#wordSearch'),
    wordContainer: document.querySelector('.word-container'),
    pageController: document.querySelector('.pageController'),
    btnPrevious: document.querySelector('.btnPrevious'),
    btnNext: document.querySelector('.btnNext'),
    btnLastPage: document.querySelector('.btnLastPage'),
    btnFirstPage: document.querySelector('.btnFirstPage'),
    textNext: document.querySelector('.next-text'),
    textPrevious: document.querySelector('.previous-text'),
    textCurrent: document.querySelector('.current-text'),
    textLast: document.querySelector('.last-text'),
    moreNext: document.querySelector('.moreNext'),
    morePrevious: document.querySelector('.morePrevious')
}



async function updateCards() {
    try {
        let words = await axios.get(`http://localhost:5500/dictionary/search/${DOM.searchInput.value}/${currentPage}`)
        while (DOM.wordContainer.firstChild) {
            DOM.wordContainer.removeChild(DOM.wordContainer.lastChild)
        }
        console.log(words)
        words.data.results.forEach(word => {
            let newHTML = `<div class="card word-card">
            <div class="card-body">
              <div class="container">
                <div class="row">
                  <div class="col bisaya-col">
                    <small>Cebuano Word</small>
                    <h5 class="card-title bisaya-word">
                        ${word.bisayaWord} <small>[${word.partOfSpeech[0].toLowerCase()+ word.partOfSpeech.substring(1)}.]</small>
                    </h5>
                  </div>
                  <div class="col">
                    <small>English Word</small>
                    <h5 class="card-title english-word">
                      ${word.englishWord}
                    </h5>
                  </div>
                  <div class="w-100"></div>
                  <div class="col bisaya-col">
                    <small>Cebuano Meaning</small>
                    <p class="card-title bisaya-meaning">
                      ${word.bisayaMeaning}
                    </p>
                  </div>
                  <div class="col">
                    <small>English Meaning</small>
                    <p class="card-title english-meaning">
                      ${word.englishMeaning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>`
            let newCard = document.createElement('div')
            newCard.innerHTML = newHTML
            DOM.wordContainer.appendChild(newCard)
        })
        updatePagination(words.data)
    } catch (e) {
        console.log(e)
    }
}

function updatePagination(words) {
    DOM.pageController.classList.remove('hide')
    let lastPage = words.pages
    console.log(words.total)
    console.log(words.pages)
    let previous = DOM.textPrevious.textContent

    
    
}




DOM.searchInput.addEventListener('input', () => {
    currentPage = 1
    updateCards(currentPage)
})