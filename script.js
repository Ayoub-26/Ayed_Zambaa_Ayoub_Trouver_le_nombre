const difficultyscrn = document.getElementById('difficulty-screen');
const gamescrn = document.getElementById('game-screen');
const resultscrn = document.getElementById('result-screen');
const easybtn = document.querySelector('.easy');
const mediumbtn = document.querySelector('.medium');
const hardbtn = document.querySelector('.hard');
const guessinput = document.getElementById('guess-input');
const guessbtn = document.getElementById('guess-btn');
const nouvellepartbtn = document.getElementById('restart-btn'); //restart
const rejouerbtn = document.getElementById('play-again-btn');//playagain
const timed = document.getElementById('time');
const attemptsd = document.getElementById('attempts');
const ranged = document.getElementById('range');
const reponsed = document.getElementById('reponse');//feedback
const hintd = document.getElementById('hint');
const tempsfinal = document.getElementById('final-time');
const recordd = document.getElementById('best-time');
let nombredeviner = 0;
let attempts = 0;
let starttime = 0;
let interval = null;
let level = '';
let max = 0;
//module d'initialisation(lorsque la page est chargée)
function initgame(){
    showscreen(difficultyscrn);
//lancer le jeu suivant le niveau(càd bouton)choisi
    easybtn.addEventListener('click',()=>{
        level = 'easy';
        max = 50;
        startgame(50);});
    mediumbtn.addEventListener('click',()=>{
        level = 'medium';
        max = 100;
        startgame(100);});
    hardbtn.addEventListener('click',()=>{
        level = 'hard';
        max = 200;
        startgame(200);});
//les actions des buttons sur le screen du jeux
    guessbtn.addEventListener('click', handleguess);
	nouvellepartbtn.addEventListener('click', () => showscreen(difficultyscrn));
	rejouerbtn.addEventListener('click', () => showscreen(difficultyscrn));
//permettre de valider le guess à travers la touche entrer
	guessinput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			handleguess();
		}
	});

}
function startgame(max){
//initialisation du temps et attempts et generation du numero a deviner
    attempts = 0;
    starttime = Date.now();
    targetnumber = Math.floor(Math.random() * (max - 2)) + 1;
    attemptsd.textContent = attempts;
	ranged.textContent = `Entre 1 et ${max}`;
	reponsed.textContent = '';
	hintd.textContent = '';
	guessinput.value = '';
	guessinput.focus();
//initialiser le compteur et le mettre a jour toutes les 1s
    clearInterval(interval);
	updatetimer();
	interval = setInterval(updatetimer, 1000);
    showscreen(gamescrn);
    document.body.style.background = 'linear-gradient(135deg #008080, #48cae4, #90e0ef,#48cae4,#008080)';

}
//module qui permet d'afficher le screen choisi(entre difficulté , game et resultats)
function showscreen(screen){
    difficultyscrn.classList.remove('active');
    gamescrn.classList.remove('active');
    resultscrn.classList.remove('active');
    screen.classList.add('active');

}
//module qui permet de mettre a jour le timer
function updatetimer(){
    const current = Math.floor((Date.now() - starttime) / 1000);
    timed.textContent = current;
}
//le traitement fait sur le guess
function handleguess(){
    const guess = parseInt(guessinput.value);
    //verifier que guess est un NUMERO dans le domaine
    if (isNaN(guess) || guess<1 || guess>max){
        reponsed.textContent = `entrez un nombre entre 1 et ${max}`;
        reponsed.style.backgroundColor = '#f8d7da';
		reponsed.style.color = '#721c24';
		return;
    }
    //incrementer attempts
    attempts++;
    attemptsd.textContent = attempts;
    //voir si le guess est correcte , petit ou grand 
    if( guess==targetnumber) {
        endgame();
        return;
    }
    if( guess<targetnumber){
        reponsed.textContent = 'trop petit';
        reponsed.style.backgroundColor = '#d1ecf1';
		reponsed.style.color = '#0c5460';
    }
    else{
        reponsed.textContent = 'trop grand';
        reponsed.style.backgroundColor = '#f8d7da';
		reponsed.style.color = '#721c24';
    }
    let diff = Math.abs(targetnumber-guess);
    updatebackground((diff/max)*100);
    //donner un indice textuel suivant l'approchement de la valeur a deviner
    if( diff<5 ){
        hintd.textContent = 'tu brûles !';
        hintd.style.color = '#e74c3c';
    }
    else if( diff<10 ){
        hintd.textContent = 'tu chauffes !';
        hintd.style.color = '#e67e22';
    }
    else if( diff<20 ){
        hintd.textContent = 'tu es tiède !';
        hintd.style.color = '#efab3fff'
    }
    else{
        hintd.textContent = 'tu es froid !';
        hintd.style.color = '#3498db';
    }
    guessinput.value = '';
	guessinput.focus();
}
//module qui change le background en fonction de l'approchement du nombre a devenir
function updatebackground(percentage) {
	let red = Math.min(255, 100 + percentage * 1.5);
	let green = Math.min(255, 150 + (100 - percentage) * 1.5);
	let blue = Math.min(255, 100 + percentage);
	document.body.style.background = `rgb(${red}, ${green}, ${blue})`;
}
//module pour la fin du jeux (lancé lorsque le numero est deviné)
function endgame(){
	clearInterval(interval);
	const duree = Math.floor((Date.now() - starttime) / 1000);
	tempsfinal.textContent = duree;
	record(duree);
	showscreen(resultscrn);
	document.body.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
}
//fonction du meilleur temps , qui verifie si le temps est un record et l'enregistre si c'est le cas sinon elle affiche le temps et le meilleur temps
function record(duree){
    const storagekey = `bestTime_${level}`;
	const best = localStorage.getItem(storagekey);
	if (!best || duree < best) {
		localStorage.setItem(storagekey, duree.toString());
		recordd.textContent = `Nouveau record ! Meilleur temps: ${duree} secondes`;
		recordd.style.color = '#27ae60';
	} else {
		recordd.textContent = `Meilleur temps: ${best} secondes (ton temps: ${duree}s)`;
		recordd.style.color = '#7f8c8d';
	}
}
window.addEventListener('DOMContentLoaded', initgame);
