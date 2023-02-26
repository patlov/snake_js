const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const retryBtn = document.getElementById('retry');

let highScore = 0;
let interValID = 0;
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

function showEndMenu() {
  let end_game_score = document.getElementById('end-game-score');
  document.getElementById('end-game-menu').style.display = 'block';
  end_game_score.innerHTML = scoreEl.innerHTML;
  // This way we update always our highscore at the end of our game
  // if we have a higher high score than the previous
  if (highScore < end_game_score.innerHTML) {
      highScore = score;
  }
  document.getElementById('high-score').innerHTML = highScore;
}

function hideEndMenu() {
  document.getElementById('end-game-menu').style.display = 'none';
}

function setup() {

  fruit.pickLocation();

  interValID = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    fruit.draw();

    if (snake.eat(fruit)) {
      fruit.pickLocation();
      updateScore();
      snake.draw(); // Add this line
    }

    snake.checkCollision();
    updateScore();
  }, 120);
}

function updateScore() {
  scoreEl.innerHTML = snake.total;
}

class Snake {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];
    }
  
    draw() {
      ctx.fillStyle = '#FFFFFF';
  
      for (let i = 0; i < this.tail.length; i++) {
        ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
      }
  
      ctx.fillRect(this.x, this.y, scale, scale);
    }
  
    update() {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
  
      this.tail[this.total - 1] = { x: this.x, y: this.y };
  
      this.x += this.xSpeed;
      this.y += this.ySpeed;
  
      if (this.x > canvas.width - scale) {
        this.x = 0;
      }
  
      if (this.x < 0) {
        this.x = canvas.width - scale;
      }
  
      if (this.y > canvas.height - scale) {
        this.y = 0;
      }
  
      if (this.y < 0) {
        this.y = canvas.height - scale;
      }
    }
  
    changeDirection(direction) {
      if ((direction === 'Left' && this.xSpeed !== scale) || 
          (direction === 'Right' && this.xSpeed !== -scale) ||
          (direction === 'Up' && this.ySpeed !== scale) ||
          (direction === 'Down' && this.ySpeed !== -scale)) {
        switch (direction) {
          case 'Up':
            this.xSpeed = 0;
            this.ySpeed = -scale;
            break;
          case 'Down':
            this.xSpeed = 0;
            this.ySpeed = scale;
            break;
          case 'Left':
            this.xSpeed = -scale;
            this.ySpeed = 0;
            break;
          case 'Right':
            this.xSpeed = scale;
            this.ySpeed = 0;
            break;
        }
      }
    }
  
    eat(fruit) {
      if (this.x === fruit.x && this.y === fruit.y) {
        this.total++;
        return true;
      } else {
        return false;
      }
    }
  
    checkCollision() {
      for (let i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
          this.total = 0;
          this.tail = [];
          updateScore();
          clearInterval(interValID);
          showEndMenu();
        }
      }
    }
  
    grow() {
      this.total++;
    }
  }
  
class Fruit {
  constructor() {
    this.x;
    this.y;
  }

  pickLocation() {
    this.x = (Math.floor(Math.random() * columns)) * scale;
    this.y = (Math.floor(Math.random() * rows)) * scale;
  }

  draw() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x, this.y, scale, scale);
  }
}


function addEventListener() {
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'ArrowUp':
        snake.changeDirection('Up');
        break;
      case 'ArrowDown':
        snake.changeDirection('Down');
        break;
      case 'ArrowLeft':
        snake.changeDirection('Left');
        break;
      case 'ArrowRight':
        snake.changeDirection('Right');
        break;
    }
  });

  retryBtn.addEventListener('click', () => {
    hideEndMenu();
    setup();
  });
}



snake = new Snake();
fruit = new Fruit();
addEventListener();

window.onload = () => {
    setup();
}