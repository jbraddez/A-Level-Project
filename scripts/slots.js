const betBtn = document.getElementById('changeBet');
const items = [
    '7',
    'apple',
    'bar',
    'bar',
    'bell',
    'bell',
    'cherry',
    'cherry',
    'diamond',
    'diamond',
    'grapes',
    'grapes',
    'watermelon',
    'watermelon',
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

let currentBet = 0;
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
        calculateWinnings(finalItems,currentBet);
    }
}

function hit() {
    const bet = getBet();
    currentBet = bet;
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

const paytable = {
    '7': { 3: 100, 2: 50 },
    'apple': { 3: 50, 2: 25 },
    'bar': { 3: 30, 2: 15 },
    'bell': { 3: 20, 2: 10 },
    'cherry': { 3: 10, 2: 5 },
    'diamond': { 3: 5, 2: 2 },
    'grapes': { 3: 3, 2: 1 },
    'watermelon': { 3: 1, 2: 0 },
};

function calculateWinnings(results, bet){
    const symbolCounts = {};

    results.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });

    let totalWinnings = 0;

    Object.keys(symbolCounts).forEach(symbol => {
        const count = symbolCounts[symbol];
        if (count >= 2) {
            const multiplier = paytable[symbol][count];
            totalWinnings += bet * multiplier;
        }
    });

    if(totalWinnings > 0){
        addChips(totalWinnings);
    }
}




//popup
const popup = document.getElementById('popup');
function openPopup(){
    popup.style.display = 'flex';
}
function closePopup() {
    popup.style.display = 'none';
}