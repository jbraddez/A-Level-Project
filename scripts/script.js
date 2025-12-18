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
    addToTotalEarned(toAdd);
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

let notiTimeout = null;
function showNotification(title,text,colour){
    clearTimeout(notiTimeout);
    const notification = document.getElementById('notification')
    notification.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
    notification.classList.remove('green','red','grey');
    notification.classList.add('showNoti', colour);
    notiTimeout = setTimeout(() => {
        notification.classList.remove('showNoti');
    }, 3000);
}

function dailyChips(){
    const date = new Date().toLocaleDateString();
    const dateInStorage = localStorage.getItem('lastDateActive');
    if(dateInStorage != date){
        localStorage.setItem('lastDateActive', date);
        showNotification('Free Daily Chips', "Here's your free 100 chips for today!", 'green');
        addChips(100)
    }
}

getChips();
showChips(getChips());

dailyChips();

if(!localStorage.getItem('firstTimePlaying')){
    const now = new Date().toLocaleDateString();
    localStorage.setItem('firstTimePlaying', now);
}

function addToTotalEarned(toAdd){
    let total = localStorage.getItem('totalEarned') || 0;
    total = parseInt(total);
    total += toAdd;
    localStorage.setItem('totalEarned', total);
}