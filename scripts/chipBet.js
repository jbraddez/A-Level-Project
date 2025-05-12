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
    resetBets();
    tableMax = parseInt(event.target.value);
    const selectedOption = document.querySelector(`#table option[value="${tableMax}"]`);
    tableMin = parseInt(selectedOption.getAttribute('data-min'));

    if(tableMax == 10000){
        chipRow1.innerHTML=`<button onclick="addBet(100)"><img src="/images/chips/100.png" alt="100"></button>
            <button onclick="addBet(250)"><img src="/images/chips/250.png" alt="250"></button>
            <button onclick="addBet(500)"><img src="/images/chips/500.png" alt="500"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="addBet(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="addBet(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
    }else if(tableMax == 100000){
        chipRow1.innerHTML=`<button onclick="addBet(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="addBet(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="addBet(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="addBet(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="addBet(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;

    }else if(tableMax == 500000){
        chipRow1.innerHTML=`<button onclick="addBet(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="addBet(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="addBet(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;
        chipRow2.innerHTML=`<button onclick="addBet(75000)"><img src="/images/chips/75000.png" alt="75000"></button>
            <button onclick="addBet(100000)"><img src="/images/chips/100000.png" alt="100000"></button>
            <button onclick="addBet(200000)"><img src="/images/chips/200000.png" alt="200000"></button>`;
    }
})

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



function resetBets(){
    bet = 0;
    canStart = false;
    startBtn.classList.add('disabled');
}