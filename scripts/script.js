const chipsEl = document.getElementById('chips');
function getChips(){
    let chips = localStorage.getItem('chips');
    console.log(chips);
    if(!chips){
        createChips();
    }else{
        showChips(chips);
    }
    return parseInt(chips);
}

function createChips(){
    localStorage.setItem('chips',0);
    addChips(2000);
    showNotification('Welcome Bonus 🎰',"As a welcome here's 2000 chips!");
    getChips()
}

function addChips(toAdd){
    let chips = getChips();
    chips += toAdd;
    localStorage.setItem('chips',chips);
    setTimeout(() => {
        chipsEl.textContent = '+' + toAdd;
        setTimeout(() => {
            showChips(chips);
        }, 1000);
    }, 1000);
}

function showChips(chips){
    chipsEl.textContent = chips;
}

function showNotification(title,text){
    const notification = document.getElementById('notification')
    notification.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
    notification.classList.add('showNoti');
    setTimeout(() => {
        notification.classList.remove('showNoti');
    }, 2000);
}

getChips();
