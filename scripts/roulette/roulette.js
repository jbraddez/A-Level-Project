const numbers = [
    0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
    '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];
const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
//get angles for numbers
const segmentAngle = 360 / 38;
const ball = document.querySelector('.ballCont');
const wheel = document.querySelector('.wheel img');
const maxWheelSpins = 10;
const maxBallSpins = 3;
const resultEl = document.getElementById('result');
let spinning = false;

function start(){
    if(spinning){
        showNotification('Please Wait','The current round has not finished, please be patient', 'red');
        return
    }

    minusChips(bet);
    spin();
}

function spin(){
    spinning = true;
    
    const index = Math.floor(Math.random() * numbers.length);
    const landedNumber = numbers[index];
    const targetAngle = Math.floor(index * segmentAngle);

    const offset = Math.random() * numbers.length;
    const wheelRotation = maxWheelSpins * 360 + offset;
    const ballRotation = maxBallSpins * 360 - targetAngle - 4.73684210526 - offset;

    wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheel.style.transform = `rotate(${wheelRotation}deg)`;

    ball.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    ball.style.transform = `translate(-50%,-50%) rotate(-${ballRotation}deg)`;

    setTimeout(() => {
        resultEl.textContent = landedNumber;
        resultEl.style.display = 'block';
        checkResult(landedNumber);
    }, 5000);
}

function checkResult(landedNumber) {
    let red = false;
    let black = false;

    if (reds.includes(landedNumber)) {
        red = true;
    } else if (landedNumber !== 0 && landedNumber !== '00') {
        black = true;
    }

    let twelfth = 0;
    if (landedNumber >= 1 && landedNumber <= 12) {
        twelfth = 1;
    } else if (landedNumber >= 13 && landedNumber <= 24) {
        twelfth = 2;
    } else if (landedNumber >= 25 && landedNumber <= 36) {
        twelfth = 3;
    }

    let _1to18 = landedNumber >= 1 && landedNumber <= 18;
    let _19to36 = landedNumber >= 19 && landedNumber <= 36;
    let even = landedNumber % 2 === 0 && ![0, '00'].includes(landedNumber);
    let odd = landedNumber % 2 === 1 && ![0, '00'].includes(landedNumber);

    let totalWinnings = 0;

    for (let i = 0; i < placedBets.length; i++) {
        const betItem = placedBets[i];
        const betContent = betItem[0];
        const betAmount = betItem[1];
        let win = false;
        let multiplier = 0;

        if (typeof betContent === "number" || betContent === '00') {
            // Straight-up number bet
            if (landedNumber === betContent) {
                win = true;
                multiplier = 35;
            }
        } else {
            switch (betContent) {
                case "Even":
                    if(even){win = true; multiplier = 1;}
                    break;
                case "Odd":
                    if(odd){win = true; multiplier = 1;}
                    break;
                case "1-18":
                    if(_1to18){win = true; multiplier = 1;}
                    break;
                case "19-36":
                    if(_19to36){win = true; multiplier = 1;}
                    break;
                case "Red":
                    if(red){win = true; multiplier = 1;}
                    break;
                case "Black":
                    if(black){win = true; multiplier = 1;}
                    break;
                case "1st 12":
                    if(twelfth === 1){win = true; multiplier = 2;}
                    break;
                case "2nd 12":
                    if(twelfth === 2){win = true; multiplier = 2;}
                    break;
                case "3rd 12":
                    if(twelfth === 3){win = true; multiplier = 2;}
                    break;
                case "0":
                case "00":
                    if(landedNumber === betContent){
                        win = true;
                        multiplier = 35;
                    }
                    break;
            }
        }

        if(win){
            const winnings = betAmount * (multiplier + 1);
            totalWinnings += winnings;
        }
    }

    if(totalWinnings>0){
        showNotification('You Won!', `You won a total of ${totalWinnings} chips!`, 'green');
        addChips(totalWinnings);
    }else{
        showNotification('You Lost', `Unfortunately you won no chips this time`, 'red');
    }
    
    setTimeout(() => {
        resetGame();  
    }, 2500);
}

function resetGame(){
    ball.style.transition = '0s';
    wheel.style.transition = '0s';
    ball.style.transform = 'translate(-50%,-50%)';
    wheel.style.transform = '';
    resultEl.style.display = 'none';
    spinning = false;
    clearBet();

}

const grid = document.getElementById('numbersGrid');
function showMat(){
    for(let i = 1; i < 37; i++){
        const numberEl = document.createElement('div');
        numberEl.textContent = i;
        numberEl.classList.add('numberEl');
        if(reds.includes(i)){
            numberEl.classList.add('red');
        }else{
            numberEl.classList.add('black')
        }
        //add event listener for adding current held chip to this when pressed
        grid.appendChild(numberEl);
        numberEl.addEventListener('click', ()=>{addBet(numberEl)})
    }
}


showMat();