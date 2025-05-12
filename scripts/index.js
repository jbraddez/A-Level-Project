const main = document.querySelector('main');
const allGames = Array.from(main.children);
let index = 0;

function cycleGames() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    for (let i = 0; i < 3; i++) {
        const gameIndex = (index + i) % allGames.length;
        const game = allGames[gameIndex];

        game.style.display = 'inline-block';

        if (i === 0) {
            game.style.setProperty('--angle', '-15deg');
            game.style.setProperty('--translate', '0');
        } else if (i === 1) {
            game.style.setProperty('--angle', '0deg');
            game.style.setProperty('--translate', '-10px');
        } else if (i === 2) {
            game.style.setProperty('--angle', '15deg');
            game.style.setProperty('--translate', '0');
        }

        main.appendChild(game);
    }

    index = (index + 1) % allGames.length;
}

cycleGames();
cycleinterval = setInterval(cycleGames, 3000);

