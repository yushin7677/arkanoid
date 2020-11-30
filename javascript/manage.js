/// Управление

// Переменные нажатия
var pressLeft = 0;
var pressRight = 0;

// Обработчики нажатия клавиш
document.addEventListener("keydown", (event) =>{
	if (event.keyCode == 65){
		pressLeft = 1;
	}
	if (event.keyCode == 68){
		pressRight = 1;
	}
	if (event.keyCode == 32){
		startBall();
	}
});

// Обработчик отжатия клавиш
document.addEventListener("keyup", (event) =>{
	if (event.keyCode == 65){
		pressLeft = 0;
	}
	if (event.keyCode == 68){
		pressRight = 0;
	}
});

