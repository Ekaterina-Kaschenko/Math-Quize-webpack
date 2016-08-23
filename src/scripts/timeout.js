;(function(window) {
  'use strict';

  var Timeout;
  Timeout = (function() {
    function Timeout(elements, time) {
      this.elements = elements;
      this.time     = time;

      this.startTimeout();
    }

    Timeout.prototype.timeout = {
      time:     Timeout.prototype.time,
      interval: null,
      count:    0
    };

    Timeout.prototype.startTimeout = function() {
      this.resetTimeout();

      var timeout = this.timeout;

      if (timeout.interval !== null) { clearInterval(timeout.interval); }
      timeout.interval = setInterval(function () {
        if (timeout.count >= 100) {
          clearInterval(timeout.interval);
          this.resetTimeout();
        }
        timeout.count++;
        this.setProgressBarWidth(timeout.count);
      }.bind(this), this.time);
    };

    Timeout.prototype.resetTimeout = function() {
      this.timeout.count = 0;
    };

    Timeout.prototype.setProgressBarWidth = function(value) {
      this.elements.service.progressBar.handler.style.width = value + '%';
    };
    return Timeout;
  })();

  window.Timeout = Timeout;

})(window);
