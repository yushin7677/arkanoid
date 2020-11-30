/// Игра

var tls;
var level = 0;
var balls = 0;
var can = true;
var eventTickTimer;

function game(){
	document.getElementsByClassName("menu")[0].style.display = "none";
	
	//
	balls = 1;
	can = true;
	
	// Спавн игрока
	platf = new platform(50,580);
	bonusActor = new Array();
	tiles = new Array();
	ball = new Array();

	// Спавн плиток
	tls = 0;
	for (var i = 0; i < map[level].length; i++){
		for (var j = 0; j < map[level][i].length; j++){
			if(map[level][i][j] != 0){
				tiles[tls] = new tile(j * 80, i * 20, map[level][i][j]);
				tls++;
			}
		}
	}

	// Запуск Таймера
	eventTickTimer = setInterval(eventTick,timeFrame);
}

function eventTick(){
	if (balls <= 0){
		gameOver();
	}
	if (tls <= 0){
		gameOver();
		if (level < map.length){
			level++;
		}
		else{
			level = 0;
		}
	}
}

function gameOver(){
	clearArray(platf);
	clearArray(bonusActor);
	clearArray(tiles);
	clearArray(ball);
	platf = new Array();
	bonusActor = new Array();
	tiles = new Array();
	ball = new Array();
	clearInterval(eventTickTimer);
	clearWorld();
}

function startBall(){
	// Спавн шара
	if (can){
		platf.ball.style.display = "none";
		ball[ball.length] = new Ball(platf.x + platf.width/2 - 10,569);
		can = false;
	}
	
}

function clearWorld(){
	world.innerHTML = "";
	document.getElementsByClassName("menu")[0].style.display = "block";
}

function clearArray(array){
	for (let i = 0; i < array.length; i++){
		clearInterval (array[i].timer);
		array[i].update = null;
	};
}