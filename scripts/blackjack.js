//dont use api - create logic fully myself
const imgPath = "https://deckofcardsapi.com/static/img/"; //.png
const backImgPath = "https://deckofcardsapi.com/static/img/back.png";

//fetch deck data
const fullDeck = [];
let deck = [];
fetch('/json/deck_of_cards.json').then(response => response.json()).then(data => {
    fullDeck.push(...data);
    //puts full deck into current deck and shuffles
    resetDeck();
}).catch(error => {
    console.error(error);
});

//make current deck from full deck and shuffle
function resetDeck(){
    deck = [...fullDeck];
    shuffle();
}

//fisher yates algorithm
function shuffle(){
	for (let i = deck.length - 1; i > 0; i--){
		let j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j],deck[i]]
	}
}

let bet = 0;
let canStart = false;
const startBtn = document.getElementById('start');
const betsCont = document.getElementById('betsCont');
const betAmountEl = document.getElementById('betAmount');
const tableSelect = document.getElementById('table');
const doubleDownEl = document.getElementById('doubleDown');
let tableMax = 10000;
let tableMin = 0;
let belowMinBet = false;

let dealerAces = 0;
let aces = 0;

const chipRow1 = document.getElementById('chipRow1');
const chipRow2 = document.getElementById('chipRow2');
tableSelect.addEventListener('change',(event)=>{
    resetGame();
    tableMax = parseInt(event.target.value);
    const selectedOption = document.querySelector(`#table option[value="${tableMax}"]`);
    //get table min to check when starting
    tableMin = parseInt(selectedOption.getAttribute('data-min'));
    document.body.classList.remove('table-10k', 'table-50k', 'table-100k', 'table-250k', 'oneB-table');

    //change table and chips depending on table type
    if (tableMax == 10000) {
        setChips([100, 250, 500], [1000, 2500, 5000]);
        document.body.classList.add('table-10k');
    } else if (tableMax == 50000) {
        setChips([1000, 2500, 5000], [10000, 20000, 50000]);
        document.body.classList.add('table-50k');
    } else if (tableMax == 100000) {
        setChips([1000, 2500, 5000], [10000, 20000, 50000]);
        document.body.classList.add('table-100k');
    } else if (tableMax == 250000) {
        setChips([10000, 20000, 50000], [75000, 100000, 200000]);
        document.body.classList.add('table-250k');
    } else if (tableMax == 0) {
        setChips([1000000000], []);
        chipRow2.style.display = 'none';
        document.body.classList.add('oneB-table');
        return;
    }

    chipRow2.style.display = 'flex';

})

function setChips(row1, row2) {
    chipRow1.innerHTML = row1.map(val => `<button onclick="addBet(${val})"><img src="/images/chips/${val}.png" alt="${val}"></button>`).join('');
    chipRow2.innerHTML = row2.map(val => `<button onclick="addBet(${val})"><img src="/images/chips/${val}.png" alt="${val}"></button>`).join('');
}

//dispath event for selected state due to content not changing when history back to this page
window.addEventListener('pageshow', () => {
    tableSelect.dispatchEvent(new Event('change'));
});


function addBet(betToAdd){
    if(bet+betToAdd > tableMax && tableMax != 0){
        showNotification('Maximum Bet Reached',`This chip can't be added, the maximum bet is ${tableMax.toLocaleString()}`,'red');
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
        showNotification('Place a Bet',' Please place a bet to begin','red');
        return;
    }
    if(bet < tableMin){
        showNotification('Please Bet More',`The minimum bet is ${tableMin.toLocaleString()}`,'red');
        return;
    }
    playerValueEl.style.display = 'block';
    minusChips(bet);
    document.querySelector('.chipBox').style.display = 'none';
    dealerBox.style.display = 'flex';
    playerStart();

    //add to blackjack games stat
    let currentGames = localStorage.getItem('blackJackGames') || 0;
    localStorage.setItem('blackJackGames',++currentGames);
}

const card1 = document.querySelector('#card1 img');
const card2 = document.querySelector('#card2 img');

function playerStart(){
    const data1 = deck[0];
    deck.splice(0, 1);
    const data2 = deck[0];
    deck.splice(0, 1);

    addValue(data1.value,'player');
    addValue(data2.value,'player');

    const annotation1 = getCardAnnotation(data1);
    const annotation2 = getCardAnnotation(data2);
    card1.src = imgPath + annotation1 + ".png";
    card1.alt = annotation1;
    card2.src = imgPath + annotation2 + ".png";
    card2.alt = annotation2;

    if(parseInt(playerValueEl.textContent) >= 21){
        checkPlayerValue();
    }

    setTimeout(() => {
        dealerStart();
    }, 500);
}

const dealerCard1Cont = document.getElementById('d-card1');
const dealerCard1 = document.querySelector('#d-card1 img');
const dealerCard2 = document.querySelector('#d-card2 img');
const dealerValueEl = document.getElementById('dealerValue');

function dealerStart(){
    const data = deck[0];
    deck.splice(0, 1);
    const annotation = getCardAnnotation(data);
    addValue(data.value,'dealer');
    dealerCard1Cont.firstElementChild.src = imgPath + annotation + '.png';
    dealerCard1Cont.firstElementChild.alt = annotation;
    dealerCard2.src = backImgPath;

    if(dealerMustEnd){
        dealerPlay();
    }else{
        doubleDownEl.style.display = 'block';
        showButtons();
    }
}


let doubled_down = false
function doubleDown(){
    if(bet > getChips()){
        showNotification('Insufficient Chips', 'You do not have enough chips to double down', 'red');
        doubleDownEl.classList.add('disabled');
        return;
    }
    minusChips(bet);
    bet*=2;
    doubled_down = true;
    hit();
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
        if(user == 'dealer'){
            dealerAces++;
        }else if(user == 'player'){
            aces++;
        }
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

//draw card based on dealer or player function
function drawCard(user){
    const data = deck[0];
    deck.splice(0, 1);
    addValue(data.value, user); // update score

    const annotation = getCardAnnotation(data);
    const img = document.createElement('img');
    img.src = imgPath + annotation + ".png";
    img.alt = annotation;

    let container, translateVal;

    if(user === 'player'){
        container = document.getElementById(`card${nextCard}`);
        const index = container.childElementCount;
        translateVal = -(9*(10-index)) -(100*(index-1));
        img.style.transform = `translateY(${translateVal}%)`;
        nextCard = 3 - nextCard;
    } else if(user === 'dealer'){
        container = document.getElementById(`d-card${dealerNextCard}`);
        const index = container.childElementCount;
        img.style.position = 'absolute';
        img.style.transform = `translateY(-${10*(index-1)}%)`;

        if(container.firstElementChild.alt === "Back"){
            container.firstElementChild.remove();
            img.style.position = 'relative';
            img.style.transform = 'translateY(10%)';
        }

        dealerNextCard = 3 - dealerNextCard;
    }

    container.appendChild(img);

    if(user === 'player'){
        setTimeout(() => { checkPlayerValue(); }, 500);
    } else if(user === 'dealer'){
        setTimeout(() => { checkDealerValue(); }, 500);
    }
}

//buttons
const playerButtons = document.querySelectorAll('.player-btns');
function hideButtons(){
    playerButtons.forEach(e => {
        e.style.display = 'none';
    });
    doubleDownEl.style.display = 'none';
}

function showButtons(){
    playerButtons.forEach(e => {
        e.style.display = 'block';
    });
}

let nextCard = 1;
function hit(){
    hideButtons();
    drawCard('player');
}

let standing = false;
function stand(){
    standing = true;
    hideButtons();
    dealerPlay();
}

let dealerMustEnd = false;
function checkPlayerValue(){
    const value = parseInt(playerValueEl.textContent); 
    // if doubled down dealer must play - if not check the value to determine what to do
    if(doubled_down){
        if(value > 21){
            //if greater than 21, check for aces, either way let dealer play after
            if(checkForAces('player')){
                const text = value - 10;
                playerValueEl.textContent = text;
                dealerPlay();
            }else{
                compareScores();
            }
        }else{
            dealerPlay();
        }
    }else{
        if(value > 21){
            if(checkForAces('player')){
                const text = value - 10;
                playerValueEl.textContent = text;
                showButtons();
            }else{
                //compare scores - end game func - player lose
                compareScores();
            }
        }
    
        if(value == 21){
            //check dealer cards - if card2 back card get another, and check then end 
            dealerPlay();
            if(checkBlackjack()){
                dealerMustEnd = true;
            }
        }
    
        if(value < 21){
            showButtons();
        }
    }
}

function checkDealerValue(){
    const value = parseInt(dealerValueEl.textContent); 
    if(value > 21){
        if(checkForAces('dealer')){
            const text = value - 10;
            dealerValueEl.textContent = text;
            setTimeout(() => {
                dealerPlay();
            }, 1000);
        }else{
            //bust - end game - dealer loses
        compareScores();
    }
    }

    if(value == 21){
        //dealer wins - end game
        compareScores();
    }

    if(value < 21){
        setTimeout(() => {
            dealerPlay();
        }, 1000);
    }
}

const resultEl = document.getElementById('result');
function compareScores(){
    hideButtons();
    const playerScore = parseInt(playerValueEl.textContent);
    const dealerScore = parseInt(dealerValueEl.textContent);
    

    let winnings;

    setTimeout(() => {
        dealerBox.style.display = 'none';
    }, 1000);

    setTimeout(() => {
        resultEl.style.display = 'block';
        //check player gone bust
        if(playerScore > 21){
            winnings = 0;
            resultEl.textContent = "You're Bust!";
            showNotification('Dealer Wins', 'You went bust, you won 0 chips.','red');
        }else{
            if(playerScore == dealerScore){
                winnings = bet;
                resultEl.textContent = "You Tied!";
                showNotification('No one wins', `You tied with the dealer, you won ${winnings} chips back.`,'red');
            }
            else{
                //check if player got blackjack
                if(playerScore == 21 && checkBlackjack()){
                    winnings = bet * 2.5;
                    resultEl.textContent = "BlackJack!";
                    showNotification('You Win', `You got blackjack, you won ${winnings} chips.`,'green');
                    //increment blackjack stat
                    let blackJacks = localStorage.getItem('blackJacks') || 0;
                    localStorage.setItem('blackJacks',++blackJacks);
                }else if(dealerScore > 21){//check if dealer bust
                    winnings = bet * 2;
                    resultEl.textContent = "Dealer's Bust!";
                    showNotification('You Win', `The dealer went bust, you won ${winnings} chips.`,'green');
                }
                else{
                    //check player beat dealer if not dealer won
                    if(playerScore > dealerScore){
                        winnings = bet * 2;
                        resultEl.textContent = "You Win!";
                        showNotification('You Win', `You beat the dealer, you won ${winnings} chips.`,'green');
                    }else{//otherwise, dealer must've beat player
                        winnings = 0;
                        resultEl.textContent = "Dealer Wins!";
                        showNotification('Dealer Wins', `The dealer beat you, you won 0 chips.`,'red');
                    }
                }
            }
        }

        if(winnings > 0){
            addChips(winnings);
        }

        setTimeout(() => {
            resetGame();
        }, 500);
    }, 1500);
}

function checkBlackjack(){
    const cards = document.querySelectorAll('.playerCards img');
    if(cards.length > 2){
        return false;
    }else if(cards.length == 2){
        return true;
    }
}


let dealerNextCard = 2;
function dealerPlay(){
    const dealerScore = parseInt(dealerValueEl.textContent);
    if(dealerScore >= 17 || dealerMustEnd){
        compareScores();
    }else{
        drawCard('dealer');
    }
}



function checkForAces(user){
    if(user == 'dealer'){
        if(dealerAces > 0){
            dealerAces--;
            return true;
        }
    }else if(user == 'player'){
        if(aces > 0){
            aces--;
            return true;
        }
    }
    return false;
}

function resetGame(){
    dealerAces = 0;
    aces = 0;
    dealerNextCard = 2;
    nextCard = 1;
    standing = false;
    canStart = false;
    playerValueEl.textContent = 0;
    playerValueEl.style.display = 'none';
    dealerValueEl.textContent = 0;
    dealerMustEnd = false;
    doubled_down = false;
    doubleDownEl.classList.remove('disabled');

    let p_cardconts = document.querySelectorAll('.playerCards .cardcont');
    p_cardconts.forEach(parent => {
        while (parent.children.length > 1) {
            parent.removeChild(parent.lastChild);
        }
        parent.firstElementChild.src = '/images/blackjack.png';
        parent.firstElementChild.alt = 'Blackjack';
    });

    let d_cardconts = document.querySelectorAll('.dealerCards .cardcont');
    d_cardconts.forEach(parent => {
        while (parent.children.length > 1) {
            parent.removeChild(parent.lastChild);
        }

        parent.firstElementChild.src = backImgPath;
        parent.firstElementChild.alt = 'Back';
    });

    hideButtons();
    clearBet();
    if(deck.length < 15){
        resetDeck();
    }
    
    document.querySelector('.chipBox').style.display = 'flex';

    resultEl.style.display = 'none';
}