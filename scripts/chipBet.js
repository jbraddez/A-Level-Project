const tableSelect = document.getElementById('table');
const chipRow1 = document.getElementById('chipRow1');
const chipRow2 = document.getElementById('chipRow2');
const betAmountEl = document.getElementById('betAmount');
const betsCont = document.getElementById('betsCont');
const startBtn = document.getElementById('start');
let tableMax = 10000;
let bet = 0;
let canStart = false;

tableSelect.addEventListener('change',(event)=>{
    clearBet();
    tableMax = parseInt(event.target.value);
    const selectedOption = document.querySelector(`#table option[value="${tableMax}"]`);
    tableMin = parseInt(selectedOption.getAttribute('data-min'));

    if(tableMax == 10000){
        setChips([100, 250, 500], [1000, 2500, 5000]);
    } else if(tableMax == 100000){
        setChips([1000, 2500, 5000], [10000, 20000, 50000]);
    } else if(tableMax == 500000){
        setChips([10000, 20000, 50000], [75000, 100000, 200000]);
    }

})

function setChips(chipValues1, chipValues2) {
    chipRow1.innerHTML = chipValues1.map(val => 
        `<button onclick="addBet(${val})"><img src="/images/chips/${val}.png" alt="${val}"></button>`
    ).join('');
    
    chipRow2.innerHTML = chipValues2.map(val => 
        `<button onclick="addBet(${val})"><img src="/images/chips/${val}.png" alt="${val}"></button>`
    ).join('');
}


window.addEventListener('pageshow', () => {
    tableSelect.dispatchEvent(new Event('change'));
});

function addBet(betToAdd){
    if(bet+betToAdd > tableMax){
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
    betsCont.style.height = `calc(3rem + ${betsCont.childElementCount * 4}px)`;
    betsCont.appendChild(chipEl)
}

function clearBet(){
    bet = 0;
    betAmountEl.textContent = '';
    betsCont.innerHTML = '';
    canStart = false;
    startBtn.classList.add('disabled');
}