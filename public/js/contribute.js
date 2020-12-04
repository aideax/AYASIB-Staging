

let DOM = {
    bisaya: document.querySelector('#bisayaPhrase'),
    english: document.querySelector('#englishPhrase'),
    lesson: document.querySelector('#lesson'),
    submit: document.querySelector('.btn'),
    forms: document.querySelectorAll('.form-control')
}



document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
    };
})(), true);

let checkContents = () => {
    DOM.forms.forEach(element => {
        activeDOM = element
        if (activeDOM.value === '') {
            addInvalid(activeDOM)
         } else {
            addValid(activeDOM)
         }
    });
}

let addInvalid = (activeDOM) => {
    let message = document.createElement('small')
    message.style.color = 'red'
    message.textContent = "Please fill out this field"
    activeDOM.classList.remove('valid')
    activeDOM.classList.add('invalid')
    activeDOM.parentNode.removeChild(activeDOM.parentNode.lastChild)
    activeDOM.parentNode.appendChild(message)
}

let addValid = (activeDOM) => {
    let message = document.createElement('small')
    message.style.color = 'green'
    message.textContent = "Maayo!"
    activeDOM.classList.add('valid')
    activeDOM.parentNode.removeChild(activeDOM.parentNode.lastChild)
    activeDOM.parentNode.appendChild(message)
}

DOM.submit.addEventListener('click', checkContents)