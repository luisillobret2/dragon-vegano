// Defino las propiedades básicas del personaje.
function Character(x, y, ctx) {
  
  this.x = x;
  this.y = y;
  this.ctx = ctx;
  
  this.speedY = 0;
  this.gravity = 0.8;
  this.gravitySpeed = 0;
  this.bounce = 0.6;


  this.spriteWidth = 1860;
  this.spriteHeight = 60;
  this.spriteRows = 1;
  this.spriteColumns = 26;
  this.spriteWalk = 1;
  this.spriteFrameWidth = this.spriteWidth / this.spriteColumns;
  this.spriteFrameHeight = this.spriteHeight / this.spriteRows;
  this.currentFrame = 0;
  this.srcX = 0;
  this.srcY = 0;
  this.frameCount = 26;
  this.walk = true;
  this.characterImage = new Image();
  this.characterImage.src = 'assets/walk_cycle_60x1860.png';

}

// Dibujo el personaje
Character.prototype.updateFrame = function () {
  this.frameInterval = setInterval(function () {
    this.currentFrame = ++this.currentFrame % this.frameCount;
    this.srcX = this.currentFrame * this.spriteFrameWidth;
  }.bind(this), 30);
};

Character.prototype.drawCharacter = function () {
  this.ctx.drawImage(this.characterImage, this.srcX, this.srcY, this.spriteFrameWidth, this.spriteFrameHeight, this.x, this.y, this.spriteFrameWidth, this.spriteFrameHeight);
};

// Añadimos la gravedad a la posición del personaje
Character.prototype.newPos = function () {
  this.gravitySpeed += this.gravity;
  this.y += this.speedY + this.gravitySpeed;
};

// Ponemos límites de suelo y techo y añadimos el rebote (que sólo debería existir cuando muera)
Character.prototype.limits = function (height) {
  var floor = height - this.spriteFrameHeight;
  var roof = height - height;
  
  if (this.y > floor) {
    this.y = floor;
    this.gravitySpeed = -(this.gravitySpeed * this.bounce);
  }
  if (this.y < roof) {
    this.y = roof;
  }
};

// Asignamos la tecla 'espacio' para cambiar la gravedad y volar!!
Character.prototype.flyControls = function () {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 32:
        if(this.y > 0) {
          this.gravity = -0.8;
        } 
        else {
            this.gravity = 0.8;
            this.y = 0;
        }
        break;
    }
  }.bind(this);

  document.onkeyup = function (e) {
    switch (e.keyCode) {
      case 32:
        this.gravity = 0.8;
        break;
    }
  }.bind(this);
};

// Definimos colisiones entre los componentes
Character.prototype.crashWith = function (otherComponent) {
  var myLeft = this.x;
  var myRight = this.x + this.spriteFrameWidth;
  var myTop = this.y;
  var myBottom = this.y + this.spriteFrameHeight;

  var otherLeft = otherComponent.x;
  var otherRight = otherComponent.x + (otherComponent.spriteFrameWidth);
  var otherTop = otherComponent.y;
  var otherBottom = otherComponent.y + (otherComponent.spriteFrameHeight);

  var crash = true;

  if ( myBottom < otherTop || myTop > otherBottom || myRight < otherLeft || myLeft > otherRight ) {
    crash = false;
  }
  return crash;
};