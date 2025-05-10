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
const tableSelect = document.getElementById('table');
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
    tableMin = parseInt(selectedOption.getAttribute('data-min'));
    document.body.classList.remove('table-10k', 'table-50k', 'table-100k', 'table-250k', 'oneB-table');

    if(tableMax == 10000){
        chipRow1.innerHTML=`<button onclick="addBet(100)"><img src="/images/chips/100.png" alt="100"></button>
            <button onclick="addBet(250)"><img src="/images/chips/250.png" alt="250"></button>
            <button onclick="addBet(500)"><img src="/images/chips/500.png" alt="500"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="addBet(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="addBet(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
        //add bg style
        document.body.classList.add('table-10k');
    }else if(tableMax == 50000){
        chipRow1.innerHTML=`<button onclick="addBet(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="addBet(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="addBet(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="addBet(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="addBet(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;
        //add bg style
        document.body.classList.add('table-50k');

    }else if(tableMax == 100000){
        chipRow1.innerHTML=`<button onclick="addBet(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="addBet(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="addBet(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="addBet(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="addBet(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;
        //add bg style
        document.body.classList.add('table-100k');

    }else if(tableMax == 250000){
        chipRow1.innerHTML=`<button onclick="addBet(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="addBet(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="addBet(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(75000)"><img src="/images/chips/75000.png" alt="75000"></button>
            <button onclick="addBet(100000)"><img src="/images/chips/100000.png" alt="100000"></button>
            <button onclick="addBet(200000)"><img src="/images/chips/200000.png" alt="200000"></button>`;
        //add bg style
        document.body.classList.add('table-250k');
    }
    //1 billion only table
    if(tableMax == 0){
        chipRow1.innerHTML=`<button onclick="addBet(1000000000)"><img src="/images/chips/1000000000.png" alt="1000000000"></button>`;
        chipRow2.style.display = 'none';
        document.body.classList.add('oneB-table');
    }else{
        chipRow2.style.display = 'flex';
    }
})

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
        return;
    }
    if(bet < tableMin){
        showNotification('Please Bet More',`The minimum bet is ${tableMin.toLocaleString()}`,'red');
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
    const data = getCard();
    const annotation = getCardAnnotation(data);
    addValue(data.value,'dealer');
    dealerCard1Cont.firstElementChild.src = imgPath + annotation + '.png';
    console.log(imgPath + annotation);
    dealerCard1Cont.firstElementChild.alt = annotation;
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
    hideButtons();

    addValue(data.value,'player');
    const annotation = getCardAnnotation(data);
    const img = document.createElement('img');
    img.src = imgPath + annotation + ".png";
    img.alt = annotation;
    const container = document.getElementById(`card${nextCard}`);
    const index = container.childElementCount;
    const translateVal = -(9*(10-index)) -(100*(index-1));
    img.style.transform = `translateY(${translateVal}%)`;

    container.appendChild(img);
    nextCard = 3 - nextCard;


    setTimeout(() => {
        checkPlayerValue();
    }, 500);
}

let standing = false;
function stand(){
    standing = true;
    hideButtons();
    dealerPlay();
}

let dealerCheckCard2 = false;
let dealerMustEnd = false;
function checkPlayerValue(){
    const value = parseInt(playerValueEl.textContent); 
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
        if(document.querySelector('#d-card2 img').alt == "Back"){
            dealerPlay();
            dealerCheckCard2 = true;
        }else{
            compareScores();
        }
    }

    if(value < 21){
        showButtons();
    }
}

function checkDealerValue(){
    const value = parseInt(dealerValueEl.textContent); 
    if(value > 21){
        if(checkForAces('dealer')){
            const text = value - 10;
            dealerValueEl.textContent = text;
            dealerPlay();
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
    console.log(bet);
    

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
    }else{
        console.log('Player cards has less than 2 items.')
    }
}


let dealerNextCard = 2;
function dealerPlay(){
    const dealerScore = parseInt(dealerValueEl.textContent);
    if(dealerScore >= 17 || dealerMustEnd){
        compareScores();
    }else{
        if(dealerCheckCard2){
            dealerMustEnd = true;
        }
        const data = getCard();
        addValue(data.value,'dealer');
        const annotation = getCardAnnotation(data);
    
        const img = document.createElement('img');
        img.src = imgPath + annotation + ".png";
        img.alt = annotation;
        img.style.position = 'absolute';
        const container = document.getElementById(`d-card${dealerNextCard}`);
        const index = container.childElementCount;
        img.style.transform = `translateY(-${10*(index-1)}%)`;
    
        if(container.firstElementChild.alt == "Back"){
            container.firstElementChild.remove();
            img.style.position = 'relative';
            img.style.transform = 'translateY(10%)';
        }
    
        container.appendChild(img);
        dealerNextCard = 3 - dealerNextCard;
        checkDealerValue();
    }
}



function checkForAces(user){
    console.log('checking aces for ', user)
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
    dealerCheckCard2 = false;

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
    
    document.querySelector('.chipBox').style.display = 'flex';

    resultEl.style.display = 'none';
}