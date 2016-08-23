require('../styles/stylefile1.scss');
require('./timeout.js');

;(function(window) {
  'use strict';

  var Quize;
  //создаем конструктор с приватными переменными (внутренний интерфейс)
  Quize = (function() {
    var _changeScreen, _calculator, _elements, _timeout;

    _elements = {
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

    Quize.prototype.operations = ['+', '-', '/', '*'];

    _timeout = new window.Timeout(_elements, 100);

    function Quize() {
      _changeScreen('start');
      this.init();
    }

    Quize.prototype.answers = {
      taskAnswer: null,
      fakeAnswer: null
    };

    Quize.prototype.score = 0;

    Quize.prototype.init = function() {
      this.startGame(false);
      this.restartGame();
      this.manager();
    };

    Quize.prototype.startGame = function(render) {
      if (typeof render !== 'boolean') { throw new Error('Render must be a boolean.'); }

      var start = function() {
        _timeout.resetTimeout();
        _changeScreen('action');

        this.setTask();
      }.bind(this);

      if (render) {
        start();
        return;
      }
      _elements.buttons.start.addEventListener('click', start);
    };

    Quize.prototype.restartGame = function() {
      _elements.buttons.restart.addEventListener('click', function() {
        this.startGame(true);
        this.score = 0;
      }.bind(this));
    };

    Quize.prototype.finishGame = function() {
      _changeScreen('finish');

      _elements.service.score.innerHTML = this.score;
    };

    Quize.prototype.setTask = function() {
      var randomizer = this.randomizer();
      var task = {
        num1:      randomizer.numberInt(1, 20),
        num2:      randomizer.numberInt(1, 20),
        answer:    randomizer.numberInt(1, 20),
        operation: randomizer.operation()
      };

      this.answers.taskAnswer = _calculator(task.num1, task.num2, task.operation);
      this.answers.fakeAnswer = task.answer;
      var answers = [this.answers.fakeAnswer, this.answers.taskAnswer];

      this.answers.fakeAnswer = answers[randomizer.numberInt(0, 1)];

      _elements.values.num1.innerHTML      = task.num1;
      _elements.values.num2.innerHTML      = task.num2;
      _elements.values.operation.innerHTML = task.operation;
      _elements.values.answer.innerHTML    = this.answers.fakeAnswer;
    };

    Quize.prototype.manager = function() {
      document.addEventListener('click', function(event) {
        if (!event.target.classList.contains('action-buttons')) { return; }

        var rightCondition = this.answers.taskAnswer === this.answers.fakeAnswer;
        var isYes = event.target.classList.contains('yes');

        console.log(isYes, rightCondition);
        console.log(this.answers.taskAnswer, this.answers.fakeAnswer);

        if (isYes && !rightCondition || !isYes && rightCondition) { this.finishGame(); return; }

        console.log(this.score);

        this.score++;
        this.startGame(true);
      }.bind(this));
    };

    _calculator = function(num1, num2, operation) {
      var result = null;

      if (operation === '+') { result = num1 + num2; }
      if (operation === '-') { result = num1 - num2; }
      if (operation === '*') { result = num1 * num2; }
      if (operation === '/') { result = (num1 / num2).toFixed(2); }

      return result;
    };

    Quize.prototype.randomizer = function() {
      return {
        operation: function() {
          return this.operations[Math.floor(Math.random() * this.operations.length)];
        }.bind(this),
        numberInt: function(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
      };
    };

    _changeScreen = function(screenName, callback) {
      if (screenName !== 'start' && screenName !== 'action' && screenName !== 'finish') {
        throw new Error('There is only start, action and finish screens.');
      }
      Object.keys(_elements.screens).forEach(function(screen) {
        _elements.screens[screen].style.display = 'none';
      });
      if (typeof callback === 'function') { callback(); }
      _elements.screens[screenName].style.display = 'block';
    };
    return Quize;
  })();

  new Quize();
})(window);
