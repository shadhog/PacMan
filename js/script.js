$( document ).ready(function() {
	
	
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	
	var mkw = getUrlParameter('mkw');
	


	var winDiv = $('#win');
	var container = document.getElementById('container');
	var canvas = document.getElementById('background');
	
	var mapSize = 23,
		canvasWidth = container.offsetWidth;
	if(canvasWidth > 600) canvasWidth = 600;
	var blockSize = parseInt(canvasWidth/mapSize);
	canvasWidth = blockSize * mapSize;
	canvas.width = canvasWidth;
	canvas.height = canvasWidth;
	
	var c = canvas.getContext('2d');

	window.addEventListener('resize', function(event) {
		canvasWidth = container.offsetWidth;
		if(canvasWidth > 600) canvasWidth = 600;
		blockSize = parseInt(canvasWidth/mapSize);
		canvasWidth = blockSize * mapSize;
		canvas.width = canvasWidth;
		canvas.height = canvasWidth;
		map.tsize = blockSize;
		map.draw();
	});

	
	var centerX = canvas.width / 2,
		centerY = canvas.height / 2,
		run = true,
		score = 0,
		scoreDiv = $('#score');
		
	var fps = 200,
		now,
		then = Date.now(),
		interval = 1000/fps,
		delta;
	
	var map = {
		cols: mapSize,
		rows: mapSize,
		tsize: blockSize,
		// 0 = Clear;   1 = wall;   2 = PacMan;   3 = Enamy;   4 = Dot;
		tiles: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
			1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 4, 1, 1, 4, 1, 4, 1, 4, 1, 4, 1, 1, 4, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 
			1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 1, 1, 1, 1, 
			1, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 4, 1, 1, 1, 4, 1, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 1, 4, 1, 4, 4, 4, 4, 4, 4, 4, 1, 4, 1, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 4, 1, 4, 1, 4, 1, 1, 0, 1, 1, 4, 1, 4, 1, 4, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 1, 4, 4, 4, 1, 3, 3, 3, 1, 4, 4, 4, 1, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 4, 1, 4, 1, 4, 1, 3, 3, 3, 1, 4, 1, 4, 1, 4, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 1, 4, 1, 4, 1, 1, 1, 1, 1, 4, 1, 4, 1, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 1, 4, 1, 4, 4, 4, 2, 4, 4, 4, 1, 4, 1, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 4, 4, 1, 4, 1, 1, 1, 1, 1, 4, 1, 4, 4, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 4, 4, 4, 1, 
			1, 1, 1, 1, 4, 1, 4, 4, 4, 1, 4, 1, 4, 1, 4, 4, 4, 1, 4, 1, 1, 1, 1, 
			1, 4, 4, 4, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 1, 
			1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 
			1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1

		],
		colors: ['#333333','#e0e0e0','yellow', 'red','yellow'],
		getTile: function(col, row) {
			return this.tiles[row * map.cols + col]
		},
		setTile: function(col, row, value) {
			this.tiles[row * map.cols + col] = value;
		},
		getColor: function(tile) {
			return this.colors[tile]
		},
		getPacMan: function(tile) {
			return this.tiles.indexOf(2);
		},
		getPacManColor: function() {
			return this.colors[2];
		},
		getClearColor: function() {
			return this.colors[0];
		},
		getDotColor: function() {
			return this.colors[4]
		},
		getEnemy: function(id) {
			var indices = getAllIndexes(this.tiles, 3);
			console.log(indices);
			return indices[id];
			//return this.tiles.indexOf(3);
		},
		getEnemyColor: function() {
			return this.colors[3];
		},
		draw: function() {
			for (var col = 0; col < this.cols; col++) {
				for (var row = 0; row < this.rows; row++) {
					var tile = this.getTile(col, row);
					c.beginPath();
					if(tile == 2 || tile == 3 || tile == 4) {
						if(tile == 2 || tile == 3)
							c.arc(col*this.tsize + this.tsize/2, row*this.tsize  + this.tsize/2, this.tsize/2, 0, 2*Math.PI);
						if(tile == 4)
							c.arc(col*this.tsize + this.tsize/2, row*this.tsize  + this.tsize/2, this.tsize/6, 0, 2*Math.PI);
					}
					else c.rect(col*this.tsize, row*this.tsize, this.tsize, this.tsize); 
					c.fillStyle = this.getColor(tile);
					c.fill();
				}
			}
		}
	};
	
	function getAllIndexes(arr, val) {
		var indexes = [], i;
		for(i = 0; i < arr.length; i++)
			if (arr[i] === val)
				indexes.push(i);
		return indexes;
	}
	

	
	function PacMan() {
		this.col = map.getPacMan()%map.cols;
		this.row = parseInt(map.getPacMan()/map.cols);
		this.tsize = map.tsize;
		this.color = map.getPacManColor();
		this.direction;
		this.tempDirection;
		this.keyPressed = false;
		this.aniX = 0;
		this.aniY = 0;
		this.aniP = 0;
		this.aniPt = 1;
		this.dirP;
		this.next;
		
		this.move = function() {
			if(this.aniX == 0 && this.aniY == 0) {
				this.next = this.checkDirection(this.tempDirection);
				if(this.tempDirection != this.direction && !this.canMove(this.next)) {
					this.tempDirection = this.direction;
					this.next = this.checkDirection(this.direction);
					//this.keyPressed = true;
				}
				else {
					this.direction = this.tempDirection;
					if(!this.canMove(this.next)) {
						this.keyPressed = false;
						this.aniP = 0;
					}
				}
			}
			if(this.keyPressed) {
				 if(Math.abs(this.aniX) == this.tsize || Math.abs(this.aniY) == this.tsize) {
					this.col = this.next.col;
					this.row = this.next.row;
					this.checkIfDot();
					this.aniX = 0;
					this.aniY = 0;
				}
				else {
					if(!this.canMove(this.next)) {
						this.keyPressed = false;
						this.aniP = 0;
					}
					else { 
					c.beginPath();
					c.rect(this.col*this.tsize + this.aniX, this.row*this.tsize  + this.aniY, this.tsize, this.tsize);
					c.fillStyle = map.getClearColor();
					c.fill();
					
					if(this.col != this.next.col) this.aniX = this.aniX - (this.col-this.next.col);
					if(this.row != this.next.row) this.aniY = this.aniY - (this.row-this.next.row);
					if(this.aniP >= 0.3 || this.aniP < 0) this.aniPt *= -1;
					this.aniP += (this.aniPt)*0.05;
					
					
					c.beginPath();	
					c.moveTo(this.col*this.tsize + this.tsize/2 + this.aniX,this.row*this.tsize  + this.tsize/2 + this.aniY);
					c.arc(this.col*this.tsize + this.tsize/2 + this.aniX,
						  this.row*this.tsize  + this.tsize/2 + this.aniY,
						  this.tsize/2,
						  this.dirP + this.aniP * Math.PI,
						  this.dirP + (2-this.aniP) * Math.PI,
						  false);
					c.lineTo(this.col*this.tsize + this.tsize/2 + this.aniX,this.row*this.tsize  + this.tsize/2 + this.aniY);
					c.fillStyle = this.color;
					c.fill();
					}
				}
			}
			else {
				this.next = this.checkDirection(this.direction);
				this.aniX = 0;
				this.aniY = 0;
			}
			
				
				
			
		}
		
		this.checkDirection = function(direction) {
			switch(direction) {
				case 'right':
					this.dirP = 0;
					return {col: this.col + 1 , row: this.row};
				break;
				case 'left':
					this.dirP = 3.1;
					return {col: this.col - 1 , row: this.row};
				break;
				case 'down':
					this.dirP = 1.6;
					return {col: this.col , row: this.row + 1};
				break;
				case 'up':
					this.dirP = 4.7;
					return {col: this.col , row: this.row - 1};
				break;
			}
		}
		
		this.canMove = function(next) {
			if(map.getTile(next.col, next.row) == 3) {
				gameOver();
				return false;
			}
			if(map.getTile(next.col, next.row) == 1) return false;
			else return true;
		}
		
		this.checkIfDot = function() {
			if(map.getTile(this.col, this.row) == 4) {
				map.setTile(this.col, this.row, 0);
				scoreDiv.html(++score);
				return true;
			}
			else return false;
		}
		
	}	
	
	function Enemy(id) {
		this.col = map.getEnemy(id)%map.cols;
		this.row = parseInt(map.getEnemy(id)/map.cols);
		this.tsize = map.tsize;
		this.color = map.getEnemyColor();
		this.direction = 'up';
		this.desireDirection = 'right';
		this.tempDirection;
		this.aniX = 0;
		this.aniY = 0;
		this.next;
		
		this.move = function() {
			if(this.aniX == 0 && this.aniY == 0) {
				//this.direction = this.desireDirection;
				if(Math.floor((Math.random() * 20)) == 0) this.direction = 'up';
				this.next = this.checkDirection(this.direction);
			}
			if(Math.abs(this.aniX) == this.tsize || Math.abs(this.aniY) == this.tsize) {
				this.col = this.next.col;
				this.row = this.next.row;
				this.aniX = 0;
				this.aniY = 0;
			}
			else {
				if(this.canMove(this.next)) {
					c.beginPath();
					c.rect(this.col*this.tsize + this.aniX, this.row*this.tsize  + this.aniY, this.tsize, this.tsize);
					c.fillStyle = map.getClearColor();
					c.fill();
					
					this.checkIfDot();
					
					if(this.col != this.next.col) this.aniX = this.aniX - (this.col-this.next.col);
					if(this.row != this.next.row) this.aniY = this.aniY - (this.row-this.next.row);
					
					c.beginPath();
					c.arc(this.col*this.tsize + this.tsize/2 + this.aniX, this.row*this.tsize  + this.tsize/2 + this.aniY, this.tsize/2, 0, 2*Math.PI);
					c.fillStyle = this.color;
					c.fill();
				}
				else {
					if(this.direction == 'right') { this.direction = 'down'; this.desireDirection = 'left'; }
					else if(this.direction == 'down') { this.direction = 'left'; this.desireDirection = 'up'; }
					else if(this.direction == 'left') { this.direction = 'up'; this.desireDirection = 'right'; }
					else if(this.direction == 'up') { this.direction = 'right'; this.desireDirection = 'down'; }
				}
			}
			
		}
		
		this.checkDirection = function(direction) {
			switch(direction) {
				case 'right':
					return {col: this.col + 1 , row: this.row};
				break;
				case 'left':
					return {col: this.col - 1 , row: this.row};
				break;
				case 'down':
					return {col: this.col , row: this.row + 1};
				break;
				case 'up':
					return {col: this.col , row: this.row - 1};
				break;
			}
		}
		
		this.canMove = function(next) {
			if(map.getTile(next.col, next.row) == 2) {
				gameOver();
				return false;
			}
			if(map.getTile(next.col, next.row) == 1) return false;
			else return true;
		}
		
		this.checkIfDot = function() {
			if(map.getTile(this.col, this.row) == 4) {
				c.beginPath();
				c.arc(this.col*this.tsize + this.tsize/2, this.row*this.tsize  + this.tsize/2, this.tsize/6, 0, 2*Math.PI);
				c.fillStyle = map.getDotColor();
				c.fill();
				return true;
			}
			else return false;
		}
		
	}	
	
	
	
	if( typeof mkw !== 'undefined') win = mkw;
		
	console.log('>> MKW: ' + win);
	
	c.lineWidth=0.3;
	c.beginPath();
	c.rect(0, 0, canvas.width, canvas.height); 
	c.fillStyle = map.getColor('0');
	c.fill();
	
	c.font = '30px Arial';
	c.textAlign = 'center';

	var thePacMan = new PacMan();
	var theEnamy = new Enemy(0);
	var theEnamy2 = new Enemy(1);
	var theEnamy3 = new Enemy(2);
	var theEnamy4 = new Enemy(3);
	var theEnamy5 = new Enemy(4);
	var theEnamy6 = new Enemy(5);
	map.draw();
		loop();
		

	function loop() {
		if(run) requestAnimationFrame(loop);
			if(thePacMan.keyPressed) {
				now = Date.now();
				delta = now - then;
			 
				if (delta > interval) {
					then = now - (delta % interval);
					
				thePacMan.move();
				
			}
		}
		theEnamy.move();
		theEnamy2.move();
		theEnamy3.move();
		theEnamy4.move();
		theEnamy5.move();
		theEnamy6.move();
		
		if(thePacMan.col == theEnamy.col && thePacMan.row == theEnamy.row) gameOver();
	}
		
	function gameOver() {
		run = false;
		console.error('Game Over');
	}
	
	$(window).keydown(function(e){
		if(e.keyCode == 39){
			thePacMan.tempDirection = 'right';
			thePacMan.keyPressed = true;
		}
		if(e.keyCode == 37){
			thePacMan.tempDirection = 'left';
			thePacMan.keyPressed = true;
		}
		if(e.keyCode == 40){
			thePacMan.tempDirection = 'down';
			thePacMan.keyPressed = true;
		}
		if(e.keyCode == 38){
			thePacMan.tempDirection = 'up';
			thePacMan.keyPressed = true;
		}
		if(thePacMan.direction == undefined) thePacMan.direction = thePacMan.tempDirection;
	});
	
	function degreesToRadians(degrees) {
		return (degrees * Math.PI) / 180;
	}
		
	
	

});

