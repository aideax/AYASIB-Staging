

let DOM = {
    card: document.querySelector('.review-main'),
}




let cardClicked = (e) => {
    if(e.target.classList.contains('edit')){
        showForms(e.target.parentNode.parentNode)
    }
}



let showForms = (e) => {
   console.log(e)

}





DOM.card.addEventListener('click', cardClicked)