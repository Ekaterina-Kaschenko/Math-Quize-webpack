class Timeout {
  constructor(elements, time) {
    this.elements = elements;
    this.timeout = {
      time,
      interval: null,
      count:    0
    };

    this.startTimeout();
  }

  startTimeout() {
    this.resetTimeout();

    var timeout = this.timeout;

    if (timeout.interval !== null) { clearInterval(timeout.interval); }
    timeout.interval = setInterval(() => {
      if (timeout.count >= 100) {
        clearInterval(timeout.interval);
        this.resetTimeout();
      }
      timeout.count++;
      this.setProgressBarWidth(timeout.count);
    }, timeout.time);
  }

  resetTimeout() {
    this.timeout.count = 0;
  }

  setProgressBarWidth(value) {
    this.elements.service.progressBar.handler.style.width = `${value}%`;
  };
}

export default Timeout;