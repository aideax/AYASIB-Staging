let eInput = document.getElementById('ePhrase')
let bInput = document.getElementById('bPhrase')
let lesson = document.getElementById('lesson')
let title = document.getElementById('title')
console.log("Loaded addPhrase.js")

let splitWords = (bPhrase, ePhrase, lesson) => {
    
    let splitBisaya = bPhrase.split(" ")
    let splitEnglish = ePhrase.split(" ")
    return {
        phrase: bPhrase,
        translation: ePhrase,
        bisayaWords: splitBisaya,
        englishWords: splitEnglish,
        lesson: lesson,
        lessonTitle: title.value
    }
}



let btnAdd = document.querySelector('#add')


btnAdd.addEventListener('click', () => {
    console.log(splitWords(bInput.value, eInput.value, lesson.value))
    postPhrases(splitWords(bInput.value, eInput.value, lesson.value))
    setTimeout(() => {
        bInput.value = ''
        eInput.value = ''
    }, 3000);
})


let postPhrases = async(phrase) => {

    const res = await axios.post(`http://ayasib.com/lessons/add`, {phrase: phrase})
    console.log('Successfully added', res)
}