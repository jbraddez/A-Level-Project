function shareForChips(){
    const lastShared = localStorage.getItem('lastShared');
    const now = Date.now();
    const hourIn_ms = 60 * 60 * 1000;

    //check theyve shared before and if so calculate how long 
    if (lastShared && now - parseInt(lastShared) < hourIn_ms) {
        const minutesLeft = Math.ceil((hourIn_ms - (now - parseInt(lastShared))) / 60000);
        showNotification("Please wait", `You can share again in ${minutesLeft} minute(s).`, 'orange');
        return;
    }

    if (navigator.share) {
        navigator.share({
          title: 'CASINO',
          text: 'Play this fun casino game that costs no money!',
          url: 'https://alevel-casino.vercel.app'
        }).then(() => {
          addChips(500);
          showNotification('Thank You!',"Here's 500 chips for sharing!",'green');
          localStorage.setItem('lastShared', now.toString());
          setTimeout(() => {
            document.getElementById('freeChips').style.display = 'none';
          }, 1000);
        })
      }
}

if(localStorage.getItem('chips') < 500){
  document.getElementById('freeChips').style.display = 'block';
}