const baseUrl = `https://api.dicebear.com/9.x/notionists/svg?`;
const username = localStorage.getItem('name');
const nameForm = document.getElementById('nameForm');

function submitName(){
    const name = document.getElementById('nameInput').value.toUpperCase();
    if(name.length < 1){
        showNotification('Enter a Name', 'You must fill out the field to enter', 'grey');
        return
    }

    localStorage.setItem('name', name);
    nameForm.style.display = 'none';
    showNameAndAvatar(name);
}

function showNameAndAvatar(name){
    const nameEl = document.getElementById('name');
    nameEl.textContent = name;

    const gestures = ['hand','handPhone','ok','okLongArm','point','pointLongArm','waveLongArm','waveLongArms','waveOkLongArms','wavePointLongArms'];
    const gesture = Math.random() < 0.5 ? `&gesture=${gestures[Math.floor(Math.random() * gestures.length)]}&gestureProbability=100` : '';

    const avatar = document.getElementById('profileIcon');
    avatar.src = `https://api.dicebear.com/9.x/notionists/svg?seed=${name}${gesture}`;
}

if(!username){
    nameForm.style.display = 'block';
}else{
    showNameAndAvatar(username);
}

function showStats(){
    const firstTimePlayingEl = document.getElementById('firstTimePlaying');
    firstTimePlayingEl.textContent = localStorage.getItem('firstTimePlaying');

    const totalEarnedEl = document.getElementById('totalEarned');
    totalEarnedEl.textContent = localStorage.getItem('totalEarned') || 0;
}

showStats();

