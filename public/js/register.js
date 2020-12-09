

let DOM = {
    password: document.querySelector('#password'),
    confirm: document.querySelector('#confirm'),
    email: document.querySelector('#email'),
    username: document.querySelector('#username'),
    forms: document.querySelectorAll('input'),
    submit: document.querySelector('.btn')
}



document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
    };
})(), true);
let checkPassword = () => {
    if(DOM.password.value !== DOM.confirm.value) {
        let message = document.createElement('small')
        message.style.color = 'red'
        message.textContent = "Password does not match"
        DOM.password.classList.remove('valid')
        DOM.password.classList.add('invalid')
        DOM.password.parentNode.removeChild(DOM.password.parentNode.lastChild)
        DOM.password.parentNode.appendChild(message)
        let anotherMessage = document.createElement('small')
        anotherMessage.style.color = 'red'
        anotherMessage.textContent = "Password does not match"
        DOM.confirm.classList.remove('valid')
        DOM.confirm.classList.add('invalid')
        DOM.confirm.parentNode.removeChild(DOM.confirm.parentNode.lastChild)
        DOM.confirm.parentNode.appendChild(anotherMessage)
    }
}
let checkContents = () => {
    DOM.forms.forEach(element => {
        activeDOM = element
        if (activeDOM.value === '') {
            addInvalid(activeDOM)
         } else {
            addValid(activeDOM)
            checkEmail()
            checkPassword()
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
    activeDOM.classList.remove('invalid')
    activeDOM.classList.add('valid')
    activeDOM.parentNode.removeChild(activeDOM.parentNode.lastChild)
    activeDOM.parentNode.appendChild(message)
}

DOM.submit.addEventListener('click', checkContents)








function checkEmail() 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(DOM.email.value))
  {
    return (true)
  }
  let message = document.createElement('small')
  message.style.color = 'red'
  message.textContent = "This is an invalid email"
  DOM.email.classList.remove('valid')
  DOM.email.classList.add('invalid')
  DOM.email.parentNode.removeChild(DOM.email.parentNode.lastChild)
  DOM.email.parentNode.appendChild(message)
}