// Initializing game variables, such as arrays of obstacles, enemy bugs, a variable that tracks player i and i-1 live (x,y) coordinates, and
// playFactror to adjust the number of enemies as the game progresses, trackNum to track player winning runs (player reaches water)
var obstacles = [];
var allEnemies = [];
var coords = [];
var gameEnd = false;
var playFactor = 1;
var trackNum = 0;

// Enemy object constructor function
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Methods added to the enemy prototype object to enable method inheritance
// update method resets bugs x coordinate and as they cross off the canvas puts them in the fron of the canvas
Enemy.prototype.update = function(dt) {
    if (this.x > 505) {this.x = -156 + Math.random() * 55;}
    this.x += dt * this.speed;
};

// render method is called to draw each bug on the canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player object constructor function
var Player = function(x,y,translX,translY,stepNum) {
    this.x = x;
    this.y = y;
    this.stepNum = stepNum;
    this.translX = translX;
    this.translY = translY;
    this.score = 0;
    this.life = 3;
    this.sprite = 'images/char-boy.png';
};

// Player accessible methods added to the prototype object
// handleInput method is used to set the player's x and y translocation values when a keydown event fires,
// and it also confines the player movements to the canvas field 
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > 100) { this.translX = -101;}
    if (key === 'right'&& this.x < 403) { this.translX = 101;}
    if (key === 'up' && this.y > 0) { this.translY = -83;}
    if (key === 'down' && this.y < 403) { this.translY = 83;}
};

// update method moves the player to a new position depending x and y translocation parameter values set by
// handleInput method. Movements occur only as single steps on x or y axis controllled by stepNum = 1 value. 
Player.prototype.update = function() {
    if (this.stepNum == 1) {coords[0]=this.x; this.x += this.translX; coords[1]=this.x; 
        coords[2]=this.y; this.y += this.translY; coords[3]=this.y; this.stepNum = 0;}
       else { this.translY = 0; this.translX = 0;}
    ctx.clearRect(0, 0, 550, 550);
    };

// rended method draws the player image and it also draws current game score and lives values
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.stepNum = 0;
    ctx.fillStyle = "black";
    ctx.font = "1.7em serif";
    if (this.life <2) {ctx.fillStyle = "red"; ctx.font = "bolder 1.7em serif";}
    ctx.fillText("Lives left:"+" "+this.life, 300, 30);
    ctx.fillStyle = "black";
    ctx.font = "1.7em serif";
    ctx.fillText("Game score:"+" "+this.score, 70, 30);
    ctx.fill();
};

// crashWith value is a boolean method/function that tests if there is an overlap between
// the player's current position and that of either bugs, prizes and obstacles
Player.prototype.crashWith = function(enemyObj) {
    if (isArray(enemyObj)) {
        for (var i = 0; i < enemyObj.length; i++) {
        if(this.y < enemyObj[i].y + 41 && this.y + 41 > enemyObj[i].y) {if(enemyObj[i].type == "obstacle") {
         if (this.x == enemyObj[i].x) {return true;}   
        }
           else if ((this.x > enemyObj[i].x && enemyObj[i].x + 83 > this.x) || (this.x < enemyObj[i].x && enemyObj[i].x - 83 < this.x))
                    {return true;}}
            }
        }
        if (this.y < enemyObj.y + 41 && this.y + 41 > enemyObj.y) { 
            if (this.x == enemyObj.x) {return true;}
        }   
  return false;
};

// finishLine method is a boolean method that test if the player reached the water (the finish line)
Player.prototype.finishLine = function () {
    if (this.y < 60) {return true;}
    return false;
};

// reset method resets player's position and score/life values and also game objects (bugs and obstacles)
// depending on the outcomes of crashWith and finishLine methods
Player.prototype.reset = function (reset,collectPrize,score,life,obstacle,finish) {
    if (reset) {
        this.x = 202;
        this.y = 404;
        this.life +=life;
        }
    if (collectPrize) {
        this.score +=score;
        this.life +=life;
        prize.x = -1000;
        }
    if (obstacle) {
        this.x = coords[0];
        this.y = coords[2];
    }
    if (finish) {
        this.score +=score;
        this.x = 202;
        this.y = 404;
        obstacles = [];
        getObstacle(3, 1, 1, 1);
        trackNum++;
        if (trackNum > 2) {
        obstacles = [];
        getObstacle(3, 1, 1, 2);
        }
        if (trackNum > 4) {
        obstacles = [];
        getObstacle(3, 2, 1, 1);
        }
        if (trackNum > 8) {
        obstacles = [];
        getObstacle(3, 4, 1, 4);
        }
        if (trackNum > 10) {
        obstacles = [];
        getObstacle(3, 3, 0, 2);
        playFactor = 2;
        allEnemies=[];
        enemyCreate();
        }
        if (trackNum > 15) {
        obstacles = [];
        getObstacle(3, 4, 0, 4);
        allEnemies=[];
        enemyCreate();
        }
        createNew();
    }
    if (this.life == 0){gameEnd = true;}
};

// Object constructor function for both prizes/gems and obstacles
var Prize = function (x,y,addScore,addLife,expirationTime,sprite,type) {
    this.x = x;
    this.y = y;
    this.addScore = addScore;
    this.addLife = addLife;
    this.expirationTime = expirationTime;
    this.sprite = sprite;
    this.type = type;
};

// Prize's render method is used to draw and flicker prizes on the screen
Prize.prototype.render = function() {
    if (this.expirationTime == "none")
        {ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 120);}
    else if (this.expirationTime > 0 && this.expirationTime < 500 && Number((this.expirationTime/10).toFixed(0))%2 == 0){this.expirationTime -=1;}
    else if (this.expirationTime > 0 && this.expirationTime < 500) 
         {ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 120); this.expirationTime -=1;}
    else if (this.expirationTime <= 0 || this.expirationTime > 499) {this.expirationTime -=1;}
    if (this.expirationTime == -100) {createNew();}
};

// getObstacle is a function that populates the obstucle array variable with random obstacle obsjects to be rendered in the game
// Arguments syntax: first number is the number of rows (max: 3) followed by the numbers of obstacles per row (number: < 5)
function getObstacle () {
    var args = Array.from(arguments);
    for (var x = 1; x < args[0] + 1; x++) { 
        for (var y = 0; y < args[x]; y++){
            var obstName = ["Rock",0,0,];
            var coordX = 0 + 101*Math.round(Math.random()*4);
            var coordY = 95 + 83*(x - 1);
            var expirationTime = "none";
            var src = 'images/' + obstName[0] + '.png';
            obstacles.push(new Prize (coordX, coordY, obstName[1], obstName[2], expirationTime, src,"obstacle")); 
        }
    }
}

// arrayComp is a boolean function that checks if param1 and param2 are values in an array
function arrayComp (param1, param2,array,locator) {
for (var i = 0; i < array.length; i++) {if (param1 == array[i].x && param2 == array[i].y) {return true;}}
    return false;
}

// createNew is a function that creates a random Prize object that does not overlap with any obstacles with a preset probability
function createNew () {
    var prizeName = ["GemBlue",1,0,"GemGreen",2,0, "GemOrange",3,0, "Heart",0,1];
    var prizeProbab = [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,3,3];
    var coordX = 0 + 101*Math.round(Math.random()*4);
    var coordY = 95 + 83*Math.round(Math.random()*2);
    do {coordX = 0 + 101*Math.round(Math.random()*4); coordY = 95 + 83*Math.round(Math.random()*2);} while (arrayComp(coordX,coordY,obstacles));
    var itemNum = 3*prizeProbab[Math.round(Math.random()*(prizeProbab.length-1))];
    var expirationTime = 700;
    var src = 'images/' + prizeName[itemNum] + '.png';
    prize = new Prize(coordX,coordY,prizeName[itemNum+1],prizeName[itemNum+2],expirationTime,src);
}

// Instantiation of our game objects
var player = new Player(202,404,0,0,0);
enemyCreate();
function enemyCreate() {
    var enemyNum = 1*playFactor;
    for (var i = 0; i < enemyNum; i++) {
        allEnemies.push(new Enemy (202*Math.random() + 550*i/enemyNum, 60, 90));
        allEnemies.push(new Enemy (0 + 550*(i+1)/enemyNum, 145, 60+i*5));
        allEnemies.push(new Enemy (101*Math.random()+ 550*i/enemyNum, 230, 40+i*5));
    }
}
getObstacle(3, 2, 1, 1);
createNew();
var prize;

// This listens for key presses and sends the keys to your
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (player.stepNum == 0) {player.handleInput(allowedKeys[e.keyCode]);
    player.stepNum = 1;}
});
