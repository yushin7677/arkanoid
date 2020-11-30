/// Мировые константы

var world = document.getElementById("world");

/// Конструкторы акторов и павнов

// Конструктор класса platform:
class platform{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(){
		this.x = 40;
		this.y = 580;
		this.width = 80;
		this.height = 20;
		this.dx = 0;
		this.speed = 8;
		this.redraw();
	}
	
	update(){
		this.dx = (pressRight - pressLeft) * this.speed;
		if ((this.x + this.dx) > 800 - this.width){
			this.x = 800 - this.width;
		}
		else if((this.x + this.dx) < 0){
			this.x = 0;
		}
		else{
			this.x += this.dx;
		}
		this.redraw();
	}
	
	redraw(){
		var node = document.getElementById("platform");
		node.style.left = this.x + "px";
		node.style.top = this.y + "px";
		node.style.width = this.width + "px";
		node.style.height = this.height + "px";
	}
}

// Конструктор класса tile:
class tile{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.width = 80;
		this.height = 20;
		this.health = 1;
		this.node = document.createElement("div");
		this.node.className = "tile";
		this.node.style.width = this.width + "px";
		this.node.style.height = this.height + "px";
		this.node.style.top = this.y + "px";
		this.node.style.left = this.x + "px";
		world.append(this.node);
	}
	
	damage(){
		this.health -= 1;
		if (this.health <= 0){
		    world.removeChild(this.node);
		}
	}
	
}

// Конструктор класса ball:
class Ball{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.r = 10;
		this.speed = 6;
		this.dx = this.speed;
		this.dy = this.speed;
		this.node = document.createElement("div");
		this.node.id = "ball";
		this.node.style.width = this.r * 2 + "px";
		this.node.style.height = this.r * 2 + "px";
		this.node.style.top = this.y + "px";
		this.node.style.left = this.x + "px";
		this.node.style.borderRadius = this.r + "px";
		world.append(this.node);
		this.redraw();
	}
	
	update(platf,tiles){
		var rel = [0,0];
		this.relationshipWorld(rel);
		this.relationshipRect(rel,platf);
		for (var i = 0; i < tiles.length; i++){
			this.relationshipRect(rel,tiles[i]);
			if (tiles[i].health <= 0){
				tiles.splice(i,1);
			}
		}
		if (rel[0] == 0){
			this.x += this.dx;
		}
		if (rel[1] == 0){
			this.y += this.dy;
		}
		this.redraw();
	}
	
	relationshipWorld(rel){
		// Проверка по x:
		if ((this.x + this.dx) > 800 - this.r * 2){
			this.x = (800 - this.r * 2) - ((this.x + this.dx) - (800 - this.r * 2));
			this.dx = - this.dx;
			rel[0] = 1;
		}
		else if((this.x + this.dx) < 0){
			this.x = -(this.x + this.dx);
			this.dx = - this.dx;
			rel[0] = 1;
		}
		else{
			rel[0] = 0;
		}
		
		// Проверка по y:
		if ((this.y + this.dy) > 600 - this.r * 2){
			this.y = (600 - this.r * 2) - ((this.y + this.dy) - (600 - this.r * 2));
			this.dy = - this.dy;
			rel[1] = 1;
			console.log("Поражение");
		}
		else if((this.y + this.dy) < 0){
			this.y = -(this.y + this.dy);
			this.dy = - this.dy;
			rel[1] = 1;
		}
		else{
			rel[1] = 0;
		}
    }
	
	relationshipRect(rel,rect){
		var collision = false;
		
		// Временные переменные
		var begin = [this.x, this.y];
		var end = [this.x + this.dx, this.y + this.dy];
		var x1 = rect.x;
		var x2 = rect.x + rect.width;
		var y1 = rect.y;
		var y2 = rect.y + rect.height;
		
		// Проверка пересечения верхнего отрезка
		if ((begin[1] < (y1 - this.r * 2)) && (end[1] >= (y1 - this.r * 2)) && rel[1] == 0){
			var y3 = (y1 - this.r * 2) - begin[1];
			var y4 = end[1] - (y1 - this.r * 2);
			var part = y3/(y3 + y4);
			var pointRel = [begin[0] + part/this.dx, begin[1] + part/this.y];
			if ((pointRel[0] + this.r * 2 >= x1) && (pointRel[0] <= x2)){
				this.y = (y1 - this.r * 2) - (end[1] - (y1 - this.r * 2));
				this.dy = - this.dy;
				rel[1] = 1;
				if(rect.constructor.name == "tile"){
					rect.damage();
				};
			}
		}
		
		// Проверка пересечения нижнего отрезка
		else if ((begin[1] > y2) && (end[1] <= y2) && rel[1] == 0){
			var y3 = begin[1] - y2;
			var y4 = y2 - end[1];
			var part = y3/(y3 + y4);
			var pointRel = [begin[0] + part/this.dx, begin[1] + part/this.dy];
			if ((pointRel[0] + this.r * 2 >= x1) && (pointRel[0] <= x2)){
				this.y = y2 - (y2 - end[1]);
				this.dy = - this.dy;
				rel[1] = 1;
				if(rect.constructor.name == "tile"){
					rect.damage()
				};
			}
		}
		
		// Проверка пересечения левого отрезка 
		else if ((begin[0] < (x1 - this.r * 2)) && (end[0] >= (x1 - this.r * 2)) && rel[0] == 0){
			var x3 = (x1 - this.r * 2) - begin[0];
			var x4 = end[0] - (x1 - this.r * 2);
			var part = x3/(x3 + x4);
			var pointRel = [begin[0] + part/this.dx, begin[1] + part/this.y];
			if ((pointRel[1] + this.r * 2 >= y1) && (pointRel[1] <= y2)){
				this.x = (x1 - this.r * 2) - (end[0] - (x1 - this.r * 2));
				this.dx = - this.dx;
				rel[0] = 1;
				if(rect.constructor.name == "tile"){
					rect.damage()
				};
			}
		}
		
		// Проверка пересечения правого отрезка
		else if ((begin[0] > x2) && (end[0] <= x2) && rel[0] == 0){
			var x3 = begin[0] - x2;
			var x4 = x2 - end[0];
			var part = x3/(x3 + x4);
			var pointRel = [begin[0] + part/this.dx, begin[1] + part/this.dy];
			if ((pointRel[1] + this.r * 2 >= y1) && (pointRel[1] <= y2)){
				this.x = x2 - (x2 - end[0]);
				this.dx = - this.dx;
				rel[0] = 1;
				if(rect.constructor.name == "tile"){
					rect.damage()
				};
			}
		}
		
		return collision;
    }
	
	redraw(){
		var node = document.getElementById("ball");
		node.style.left = this.x + "px";
		node.style.top = this.y + "px";
		node.style.width = this.r * 2 + "px";
		node.style.height = this.r * 2 + "px";
	}
}

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

/// Игра

// Спавн игрока
var platf = new platform();

// Спавн плиток
var tiles = new Array();
var k = 0;
for (var i = 0; i < 10; i++){
	for (var j = 0; j < 10; j++){
		tiles[k] = new tile(i * 80, j * 20);
		k++;
	}
}

// Спавн шара
var ball = new Ball(100,550);

// Запуск Таймера
var eventTickTimer = setInterval(eventTick,10);

function eventTick(){
	platf.update();
	ball.update(platf,tiles);
}