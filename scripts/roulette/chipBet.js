const tableSelect = document.getElementById('table');
const chipRow1 = document.getElementById('chipRow1');
const chipRow2 = document.getElementById('chipRow2');
const betAmountEl = document.getElementById('betAmount');
const betsCont = document.getElementById('betsCont');
const startBtn = document.getElementById('start');
const cursorImg = document.querySelector('.cursorImg');
let tableMax = 10000;
let bet = 0;
let canStart = false;
let heldChip;
let placedBets =[];

tableSelect.addEventListener('change',(event)=>{
    resetBets();
    tableMax = parseInt(event.target.value);
    const selectedOption = document.querySelector(`#table option[value="${tableMax}"]`);
    tableMin = parseInt(selectedOption.getAttribute('data-min'));

    if(tableMax == 10000){
        chipRow1.innerHTML=`<button onclick="grabChip(100)"><img src="/images/chips/100.png" alt="100"></button>
            <button onclick="grabChip(250)"><img src="/images/chips/250.png" alt="250"></button>
            <button onclick="grabChip(500)"><img src="/images/chips/500.png" alt="500"></button>`;
        chipRow2.innerHTML=`<button onclick="grabChip(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="grabChip(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="grabChip(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
    }else if(tableMax == 100000){
        chipRow1.innerHTML=`<button onclick="grabChip(1000)"><img src="/images/chips/1000.png" alt="1000"></button>
            <button onclick="grabChip(2500)"><img src="/images/chips/2500.png" alt="2500"></button>
            <button onclick="grabChip(5000)"><img src="/images/chips/5000.png" alt="5000"></button>`;
        chipRow2.innerHTML=`<button onclick="grabChip(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="grabChip(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="grabChip(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;

    }else if(tableMax == 500000){
        chipRow1.innerHTML=`<button onclick="grabChip(10000)"><img src="/images/chips/10000.png" alt="10000"></button>
            <button onclick="grabChip(20000)"><img src="/images/chips/20000.png" alt="20000"></button>
            <button onclick="grabChip(50000)"><img src="/images/chips/50000.png" alt="50000"></button>`;
        chipRow2.innerHTML=`<button onclick="grabChip(75000)"><img src="/images/chips/75000.png" alt="75000"></button>
            <button onclick="grabChip(100000)"><img src="/images/chips/100000.png" alt="100000"></button>
            <button onclick="grabChip(200000)"><img src="/images/chips/200000.png" alt="200000"></button>`;
    }
})

window.addEventListener('pageshow', () => {
    tableSelect.dispatchEvent(new Event('change'));
});


//pin chip to cursor for hold
document.addEventListener('mousemove', (e) => {
    cursorImg.style.left = `${e.clientX}px`;
    cursorImg.style.top = `${e.clientY}px`;
});

function grabChip(chipValue) {
    heldChip = chipValue;
    cursorImg.src = `/images/chips/${chipValue}.png`;
    cursorImg.style.display = 'block';
}

function addBet(numberEl){
    if(spinning){
        showNotification('Bets Have Ended','Please wait for this current round to finish','red');
        return;
    }

    if(!heldChip){
        showNotification('Please Pick a Chip',`You must select a chip that you want to bet`,'red');
        return;
    }
    if(bet+heldChip > tableMax){
        showNotification('Maximum Bet Reached',`This chip can't be added, the maximum bet is ${tableMax.toLocaleString()}`,'red');
        return;
    }
    if(bet+heldChip > getChips()){
        showNotification('Maximum Bet Reached',"You do not have sufficient chips for this bet.",'red');
        return;
    }
    
    bet+=heldChip;
    betAmountEl.textContent = bet;

    //ADD TO ARRAY OF NUMBERS (or string - even odd red etc.) TO CHECK AT THE END - go in roulette.js
    placedBets.push([numberEl.textContent,heldChip]); //[bet content, bet amount]

    canStart = true;
    startBtn.classList.remove('disabled');
    const chipEl = document.createElement('img');
    chipEl.classList.add('placedChip');
    chipEl.src = `/images/chips/${heldChip}.png`;
    chipEl.alt = heldChip;

    numberEl.innerHTML = numberEl.textContent;
    numberEl.appendChild(chipEl);
}

function clearBet(){
    bet = 0;
    betAmountEl.textContent = '';
    betsCont.innerHTML = '';
    canStart = false;
    startBtn.classList.add('disabled');
    cursorImg.style.display = 'none';
    placedBets = [];

    document.querySelectorAll('.placedChip').forEach((chip) =>{
        chip.remove();
    })
}



function resetBets(){
    bet = 0;
    clearBet();
    //reset bet list
    canStart = false;
    startBtn.classList.add('disabled');
}