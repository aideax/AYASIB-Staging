
let DOM = {
    email: document.querySelector('#email')
}


document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
    };
})(), true);

document.addEventListener('keypress', (e) => {
  if(e.which == '13'){
    e.preventDefault()}
})

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