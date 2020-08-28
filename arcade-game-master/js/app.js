/** @fileOverview App.js 
* This file sets up classes for Enemy, Player, and Token, and then
* constructs instances of these classes to be used in the game. 
* App.js also takes care of some basic game procedures such as score-
* keeping, setting the locations where objects will be rendered
* on canvas, and determining how and when the game ends. 
*/

/** General Game Keeping
* Define game-keeping variables that will be used in 
* various functions. These need to be defined in the global scope. 
*/

// The score is set at 0 and stored in a variable.
var score = 0;
// The scoreEl variable is used in engine.js to place the score in DOM.
var scoreEl = document.getElementById('score');

// The 'lives' variable keeps track of how many lives the player has left.
var lives = 3;
var livesEl = document.getElementById('lives');

// The 'level' variable keeps track of Skill Level. It increases by 1
// when the player reaches the water (but only if the score is a multiple
// of 5). As a side effect, the number of enemies also increases by 1.
var level = 1;
var levelEl = document.getElementById('level');

// If the endGame() function is called, the value of 'gaveOver' will change
// to true, stopping all player and enemy movements.
var gameOver = false;

/** RandomY() and randomX()
*  These functions generate values of x and y which can be
*  used in other functions to render entities randomly within
*  predetermined boundaries. This helps in centering sprites on the
*  game tiles.
*/

// @return {number} y value
var randomY = function () {
    var diceRoll = Math.random();
    if (diceRoll <= 0.33) {
        return 50;
    }
    else if (diceRoll > 0.33 && diceRoll < 0.66) {
        return 150;
    }
    else {
        return 240;
    }   
};

// @return {number} x value
var randomX = function() {
    var diceRoll = Math.random();
    if (diceRoll <= 0.20) {
        return 0;
    }
    else if (diceRoll > 0.20 && diceRoll <= 0.40) {
        return 101;
    }
    else if (diceRoll > 0.40 && diceRoll <= 0.60) {
        return 202;
    }
    else if (diceRoll > 0.60 && diceRoll <= 0.80) {
        return 303;
    }
    else {
        return 403;
    }
};

/** Class Enemy
*  @param {number} x value
*  @param {number} y value
*  @param {number} speed value
*  @constructor
*  Creates the class Enemy, which will be used to construct
*  all the enemy objects which the player will have to avoid. The
*  function uses the keyword 'this' to apply variables to each
*  instance of Enemy.
*/

var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here.

    // The image/sprite for our enemies uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;   
};

/** Adds a method to the Enemy prototype  to update the
*  enemy's position after each tick of the game engine.  The update() 
*  method also sets a random speed for each enemy object and
*  returns the enemy to its starting point after each loop is
*  completed. 
*/

// @param {number} dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed* Math.random() * 4 * dt;
    if (this.x > 550) {
        this.x = -50;
    }
    // Any movement is multiplied by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.   
};

// Draw the enemy on the canvas (required method for game).
Enemy.prototype.render = function() {
    if (gameOver !== true) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

/** Class Player
*  @param {number} x value
*  @param {number} y value
*  @constructor
*  The Player class sets up a template for all instances of player.
*  The class requires an update(), render() and handleInput() method.
*/

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

/** @param {number} dt value
*  The player.prototype.update() method checks the location of the player
*  and causes certain events to happen in response. If the player's
*  y position is less than 20 pixels, it means he has safely made it across 
*  the road to the water. In this case, a cheer sound is triggered and the 
*  player is returned to his starting position. The score goes up 1 point.
*  If the score is a multiple of 5, a new enemy bug is generated and the 
*  Skill Level increases by 1. 
*/

Player.prototype.update = function(dt) {
    // Check if player makes it the water. If so, add 1 point to the score.
    if (this.y < 20) {
        var cheerSound = new Audio('sounds/jingle.ogg');
        cheerSound.play();
        this.x = 200;
        this.y = 400;
        score += 1;
        // Randomly generate a new enemy bug if score is a multiple of 5. 
        // The randomY variable assigns the new bug to one of three paths.
        if (score > 0 && score%5 === 0){
            allEnemies.push(new Enemy(randomX(), randomY(), Math.floor((Math.random()*100)+1)));
            level += 1;
        }    
    }
};

// Render the player on canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Assign keys to player movements
// @param {string} key 
Player.prototype.handleInput = function(key) {
    if (gameOver === false) {
        if (key === 'up' && this.y > 0) {
            this.y -= 80;
        }
        if (key === 'down' && this.y<350) {
            this.y += 80;
        }
        if (key === 'left' && this.x>80) {
            this.x -= 100;
        }
        if (key === 'right' && this.x < 350) {
            this.x += 100;
        }
    }    
};

/** Class Token
*  @param {number} x value
*  @param {number} y value 
*  @constructor
*  The Token class creates a template for all tokens used in the game.
*  A sprite image is randomly selected from the tokenChoices array. The
*  Token class also requires a render() method, just as the Player
*  and Enemy classes do.
*/

var Token = function(x, y) {
    this.x = x;
    this.y = y;
    // Randomly select a sprite image from the tokenChoices array
    this.sprite = tokenChoices[Math.round(Math.random()*6)];
};

var tokenChoices = ['images/gem-green.png', 'images/gem-orange.png', 'images/gem-blue.png', 
    'images/Rock.png', 'images/Key.png', 'images/Heart.png', 'images/Star.png'];

//  Render the token on canvas
Token.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** Instantiate objects
*  Enemy, player, and token objects are constructed using their 
*  respective Class objects as templates. The newly created enemies
*  and tokens are stored in arrays for easy access.
*/

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

var enemy1 = new Enemy(0, 50, 100);
allEnemies.push(enemy1);

var enemy2 = new Enemy(0, 150, 150);
allEnemies.push(enemy2);

var enemy3 = new Enemy(0, 240, 100);
allEnemies.push(enemy3);


// Place the player object in a variable called player
var player = new Player(200, 400);

// Place the token in an allTokens array
var allTokens = [];
var token1 = new Token(200, 20);
allTokens.push(token1);


// This listens for key presses and sends the keys to
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/** checkCollisions()
*  This function checks for enemy-player collisions after each
*  tick of the game engine. It loops through the allEnemies array
*  and compares each enemy's position to the player's position at
*  a specific point in time. If a match is found, it means that
*  a collision has occurred. A bite sound is triggered, the Lives
*  count decreases by 1, and the player is returned to his
*  starting position. If the Lives count hits zero, the endGame()
*  function is called to end the game.
*/

var checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (player.x < allEnemies[i].x + 50 &&
            player.x + 50 > allEnemies[i].x &&
            player.y < allEnemies[i].y + 80 &&
            player.y + 60 > allEnemies[i].y) {
                var biteSound = new Audio('sounds/Bite.wav');
                biteSound.play();
                player.x =200;
                player.y =400;
                lives -= 1;
        }
    }
    
    if (lives <= 0) {
            endGame();
    }       
};

/** checkTokenCollisions()
*  This function works much the same as checkCollisions(), but checking
*  for player-token collisions instead. Different events are triggered
*  depending on which token type is involved. In all cases,
*  the collision triggers a blip sound. Hearts increase the Lives count
*  by 1. Keys remove one enemy from the game by popping one element from
*  the allEnemies array if certain conditions are met. Other tokens add 
*  points to the score.
*/

var checkTokenCollisions = function() {
    for (var i = 0; i < allTokens.length; i++) {
        if (player.x < allTokens[i].x + 50 &&
            player.x + 50 > allTokens[i].x &&
            player.y < allTokens[i].y + 80 &&
            player.y + 60 > allTokens[i].y) {
                if (allTokens[i].sprite === 'images/gem-green.png' || 
                    allTokens[i].sprite === 'images/gem-blue.png' ||
                    allTokens[i].sprite === 'images/gem-orange.png') {
                        score += 2;
                }
                if (allTokens[i].sprite === 'images/Heart.png') {
                    lives += 1;
                }
                if (allTokens[i].sprite === 'images/Rock.png') {
                    score += 1;
                }
                if (allTokens[i].sprite === 'images/Key.png') {
                    if (allEnemies.length > 3 && allEnemies.length >= level) {
                        allEnemies.pop();
                    }
                    score +=5;
                }
                if (allTokens[i].sprite === 'images/Star.png') {
                    score += 10;
                }
                // Empty the allTokens array to make the token disappear from canvas.
                allTokens.splice(i,1);
                var tokenSound = new Audio('sounds/blip.ogg');
                tokenSound.play();
                // Add a new token to the allTokens array to render it randomly on the canvas. 
                allTokens.push(new Token(randomX(), randomY() ) );
        }

    }
};

// Causes the instructions modal to appear when 'How To Play' link is clicked
function overlay() {
    var el = document.getElementById('overlay');
    el.style.visibility = (el.style.visibility == 'visible') ? 'hidden' : 'visible';
}

// Causes the 'Game Over' overlay to appear and stops all player and enemy movements
function endGame() {
    var el = document.getElementById('game-over');
    el.style.visibility = 'visible';
    gameOver = true;
}

// Allow clickable icons to work in place of keys on mobile devices.
function mobileUp() {
    player.handleInput('up');
}

function mobileDown() {
    player.handleInput('down');
}

function mobileLeft() {
    player.handleInput('left');
}

function mobileRight() {
    player.handleInput('right');
}
