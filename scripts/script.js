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

function shareForChips(){
    if (navigator.share) {
        navigator.share({
          title: 'CASINO',
          text: 'Play this fun casino game that costs no money!',
          url: 'https://alevel-casino.vercel.app'
        }).then(() => {
          addChips(500);
          showNotification('Thank You!',"Here's 500 chips for sharing!",'green');
        })
      }
}