//dont use api - create logic fully myself
const imgPath = "https://deckofcardsapi.com/static/img/"; //.png
const backImgPath = "https://deckofcardsapi.com/static/img/back.png";

//fetch deck data
const deck = [];
fetch('/json/deck_of_cards.json').then(response => response.json()).then(data => {
    deck.push(...data);
}).catch(error => {
    console.error(error);
});

let bet = 0;
let canStart = false;
const startBtn = document.getElementById('start');
const betsCont = document.getElementById('betsCont');
const betAmountEl = document.getElementById('betAmount');
function addBet(betToAdd){
    if(bet+betToAdd > 10000){
        showNotification('Maximum Bet Reached',"This chip can't be added, the maximum bet is 10,000",'red');
        return;
    }
    if(bet+betToAdd > getChips()){
        showNotification('Maximum Bet Reached',"You do not have sufficient chips for this bet.",'red');
        return;
    }
    bet+=betToAdd;
    betAmountEl.textContent = bet;

    canStart = true;
    startBtn.classList.remove('disabled');
    const chipEl = document.createElement('img');
    chipEl.src = `/images/chips/${betToAdd}.png`;
    chipEl.alt = betToAdd;

    const index = betsCont.childElementCount;
    chipEl.style.transform = `translateY(${index * 4}px)`;
    betsCont.appendChild(chipEl)
}

function clearBet(){
    bet = 0;
    betAmountEl.textContent = '';
    betsCont.innerHTML = '';
    canStart = false;
    startBtn.classList.add('disabled');
}

const dealerBox = document.getElementById('dealerBox');
//start
function start(){
    if(!canStart){
        return;
    }
    playerValueEl.style.display = 'block';
    minusChips(bet);
    document.querySelector('.chipBox').style.display = 'none';//need to have reset func incl. chipbox children when game ends
    dealerBox.style.display = 'flex';
    playerStart();
}

const card1 = document.querySelector('#card1 img');
const card2 = document.querySelector('#card2 img');

function getCard(){
    const index = Math.floor(Math.random() * deck.length);
    return deck[index];;
}

function playerStart(){
    const data1 = getCard();
    const data2 = getCard();

    addValue(data1.value,'player');
    addValue(data2.value,'player');

    card1.src = imgPath + getCardAnnotation(data1) + ".png";
    card2.src = imgPath + getCardAnnotation(data2) + ".png";

    setTimeout(() => {
        dealerStart();
    }, 500);
}

const dealerCard1 = document.querySelector('#d-card1 img');
const dealerCard2 = document.querySelector('#d-card2 img');
const dealerValueEl = document.getElementById('dealerValue');

function dealerStart(){
    const data = getCard();
    
    addValue(data.value,'dealer');
    dealerCard1.src = imgPath + getCardAnnotation(data) + '.png';
    dealerCard2.src = backImgPath;

    showButtons();
}

const playerValueEl = document.getElementById('playerValue');
function addValue(value,user){
    let currentValue;
    if(user == 'dealer'){
        currentValue = parseInt(dealerValueEl.textContent);
    }else if(user == 'player'){
        currentValue = parseInt(playerValueEl.textContent);
    }
    if(['K','Q','J'].includes(value)){
        value = 10;
    }else if(value == 'A'){
        value = 11; // NEED TO HANDLE - if bust then count aces in hand, - 10 for each ace until below 21 then hide that ace from deck to prevent never going bust 
    }

    const newValue = currentValue+value;

    if(user == 'dealer'){
        dealerValueEl.textContent = newValue;
    }else if(user == 'player'){
        playerValueEl.textContent = newValue;
    }
    
}

function getCardAnnotation(data){
    const suit = data.suit;
    let value = data.value;
    let ann_suit;

    switch(suit){
        case 'spades': 
            ann_suit = 'S';
            break;
        case 'clubs': 
            ann_suit = 'C';
        break
        case 'diamonds': 
            ann_suit = 'D';
        break
        case 'hearts': 
            ann_suit = 'H';
        break
    }

   if(value == 10){
    value = 0
   }

    return value+ann_suit;
}


//buttons
const playerButtons = document.querySelectorAll('.player-btns');
function hideButtons(){
    playerButtons.forEach(e => {
        e.style.display = 'none';
    });
}

function showButtons(){
    playerButtons.forEach(e => {
        e.style.display = 'block';
    });
}

let nextCard = 1;
function hit(){
    const data = getCard();

    addValue(data.value,'player');
    const annotation = getCardAnnotation(data);
    const img = document.createElement('img');
    img.src = imgPath + annotation + ".png"
    img.alt = annotation
    const container = document.getElementById(`card${nextCard}`);
    const index = container.childElementCount;
    const translateVal = -(9*(10-index)) -(100*(index-1));
    img.style.transform = `translateY(${translateVal}%)`;
    console.log(translateVal);

    container.appendChild(img);
    nextCard = 3 - nextCard;

    //check if bust - if so check if aces - if so remove 10 and log an ace 
    
}