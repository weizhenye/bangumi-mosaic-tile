class Queue {
  constructor({ interval = 6e4, limit = 1e3 }) {
    this.id = 0;
    this.running = false;
    this.interval = interval;
    this.limit = limit;
    this.tasks = [];
  }
  start() {
    this.id = setInterval(() => {
      if (!this.running && this.tasks.length) {
        const { fn, args } = this.tasks.shift();
        this.running = true;
        fn(...args)
          .catch(console.error)
          .then(() => { this.running = false; });
      }
    }, this.interval);
  }
  stop() {
    clearInterval(this.id);
  }
  push(task) {
    if (
      this.tasks.length < this.limit &&
      !this.tasks.find(t => t.id === task.id)
    ) {
      this.tasks.push(task);
    }
  }
}

module.exports = Queue;
