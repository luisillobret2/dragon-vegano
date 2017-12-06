// Variables globales para crear el canvas y insertarlo en el body con el id gameArea
var canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 500;
var ctx = canvas.getContext('2d');
document.body.insertBefore(canvas, document.body.childNodes[0]);
$('canvas').attr('id', 'gameArea');

// Constructor del juego
function Game (bg, dragon, ctx, width, height) {
  this.width = width;
  this.height = height;
  this.counterBrocolis = 0;
  this.floor = bg;
  this.dragon = dragon;
  this.context = ctx;
  this.frameNo = 0;
  this.speed = 3;
  this.acceleration = 0.002;
  this.gameInterval = undefined;

  // Arrays de elementos en el canvas
  this.traps = [];
  this.chickens = [];
  this.broccolis = [];

  // Para la generación de brocolis y trampas
  this.maxPosition = 50;
  this.minPosition = this.height - 100;
  this.positionRandom = 0;
  this.positionBroccoliIncrement = 0;
  this.positionChicken = this.height - 20;
}
// Método para los sets iniciales del juego  
Game.prototype.start = function () {
  this.dragon.flyControls();
  this.broccolisEaten = 0;
  this.gameInterval = setInterval(this.updateGameArea.bind(this), 20);
};
// Método para ir vaciando el canvas  
Game.prototype._clear = function () {
  this.context.clearRect(0, 0, this.width, this.height);
};
// Método para parar el juego
Game.prototype._stop = function () {
  clearInterval(this.gameInterval);
};
// Método para generar un elemento según los frames(n) indicados
Game.prototype._frameInterval = function (n) {
  if ((this.frameNo / n) % 1 == 0) { 
    return true; 
  }
  return false;
};
// Método para las colisiones entre el dragón y los demás elementos.
Game.prototype._proveCrash = function () {
  for (i = 0; i < this.traps.length; i += 1) {
    if ( this.dragon.crashWith(this.traps[i])) {
      this._stop();
    } 
  }
  for (i = 0; i < this.chickens.length; i += 1) {
    if (this.dragon.crashWith(this.chickens[i])) {
      this._stop();
    }
  }  
  this.broccolis.forEach(function (broccoli, index){
    if (this.dragon.crashWith(broccoli)) {
      this.broccolis.splice(index, 1);
      this.broccolisEaten += 1;
      console.log("counterBrocolis", this.broccolisEaten);
    }
  }.bind(this));
};
// Linea horizontal de brócolis
Game.prototype._broccolisHorizontalLine = function (quantity) {
  positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Brocoli(20, 20, "green", this.width + i * 25, positionRandom, this.context)
    );
  }
};
// Linea vertical de brócolis
Game.prototype._broccolisVerticalLine = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Brocoli(20, 20, "green", this.width, this.minPosition + i * -25, this.context)
    );
  }
};
// Diagonal de brócolis hacia abajo
Game.prototype._broccolisDiagonalDown = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Brocoli(20, 20, 'green', this.width + i * 25, this.maxPosition + i * 25, this.context)
    );
  }
};
// Diagonal de brócolis hacia arriba
Game.prototype._broccolisDiagonalUp = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    this.broccolis.push(
      new Brocoli(20, 20, 'green', this.width + i * 25, this.minPosition - i * 25, this.context)
    );
  }
};
// Generador de trampas
Game.prototype._trapAlone = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (this.maxPosition - this.minPosition + 1) + this.minPosition);
    this.traps.push(
      new Obstacles(500, 10, 'black', this.width, positionRandom, this.context)
    );
  }
};
// Generador de pollos
Game.prototype._chickensRandom = function (quantity) {
  for (var i = 0; i < quantity; i++) {
    positionRandom = Math.floor(Math.random() * (100 - 25 + 1) + 25);
    this.chickens.push(
      new Obstacles(20, 20, 'yellow', this.width + i * positionRandom, this.positionChicken, this.context)
    );
  }
};
// Método para generar las trampas, los pollos y los brócolis
Game.prototype._sceneCreator = function () {
  
  if (this._frameInterval(250) && this.frameNo <= 500) { // Scene 01 -> 10"
    this._broccolisHorizontalLine(10);

  } else if (this._frameInterval(250) && this.frameNo <= 1000) {   // Scene 02 -> 10"
    this._broccolisVerticalLine(10);
    this._chickensRandom(5);

  } else if (this._frameInterval(250) && this.frameNo <= 1500) { // Scene 03 -> 10"
    this._chickensRandom(3);
    this._broccolisDiagonalUp(10); 
    
  } else if (this._frameInterval(300) && this.frameNo <= 1500) { // Scene 03.2 -> 10"
    this._broccolisDiagonalDown(10);

  } else if (this._frameInterval(250) && this.frameNo <= 2000) { // Scene 04 -> 10"
    
  } else if (this._frameInterval(250) && this.frameNo <= 2500) { // Scene 05 -> 10"
    
  } else if (this._frameInterval(250) && this.frameNo <= 3000) { // Scene 06 -> 10"
    
  } else if (this._frameInterval(50) && this.frameNo > 3500) { // Final Scene
    
  }
  
};
// Método para mover las trampas por el canvas  
Game.prototype._sceneMovement = function () {
  /* jshint shadow:true */
  for (var i = 0; i < this.traps.length; i += 1) {
    this.traps[i].x -= this.speed;
    this.traps[i].update();
  }
  for (var i = 0; i < this.chickens.length; i += 1) {
    this.chickens[i].x -= this.speed;
    this.chickens[i].update();
  }
  for (var i = 0; i < this.broccolis.length; i += 1) {
    this.broccolis[i].x -= this.speed;
    this.broccolis[i].update();
  }
};

// Actualiza el área de juego (canvas) cada 20ms, indicado en el setInterval del método start del constructor.
Game.prototype.updateGameArea = function () {
  this._proveCrash();
  
  this._clear();
  this.frameNo += 1;
  this.speed += this.acceleration;
  
  this._sceneCreator();
  this._sceneMovement();
  
  this.floor.drawBackground();
  this.dragon.newPos();
  this.dragon.update();
  this.dragon.limits(canvas.height - 25); 
  
};

function startGame() {
  var game = new Game(
    new Floor(ctx),
    new Character(30, 30, 'red', 100, 470, ctx),
    ctx,
    canvas.width,
    canvas.height
  );
  game.start();
}