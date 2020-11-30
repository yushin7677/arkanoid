/// Мировые константы

var world = document.getElementById("world");
var timeFrame = 10;

// Загрузка звуков

var babahSound = new Audio;
babahSound.src = "sounds/babah.mp3";

var collisionPlatfSound = new Audio;
collisionPlatfSound.src = "sounds/collisionPlatf.mp3";

/// Классы и дочерние элементы актора

class actor{	
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.dx = 0;
	}
	
	redraw(){
		this.node.style.left = this.x + "px";
		this.node.style.top = this.y + "px";
		this.node.style.width = this.width + "px";
		this.node.style.height = this.height + "px";
	}
}

class platform extends actor{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(x,y){
		super(x,y);
		this.width = 80;
		this.height = 20;
		this.dx = 0;
		this.speed = 8;
		this.node = document.createElement("div");
		this.node.className = "platform";
		world.append(this.node);
		this.node.innerHTML = "<div class='ball' style='position:absolute; left:50%; width:20px; height:20px; border-radius:10px; transform:translate(-50%, -100%);'></div>";
		this.ball = this.node.getElementsByClassName('ball')[0];
		this.redraw();
		this.timer = setInterval(() => this.update(),timeFrame);
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
}

class tile extends actor{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(x,y,n){
		super(x,y);
		this.width = 80;
		this.height = 20;
		this.n = n;
		if (n == 1){
			this.health = 1;
		}
		else if(n == 2 || n == 3){
			this.health = 2;
		}
		else if(n == 4 || n == 5){
			this.health = 4;
		}
		this.node = document.createElement("div");
		this.node.className = "tile t" + n;
		world.append(this.node);
		this.redraw();
	}
	
	damage(){
		this.health -= 1;
		if(this.n != 5){
			var sound = new Audio;
			sound.src = "sounds/break" + this.n + "_" + this.health + ".mp3";
			sound.play();
			sound = null;
		}
		else{
			var sound = new Audio;
			sound.src = "sounds/break5_0.mp3";
			sound.play();
			sound = null;
		}
		if (this.health <= 0){
		    world.removeChild(this.node);
			this.spawnBonuses();
			tls--;
		}
	}
	
	spawnBonuses(){
		var bon = Math.random();
		if(this.n == 3){
			bon = bon/5 + 0.8;
		}
		if (bon >= 0.8 && bon < 0.85){
			bonusActor[bonusActor.length] = new bonus(this.x, this.y, 1);
		}
		else if (bon >= 0.85 && bon < 0.9){
			bonusActor[bonusActor.length] = new bonus(this.x, this.y, 2);
		}
		else if (bon >= 0.9 && bon < 0.95){
			bonusActor[bonusActor.length] = new bonus(this.x, this.y, 3);
		}
		else if (bon >= 0.95 && bon < 1){
			bonusActor[bonusActor.length] = new bonus(this.x, this.y, 4);
		}
	}
	
}

class bonus extends actor{
	constructor(x,y,n){
		super(x,y);
		this.n = n;
		this.width = 40;
		this.height = 40;
		this.dy = 2;
		this.node = document.createElement("div");
		this.node.className = "bonus";
		this.node.style.backgroundImage = "url(pictures/bonus" + n + ".png)";
		world.append(this.node);
		this.redraw();
		this.timer = setInterval(() => this.update(),timeFrame);
	}
	
	update(){
		this.y = this.y + this.dy;
		this.redraw();
		if (this.y >= (platf.y - this.height) && this.y < (platf.y + platf.height) && this.x >= (platf.x - this.width) && this.x < (platf.x + platf.width)){
			this.node.parentNode.removeChild(this.node);
			switch (this.n){
				case 1:
					if(platf.width < 120){
						platf.width += 40;
						platf.x -= 20;
					}
					break;
				case 2:
					if(platf.width > 40){
						platf.width -= 40;
						platf.x += 20;
					}
					break;
				case 3:
					if(balls < 3){
						for(let i = 0; i < (3 - balls); i++){
							ball[ball.length] = new Ball(this.x, this.y);
						}
						balls = 3;
					}
					break;
				case 4:
					if (can == false){
						platf.ball.style.display = "block";
						balls += 1;
						can = true;
					}
					break;
			}
			clearInterval(this.timer);
		}
		else if(this.y >= 600){
			this.node.parentNode.removeChild(this.node);
			clearInterval(this.timer);
		}
	}
	
	spawnBall(){
		ball[ball.length] = new bonus(this.x, this.y, 1);
		ball[ball.length] = new bonus(this.x, this.y, 1);
	}
}

class Ball extends actor{
	
	// Задание размера и местоположения платформы по умолчанию:
	constructor(x,y){
		super(x,y);
		this.r = 10;
		this.width = 2 * this.r;
		this.height = 2 * this.r;
		this.speed = 3;
		this.dx = 0;
		this.dy = -this.speed;
		this.node = document.createElement("div");
		this.node.className = "ball";
		this.node.style.borderRadius = this.r + "px";
		world.append(this.node);
		this.redraw();
		this.timer = setInterval(() => this.update(),timeFrame);
	}
	
	update(){
		var rel = [0,0];
		this.relationshipWorld(rel);
		this.relationshipRect(rel,platf);
		var k = 0;
		for (var i = 0; i < tiles.length; i++){
			this.relationshipRect(rel,tiles[i]);
			if (tiles[i].health <= 0){
				tiles.splice(i - k,1);
				k++;
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
			var sound = new Audio;
			sound.src = "sounds/wall.mp3";
			sound.play();
			sound = null;
		}
		else if((this.x + this.dx) < 0){
			this.x = -(this.x + this.dx);
			this.dx = - this.dx;
			rel[0] = 1;
			var sound = new Audio;
			sound.src = "sounds/wall.mp3";
			sound.play();
			sound = null;
		}
		else{
			rel[0] = 0;
		}
		
		// Проверка по y:
		if ((this.y + this.dy) > 600 - this.r * 2){
			this.y = (600 - this.r * 2) - ((this.y + this.dy) - (600 - this.r * 2));
			this.dy = - this.dy;
			rel[1] = 1;
			this.node.parentNode.removeChild(this.node);
			balls--;
			clearInterval(this.timer);
		}
		else if((this.y + this.dy) < 0){
			this.y = -(this.y + this.dy);
			this.dy = - this.dy;
			rel[1] = 1;
			var sound = new Audio;
			sound.src = "sounds/wall.mp3";
			sound.play();
			sound = null;
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
			
			// Поиск точки соприкосновения
			var pointRel = [0,0];
			if(this.dx != 0){
				pointRel[0] = begin[0] + part/this.dx;
			}
			else{
				pointRel[0] = begin[0];
			}
			if(this.dy != 0){
				pointRel[1] = begin[1] + part/this.dy;
			}
			else{
				pointRel[1] = begin[1];
			}
			
			if ((pointRel[0] + this.r * 2 >= x1) && (pointRel[0] <= x2)){
				this.y = (y1 - this.r * 2) - (end[1] - (y1 - this.r * 2));
				this.dy = - this.dy;
				rel[1] = 1;
				if(rect.constructor.name == "tile"){
					rect.damage();
				};
				if(rect.constructor.name == "platform"){
					this.dx = ((pointRel[0] + this.r) - (x1 + x2)/2)/(0.5 * (x2 - x1)) * this.speed;
					var sound = new Audio;
					sound.src = "sounds/wall.mp3";
					sound.play();
					sound = null;
				};
			}
		}
		
		// Проверка пересечения нижнего отрезка
		else if ((begin[1] > y2) && (end[1] <= y2) && rel[1] == 0){
			var y3 = begin[1] - y2;
			var y4 = y2 - end[1];
			var part = y3/(y3 + y4);
			
			// Поиск точки соприкосновения
			var pointRel = [0,0];
			if(this.dx != 0){
				pointRel[0] = begin[0] + part/this.dx;
			}
			else{
				pointRel[0] = begin[0];
			}
			if(this.dy != 0){
				pointRel[1] = begin[1] + part/this.dy;
			}
			else{
				pointRel[1] = begin[1];
			}
			
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
			
			// Поиск точки соприкосновения
			var pointRel = [0,0];
			if(this.dx != 0){
				pointRel[0] = begin[0] + part/this.dx;
			}
			else{
				pointRel[0] = begin[0];
			}
			if(this.dy != 0){
				pointRel[1] = begin[1] + part/this.dy;
			}
			else{
				pointRel[1] = begin[1];
			}
			
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
			
			// Поиск точки соприкосновения
			var pointRel = [0,0];
			if(this.dx != 0){
				pointRel[0] = begin[0] + part/this.dx;
			}
			else{
				pointRel[0] = begin[0];
			}
			if(this.dy != 0){
				pointRel[1] = begin[1] + part/this.dy;
			}
			else{
				pointRel[1] = begin[1];
			}
			
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
}