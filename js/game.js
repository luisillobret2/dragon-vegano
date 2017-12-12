var canvasWrap = document.createElement('div');
var overlay = document.createElement('div');
var canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 500;
var ctx = canvas.getContext('2d');
$('#canvas-wrap').prepend(canvas);
var floorLimit = 25;

var startGame = function () {
  var game = new Game(
    new Backgrounds(canvas.height, ctx),
    new Character(200, canvas.height - floorLimit, ctx),
    ctx,
    canvas.width,
    canvas.height
  );
  game.start();
};

// Constructor del juego
function Game (floor, dragon, ctx, width, height) {
  this.width = width;
  this.height = height;
  this.broccolisEaten = 0;
  this.backgrounds = floor;
  this.dragon = dragon;
  this.floorLimit = 25;
  this.context = ctx;
  this.frameNo = 0;
  this.speed = 2;
  this.speedSteak = 7;
  this.acceleration = 0.002;
  this.gameInterval = undefined;
  this.broccoliScore = new Broccoli(60, 35, this.context);

  // Arrays de elementos en el canvas
  this.traps = [];
  this.chickens = [];
  this.broccolis = [];
  this.steaks = [];

  // Para la generación de broccolis y trampas
  this.maxPosition = 50;
  this.minPosition = this.height - 200;
  this.positionRandom = 0;
  this.positionBroccoliIncrement = 0;
  this.positionChicken = this.height - 50;
}
// Método para los sets iniciales del juego  
Game.prototype.start = function () {
  this.dragon.flyControls();
  this.updateGameArea();
  this.dragon.updateFrame();
};
// Método para ir vaciando el canvas  
Game.prototype._clear = function () {
  this.context.clearRect(0, 0, this.width, this.height);
};
// Método para parar el juego
Game.prototype._stop = function () {
  window.cancelAnimationFrame(this.gameInterval);
};
// Método para generar un elemento según los frames(n) indicados
Game.prototype._frameInterval = function (n) {
  if ( (this.frameNo / n) % 1 == 0) { 
    return true; 
  }
  return false;
};
//--------------------------------------------------------------------------------------------------------------
// Linea horizontal de brócolis
Game.prototype._broccolisHorizontalLine = function (quantity) {
  positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Broccoli(this.width + i * 25, positionRandom, this.context)
    );
  }
};

Game.prototype._broccolisThreeLine = function (quantity) {
  /* jshint shadow:true */
  positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
  for (var i = 0; i < (quantity / 3) + 2; i++) {
    this.broccolis.push(
      new Broccoli((this.width + i * 25) - 25, positionRandom, this.context)
    );
  }
  for (var i = 0; i < quantity / 3; i++) {
    this.broccolis.push(
      new Broccoli(this.width + i * 25, positionRandom + 25, this.context)
    );
  }
  for (var i = 0; i < quantity / 3; i++) {
    this.broccolis.push(
      new Broccoli(this.width + i * 25, positionRandom - 25, this.context)
    );
  }
};
// Linea vertical de brócolis
Game.prototype._broccolisVerticalLine = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Broccoli(this.width, this.minPosition + i * -25, this.context)
    );
  }
};
// Diagonal de brócolis hacia abajo
Game.prototype._broccolisDiagonalDown = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Broccoli(this.width + i * 25, this.maxPosition + i * 25, this.context)
    );
  }
};
// Diagonal de brócolis hacia arriba
Game.prototype._broccolisDiagonalUp = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Broccoli(this.width + i * 25, this.minPosition - i * 25, this.context)
    );
  }
};
// Generador de trampas verticales
Game.prototype._trapHorizontal = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
    this.traps.push(
      new Traps(this.width, positionRandom, this.context, 200, 30, 'assets/trap-brocheta-200x30.png')
    );
  }
};
// Trampa vertical
Game.prototype._trapVertical = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
    this.traps.push(
      new Traps(this.width, positionRandom, this.context, 30, 200, 'assets/trap-brocheta-30x200.png')
    );
  }
};

// Filete empanado
Game.prototype._steak = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
    this.steaks.push(
      new Steaks(this.width, positionRandom, this.context)
    );
  }
};
// Generador de pollos
Game.prototype._chickensRandom = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (100 - 25 + 1) + 25);
    this.chickens.push(
      new Chickens(20, 20, 'red', 1000, 450, this.context)
    );
  }
};

//----------------------------------------------------------------------------------------------------------------------

// Método para generar las trampas, los pollos y los brócolis
Game.prototype._sceneCreator = function () {
  
  if (this._frameInterval(166) && this.frameNo < 500) { // Scene 01 -> 10"
    this._broccolisThreeLine(27);

  } else if (this._frameInterval(125) && this.frameNo > 500 && this.frameNo <= 1000) {   // Scene 02 -> 10"
    this._trapVertical(1);

  } else if (this._frameInterval(166) && this.frameNo > 1000 && this.frameNo <= 1500) { // Scene 03 -> 10"
    this._broccolisHorizontalLine(10);
    this._broccolisHorizontalLine(10);  
  } else if (this._frameInterval(250) && this.frameNo > 1000 && this.frameNo <= 1500) { // Scene 03.2 -> 10"
    this._steak(1);

  } else if (this._frameInterval(125) && this.frameNo > 1500 && this.frameNo <= 2000) { // Scene 04 -> 10"
    this._trapHorizontal(1);
  } else if (this._frameInterval(233) && this.frameNo > 1500 && this.frameNo <= 2000) { // Scene 04.2 -> 10"
    this._trapVertical(1);  

  } else if (this._frameInterval(250) && this.frameNo > 2000 && this.frameNo <= 2500) { // Scene 05 -> 10"
    this._broccolisDiagonalDown(12); 
  } else if (this._frameInterval(275) && this.frameNo > 2000 && this.frameNo <= 2500) { // Scene 05 -> 10"
    this._steak(3);
    this._broccolisDiagonalUp(12);

  } else if (this._frameInterval(250) && this.frameNo > 2500 && this.frameNo <= 3000) { // Scene 06 -> 10"
  
  
  } else if (this._frameInterval(250) && this.frameNo > 3000 && this.frameNo <= 3500) { // Scene 07 -> 10"
  
  
  } else if (this._frameInterval(50) && this.frameNo > 3500 && this.frameNo <= 4000) { // Final Scene
  
  }
  
};
// Método para mover las trampas por el canvas  
Game.prototype._sceneMovement = function () {
  /* jshint shadow:true */
  for (var i = 0; i < this.traps.length; i += 1) {
    this.traps[i].x -= this.speed;
    this.traps[i].updateFrame();
    this.traps[i].drawTrap();
  }
  for (var i = 0; i < this.steaks.length; i += 1) {
    this.steaks[i].x -= this.speedSteak;
    this.steaks[i].updateFrame();
    this.steaks[i].drawSteak();
  }
  for (var i = 0; i < this.chickens.length; i += 1) {
    // this.chickens[i].x -= this.speed;
    // this.chickens[i].updateFrame();
    // this.chickens[i].drawChicken();
    this.chickens[i].update();
    this.chickens[i].moveRandom();
  }
  for (var i = 0; i < this.broccolis.length; i += 1) {
    this.broccolis[i].x -= this.speed;
    this.broccolis[i].updateFrame();
    this.broccolis[i].drawTrap();
  }
  for (var i = 0; i < this.broccoliScore.length; i += 1) {
    this.broccoliScore[i].updateFrame();
    this.broccoliScore[i].drawTrap();
  }
  this.broccoliScore.updateFrame();
  this.broccoliScore.drawTrap();
  this._emptyBroccolis();
  this._emptyTraps();
  this._emptySteaks();
  
  this.backgrounds.floorX -= this.speed;
  this.backgrounds.mountainsX -= 1;
};

// Método para las colisiones entre el dragón y los demás elementos.
Game.prototype._proveCrash = function () {
  for (i = 0; i < this.traps.length; i += 1) {
    if (this.dragon.crashWith(this.traps[i])) {
      this._stop();
    }
  }
  for (i = 0; i < this.steaks.length; i += 1) {
    if (this.dragon.crashWith(this.steaks[i])) {
      this._stop();
    }
  }
  this.broccolis.forEach(function (broccoli, index) {
    if (this.dragon.crashWith(broccoli)) {
      this.broccolis.splice(index, 1);
      this.broccolisEaten += 1;
    }
  }.bind(this));
};

Game.prototype._emptyBroccolis = function () {
  this.broccolis.forEach(function (item, index, array) {
    if (item.x < -250) {
      array.splice(item, 1);
    }
  });
};

Game.prototype._emptyTraps = function () {
  this.traps.forEach(function (item, index, array) {
    if (item.x < -200) {
      array.splice(item, 1);
    }
  });
};

Game.prototype._emptySteaks = function () {
  this.steaks.forEach(function (item, index, array) {
    if (item.x < 50) {
      array.splice(item, 1);
    }
  });
};

// ScoreBoard ___________________________________________________
Game.prototype.scoreBroccoli = function () {
  ctx.font = '22px Bungee';
  ctx.fillStyle = '#006931';
  if (this.broccolisEaten < 10) {
    ctx.fillText('00' + this.broccolisEaten, 6, 52);
  } else if (this.broccolisEaten >= 10) {
    ctx.fillText('0' + this.broccolisEaten, 6, 52);
  } else if (this.broccolisEaten >= 100) {
    ctx.fillText(this.broccolisEaten, 6, 52);
  }
};

Game.prototype.scoreDistance = function () {
  this.distance = Math.trunc(this.speed * this.frameNo / 60);
  ctx.font = '30px Bungee';
  ctx.fillStyle = '#411e0a';
  if (this.distance < 10) {
    ctx.fillText('000' + this.distance, 5, 30);
  } else if (this.distance >= 10 && this.distance < 100) {
    ctx.fillText('00' + this.distance, 5, 30);
  } else if (this.distance >= 100 && this.distance < 1000) {
    ctx.fillText('0' + this.distance, 5, 30);
  } else if (this.distance >= 1000) {
    ctx.fillText(this.distance, 5, 30);
  }
  ctx.font = '24px Bungee';
  ctx.fillStyle = '#985c35';
  ctx.fillText('M', 91, 30);
};

Game.prototype._shadow = function () {
  ctx.beginPath();
  ctx.moveTo(20,20);
  ctx.ellipse(240, 475, 2, 25 * this.dragon.y * 0.004, 90 * Math.PI / 180, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fill();
};

//__________________________________________________________________________________________________________________________
// Actualiza el área de juego (canvas) cada 20ms, indicado en el setInterval del método start del constructor.
Game.prototype.updateGameArea = function () {
  this.gameInterval = window.requestAnimationFrame(this.updateGameArea.bind(this));
  this._proveCrash();
  
  this._clear();
  this.frameNo += 1;
  this.speed += this.acceleration;
  
  this.backgrounds.drawSky();
  this.backgrounds.drawMountains();
  this.backgrounds.drawFloor();

  this._sceneCreator();
  this._sceneMovement();
  
  this._shadow();
  this.dragon.newPos();
  this.dragon.drawCharacter();
  this.dragon.limits(canvas.height - floorLimit);
  
  this.scoreBroccoli();
  this.scoreDistance();
}; 