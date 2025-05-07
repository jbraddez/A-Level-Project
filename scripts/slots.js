const betBtn = document.getElementById('changeBet');
const items = [
    '7',
    'apple',
    'bar',
    'bell',
    'cherry',
    'diamond',
    'grapes',
    'watermelon'
];
function spinReel(imgElement, duration) {
    let count = 0;
    let maxCount = duration / 100;
    let spinInterval = setInterval(() => {
        const item = items[Math.floor(Math.random() * items.length)];
        imgElement.src = `/images/slots/${item}.webp`;
        imgElement.alt = item;
        count++;

        if (count > maxCount) {
            clearInterval(spinInterval);
            const finalItem = items[Math.floor(Math.random() * items.length)];
            imgElement.src = `/images/slots/${finalItem}.webp`;
            imgElement.alt = finalItem;
            addItems(finalItem);
        }
    }, 100);
}

let spinning = false;
let finalItems = []; //spun items
function addItems(item){
    if(finalItems.length == 3){
        finalItems =[item];
    }else{
        finalItems.push(item);
    }

    if(finalItems.length == 3){
        spinning = false;
    }
}

function hit() {
    const bet = getBet();
    const chips = getChips();

    if(bet > chips){
        showNotification('Insufficient Chips', 'Feel free to gather free chips from a challenge.','red');//POSSIBLY CHANGE -----------
        return
    }

    if(spinning){
        showNotification('Be Patient', 'Please wait for the machine to stop spinning.','red');
        return
    }

    minusChips(bet);
    spinning = true;

    if(bet > getChips()){
        betBtn.classList.add('disabled');
    }else{
        betBtn.classList.remove('disabled');
    }

    const reels = document.querySelectorAll('.reel img');
    reels.forEach((img, index) => {
        const duration = 1200 + index * 600; 
        spinReel(img, duration);
    });
}

function getBet(){
    const bet = document.getElementById('changeBet');
    return parseInt(bet.textContent);
}


const bets = [100,250,500,1000,2500,5000];
function changeBet(){
    const bet = getBet();
    const currentIndex = bets.indexOf(bet);
    const nextIndex = (currentIndex + 1) % bets.length;
    betBtn.textContent = bets[nextIndex];

    if(bets[nextIndex] > getChips()){
        betBtn.classList.add('disabled');
    }else{
        betBtn.classList.remove('disabled');
    }
}