import Timeout from './timeout.js';
import '../styles/stylefile1.scss';

const _elements = {
  //блоки игры
  screens: {
    start:       document.getElementsByClassName('start-game')[0],
    action:      document.getElementsByClassName('play-game')[0],
    finish:      document.getElementsByClassName('end-game')[0]
  },
  buttons: {
    start:       document.getElementsByClassName('start')[0],
    restart:     document.getElementsByClassName('restart')[0],
    answer: {
      button:    document.getElementsByClassName('action-buttons'),
      yes:       document.getElementsByClassName('yes')[0],
      no:        document.getElementsByClassName('no')[0]
    }
  },
  values: {
    num1:        document.getElementsByClassName('a-value')[0],
    num2:        document.getElementsByClassName('b-value')[0],
    answer:      document.getElementsByClassName('answer')[0],
    operation:   document.getElementsByClassName('operation')[0]
  },
  service: {
    score:       document.getElementsByClassName('score')[0],
    progressBar: {
      wrapper:   document.getElementsByClassName('progress-bar')[0],
      handler:   document.getElementsByClassName('progress-bar-condition')[0]
    }
  }
};

const _timeout = new Timeout(_elements, 300);

class Quize {
  constructor() {
    this.operations = ['+', '-', '/', '*'];
    this.answers = {
      taskAnswer: null,
      fakeAnswer: null
    };
    this.score = 0;

    this._changeScreen('start');
    this.init();
  }

  init() {
    this.startGame(false);
    this.restartGame();
    this.manager();
  }

  startGame(render) {
    if (typeof render !== 'boolean') { throw new Error('Render must be a boolean.'); }

    var start = () => {
      _timeout.resetTimeout();
      this._changeScreen('action');

      this.setTask();
    };

    if (render) {
      start();
      return;
    }
    _elements.buttons.start.addEventListener('click', start);
  }

  restartGame() {
    _elements.buttons.restart.addEventListener('click', () => {
      this.startGame(true);
      this.score = 0;
    });
  }

  finishGame() {
    this._changeScreen('finish');
    _elements.service.score.innerHTML = this.score;
  }

  setTask() {
    var randomizer = this.randomizer();
    var task = {
      num1:      randomizer.numberInt(1, 20),
      num2:      randomizer.numberInt(1, 20),
      answer:    randomizer.numberInt(1, 20),
      operation: randomizer.operation()
    };

    this.answers.taskAnswer = this._calculator(task.num1, task.num2, task.operation);
    this.answers.fakeAnswer = task.answer;
    var answers = [this.answers.fakeAnswer, this.answers.taskAnswer];

    this.answers.fakeAnswer = answers[randomizer.numberInt(0, 1)];

    _elements.values.num1.innerHTML      = task.num1;
    _elements.values.num2.innerHTML      = task.num2;
    _elements.values.operation.innerHTML = task.operation;
    _elements.values.answer.innerHTML    = this.answers.fakeAnswer;
  }

  manager() {
    document.addEventListener('click', event => {
      if (!event.target.classList.contains('action-buttons')) { return; }

      var rightCondition = this.answers.taskAnswer === this.answers.fakeAnswer;
      var isYes = event.target.classList.contains('yes');

      console.log(isYes, rightCondition);
      console.log(this.answers.taskAnswer, this.answers.fakeAnswer);

      if (isYes && !rightCondition || !isYes && rightCondition) { this.finishGame(); return; }

      console.log(this.score);

      this.score++;
      this.startGame(true);
    });
  }

  _calculator(num1, num2, operation) {
    var result = null;

    if (operation === '+') { result = num1 + num2; }
    if (operation === '-') { result = num1 - num2; }
    if (operation === '*') { result = num1 * num2; }
    if (operation === '/') { result = (num1 / num2).toFixed(2); }

    return result;
  }

  randomizer() {
    return {
      operation: () => this.operations[Math.floor(Math.random() * this.operations.length)],
      numberInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };
  }

  _changeScreen(screenName, callback) {
    if (screenName !== 'start' && screenName !== 'action' && screenName !== 'finish') {
      throw new Error('There is only start, action and finish screens.');
    }
    Object.keys(_elements.screens).forEach(function(screen) {
      _elements.screens[screen].style.display = 'none';
    });
    if (typeof callback === 'function') { callback(); }
    _elements.screens[screenName].style.display = 'block';
  }
}

new Quize();
