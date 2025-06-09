let selectedHorse;
let horses = document.querySelectorAll('.horse');
let results = [];
const odds = ['1/1','2/1','3/1','4/1','5/1','6/1','7/1','3/2','5/2','7/2','4/3','5/3','7/3','5/4','7/4','6/5','7/5','7/6']
const resultsEl = document.getElementById('results');

function selectHorse(e) {
    horses.forEach((horse) => {
        horse.classList.remove('selected');
    });
    const horse = e.currentTarget;
    horse.classList.add('selected');
    selectedHorse = horse;
}


function resetGame(){
    results = [];
    clearBet();
    selectedHorse = undefined;
    horses.forEach(horse => {
        horse.addEventListener('click', selectHorse);
        horse.style.left = 0;
        horse.classList.remove('selected');
        horse.querySelector('img').src = '/images/horseStatic.png';
    });
    getOdds();
    document.querySelector('.chipBox').style.display = 'flex';
    resultsEl.innerHTML = '';
    resultsEl.style.display = 'none';
}

function getOdds(){
   horses.forEach(horse =>{
    const oddEl = horse.querySelector('p.odd');
    const odd = odds[Math.floor(Math.random() * odds.length)];

    horse.setAttribute('odd', odd);
    oddEl.textContent = odd;
    oddEl.style.display = 'block';
   });
}

function start(){
    if(!canStart){
        return;
    }
    if(!selectedHorse){
        showNotification('Select a Horse',' Please select a horse to begin 🐎','red');
        return
    }
    minusChips(bet);
    document.querySelector('.chipBox').style.display = 'none';

    let betsOnHorses = localStorage.getItem('betsOnHorses') || 0;
    localStorage.setItem('betsOnHorses', ++betsOnHorses);

    horses.forEach(horse=>{
        horse.removeEventListener('click', selectHorse);
        horse.querySelector('img').src = '/images/horse.webp';
        horse.querySelector('.odd').style.display = 'none';
    })

    horsesMove();
}

function getDecimalOdd(odd) {
    const [num, den] = odd.split('/').map(Number);
    return num / den;
}

const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
function horsesMove(){
    horseUpdate = setInterval(() => {
        const screenElWidth = document.querySelector('.screen').clientWidth;
        const finishWidth = screenElWidth - (7 * remInPixels);
        horses.forEach(horse => {
            let leftPixels = (parseFloat(horse.style.left) / 100) * screenElWidth;
            if(leftPixels >= finishWidth){
                horse.querySelector('img').src = '/images/horseStatic.png';
                if(results.indexOf(horse) == -1){
                    results.push(horse);
                }
            }else{
            const odd = horse.getAttribute('odd');
            const oddDecimal = getDecimalOdd(odd);
    
            const distance = parseInt(horse.style.left) || 0;
            const distanceToAdd = Math.ceil(Math.random() * 4 / oddDecimal) +  Math.round((Math.random() * 2));
            horse.style.left = distance + distanceToAdd + '%'; 
            }
        });

        if(results.length == 6){
            clearInterval(horseUpdate);
            showResults();
        }
    }, 300);
}

function showResults(){
    resultsEl.style.display = 'flex';
    const title = document.createElement('h3');
    title.textContent = 'Results';
    resultsEl.appendChild(title);

    results.forEach(horse => {
        const horseNumber = horse.querySelector('.horse-number').textContent;
        const p = document.createElement('p');
        p.textContent = horseNumber;
        if(horse == selectedHorse){
            p.classList.add('playersHorse');
        }
        resultsEl.appendChild(p);
    });

    checkScoreAndPayout();
}

function checkScoreAndPayout(){
    if (results[0] === selectedHorse) {
        const oddsDecimal = getDecimalOdd(selectedHorse.getAttribute('odd'));
        const winnings = Math.round(bet * oddsDecimal);
        addChips(winnings + bet);
        showNotification('You Won',`Your horse won so you won ${(winnings+bet).toLocaleString()} chips!`,'green')
    }else{
        showNotification('You Lost',`Your horse didnt win, you won nothing.`,'red')
    }

    setTimeout(() => {
        resetGame();
    }, 2500);
}



resetGame();