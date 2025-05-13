const numbers = [
    0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
    '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
  ];
//get angles for numbers
const segmentAngle = 360 / 38;
const ball = document.querySelector('.ballCont');
const wheel = document.querySelector('.wheel img');
const maxWheelSpins = 10;
const maxBallSpins = 3;
const resultEl = document.getElementById('result');

//check angle moved for both then do the maths to figure out position of ball

function start(){
    spin();
}

function spin(){
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
        setTimeout(() => {
            resetGame();
        }, 2500);
    }, 5000);

    
}

function resetGame(){
    ball.style.transition = '0s';
    wheel.style.transition = '0s';
    ball.style.transform = 'translate(-50%,-50%)';
    wheel.style.transform = '';
    resultEl.style.display = 'none';
    clearBet();

}
