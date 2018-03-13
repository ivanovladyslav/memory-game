var gameOver = false;
var score=0;
var pairCount=9; //pairs amount for generating and remaining pairs counting

var clicked = 1; //click count
var tempCard; //var for keeping name attribute of the first clicked card
var clickedCards = []; //array for keeping pair of clicked cards
var canClick = false;

var scoreSpan = document.getElementsByClassName("score")[0];
var startButton = document.getElementsByClassName('start')[0];
var gameContainer = document.getElementsByClassName("container")[0];
var menuContainer = document.getElementsByClassName("menu")[0];
var startAgainButton = document.getElementsByClassName("startAgain")[0];
//function to generate non repeating values
var rand_numbers = [];
function my_rand(n) {
    while (true) {
        var result = Math.floor(Math.random() * n);
        if (rand_numbers.indexOf(result) == -1) {
            rand_numbers.push(result);
            return result;
        }
    }
}
//timer function for setting cards backward
var timer = {
  start: function(time) {
    if (typeof(t) != 'undefined') {
      clearTimeout(t);
    }       
    t = setTimeout(setBackwardAll, time);
  }
}
//generate card that doesnt repeating more than 2 times
function createCard(i,j, cardsChosen,cards) {
	var randChosen = Math.floor(Math.random() * (9));
	if (cardsChosen[1][randChosen] < 2 ) {
		cards[i][j] = cardsChosen[0][randChosen];
		cardsChosen[1][randChosen]++; 
	} else {
	 	createCard(i,j, cardsChosen,cards);
	}
}
//function to generate game field
function generateField() {
	var cards = [];	//2d array of card field
	for (i=0; i<3 ;i++) {
		cards[i]=[];
	}
	var cardNames = [
	"0C","0D","0H","0S",
	"2C","2D","2H","2S",
	"3C","3D","3H","3S",
	"4C","4D","4H","4S",
	"5C","5D","5H","5S",
	"6C","6D","6H","6S",
	"7C","7D","7H","7S",
	"8C","8D","8H","8S",
	"9C","9D","9H","9S",
	"AC","AD","AH","AS",
	"JC","JD","JH","JS",
	"KC","KD","KH","KS",
	"QC","QD","QH","QS"]; //names of cards
	var cardsChosen = [[],[]]; //cards chosen to be in the game
	//generation of chosen cards
	for (i=0; i<pairCount; i++) {
		var randName = my_rand(52);
		cardsChosen[0][i] = cardNames[randName];		
		cardsChosen[1][i] = 0; //number of repetitions
	}
	//creating card field from chosen cards
	for (i=0; i<3; i++) {
		for(j=0; j<6; j++) {			
			createCard(i,j,cardsChosen,cards);
		}
	}
	return cards;
}

function setBackward() {
	clickedCards[1].classList.add("backward");
	clickedCards[1].setAttribute("data-tid","Card-flipped");
	clickedCards[2].classList.add("backward");	
	clickedCards[2].setAttribute("data-tid","Card-flipped");
	canClick = true;
}

function setBackwardAll() {
	for (i=0; i<18; i++) {		
		var card = document.getElementsByClassName("card-class")[i];
		card.classList.add("backward");
		card.setAttribute("data-tid","Card-flipped");
	}
	canClick = true;
}

function removeCards() {	
	clickedCards[1].parentElement.removeChild(clickedCards[1]);
	clickedCards[2].parentElement.removeChild(clickedCards[2]);
	canClick = true;
}

function endGame() {
	var logo = document.getElementsByClassName("logo")[0];
	var text = document.getElementsByTagName("h1")[0];
	logo.src = "img/assets/GameOver.png";
	text.innerHTML = "Поздравляем! <br> Ваш итоговый счет: "+score;
	text.style.fontSize = "24px";
	gameContainer.style.display = "none";
	menuContainer.style.display = "block";
	startButton.innerHTML = "Еще раз";
	startButton.setAttribute("data-tid","EndGame-retryGame");
	gameOver = true;
}

function clickFunction() {
	if(canClick) {
		//if clicks amount more than 2
		if(clicked < 2) { 
			tempCard = this.getAttribute("card"); //getting name attribute of clicked card
			var isClicked = this.getAttribute("clicked") ; //is it clicked already?
			if (isClicked=="false") {
				//if the second card exist setting previous two card backward
				if (clickedCards[2]) { 
					setBackward();
				} 
				clickedCards[clicked] = this; //current card become clicked
				clicked++;
				this.setAttribute("clicked",true);
				this.setAttribute("data-tid","Card");
				this.classList.remove("backward");
			}
		} else {
			var isClicked = this.getAttribute("clicked"); 
			var tempCard1 = this.getAttribute("card"); //var for keeping name attribute of the second clicked card
			if (isClicked == "false") {
				clickedCards[clicked] = this;
				if (tempCard == tempCard1)	{
					this.classList.remove("backward");
					this.setAttribute("data-tid","Card");
					setTimeout(removeCards, 2000);
					pairCount--;
					score += pairCount*42;
					if (pairCount == 0) { 
						setTimeout(endGame, 2000);
					}
				} else {
					this.classList.remove("backward");
					this.setAttribute("data-tid","Card");
					score -= pairCount*42;
					if (score < 0) {
						score = 0;
					}
				}
				scoreSpan.innerHTML = score;
				clicked = 1;
			}
			if (tempCard1 != tempCard) {
				clickedCards[1].setAttribute("clicked",false);
				this.classList.remove("backward");
				this.setAttribute("data-tid","Card");				
				setTimeout(setBackward,2000);
			}	
			canClick = false;
		}
	}
}

function createField() {
	cards = generateField();
	deck = document.createElement('table');
	deck.className = "field";
	deck.setAttribute("data-tid","Deck");
	gameContainer.appendChild(deck);
	for (i=0; i<3; i++) {
		var newTr = document.createElement('tr');
		deck.appendChild(newTr);
		for (j=0; j<6; j++) {
			var newTh = document.createElement('th');
			newTr.appendChild(newTh);
			var newCard = document.createElement('div');			
			newCard.className = "card-class";
			newCard.setAttribute("card",cards[i][j]); //position in field array
			newCard.setAttribute("clicked",false);
			newCard.setAttribute("data-tid","Card");
			newCard.style.backgroundImage = 'url(img/cards/'+cards[i][j]+'.png)';
			newCard.style.backgroundSize = '113px 157px';
			newCard.onclick = clickFunction;
			newTh.appendChild(newCard);
		}
	}
}

function deleteField() {
	var field = document.getElementsByClassName("field")[0];
	if (field) {
		field.parentElement.removeChild(field);
	}
}

function startGame() { 
	rand_numbers = [];
	deleteField();
	pairCount = 9;
	score = 0;
	clicked = 1;
	canClick = false;
	createField();
	gameContainer.style.display = "block";
	menuContainer.style.display = "none";
	scoreSpan.innerHTML = score;
	gameOver = false;
	timer.start(5000);
}
startButton.onclick = startGame;
startAgainButton.onclick = startGame;