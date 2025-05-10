const chipsEl = document.getElementById('chips');
function getChips(){
    let chips = localStorage.getItem('chips');
    if(!chips){
        createChips();
    }
    return parseInt(chips);
}

function createChips(){
    localStorage.setItem('chips',0);
    showNotification('Welcome Bonus 🎰',"As a welcome here's 2000 chips!",'green');
    setTimeout(() => {
        addChips(2000);
    }, 1000);
}

function addChips(toAdd){
    let chips = getChips();
    chips += toAdd;
    localStorage.setItem('chips',chips);
    chipsEl.textContent = '+' + toAdd;
    setTimeout(() => {
        showChips(chips);
    }, 1000);
}

function minusChips(toRemove){
    let chips = getChips();
    chips -= toRemove;
    localStorage.setItem('chips',chips);
    chipsEl.textContent = '-' + toRemove;
    setTimeout(() => {
        showChips(chips);
    }, 1000);
}

function showChips(chips){
    chipsEl.textContent = chips;
}

function showNotification(title,text,colour){
    const notification = document.getElementById('notification')
    notification.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
    notification.classList.remove('green','red');
    notification.classList.add('showNoti');
    notification.classList.add(colour);
    setTimeout(() => {
        notification.classList.remove('showNoti');
    }, 3000);
}

getChips();
showChips(getChips());