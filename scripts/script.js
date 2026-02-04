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
    addChips(2000);
}

function addChips(toAdd){
    let chips = getChips();
    if (isNaN(toAdd)) return;
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
    if (isNaN(toRemove)) return;
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
let notiQueue = [];

function showNotification(title, text, colour){
    const notification = document.getElementById('notification');

    const displayNoti = () => {
        notification.classList.remove('showNoti');
        void notification.offsetWidth;

        notification.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
        notification.classList.remove('green','red','grey');
        notification.classList.add('showNoti', colour);

        notiTimeout = setTimeout(() => {
            notification.classList.remove('showNoti');
            notiTimeout = null;

            if(notiQueue.length > 0){
                const next = notiQueue.shift();
                showNotification(next.title, next.text, next.colour);
            }
        }, 2900);
};


    //if currently showing a noti, queue next one
    if(notiTimeout){
        notiQueue.push({title, text, colour});
    } else {
        displayNoti();
    }
}


function dailyChips(){
    const date = new Date().toLocaleDateString();
    const dateInStorage = localStorage.getItem('lastDateActive');
    if(dateInStorage != date){
        localStorage.setItem('lastDateActive', date);
        showNotification('Free Daily Chips', "Here's your free 100 chips for today!", 'green');
        addChips(100)
        if (parseInt(localStorage.getItem('chips')) > 500) {
            const freeChipsBtn = document.getElementById('freeChips');
            if (freeChipsBtn) freeChipsBtn.style.display = 'none';
        }
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
