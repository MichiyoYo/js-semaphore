class Semaphore {
  constructor(maxTasks) {
    //max number of tasks allowed to run at the same time
    this.maxTasks = maxTasks;
    //queue of tasks to run
    this.queue = [];
    //current number of running tasks
    this.runningTasks = 0;
  }

  //enqueue a new task
  enqueue() {
    //if number of running tasks is < max tasks
    if (this.runningTasks < this.maxTasks) {
      return new Promise((resolve) => {
        resolve();
      });
    } else {
      //if max number of allowed tasks are running, adds the task to the queue to wait
      return new Promise((resolve, reject) => {
        this.queue.push({ resolve, reject });
      });
    }
  }

  dispatch() {
    console.log("dispatching");
    //if there is at least one task in the queue and # of running tasks is < than max
    if (this.queue.length > 0 && this.runningTasks < this.maxTasks) {
      //increment running tasks
      this.runningTasks++;
      //extract next task form the front of the queue
      let promise = this.queue.shift();
      //resolve the promise
      promise.resolve();
    }
  }

  //release semaphore
  release() {
    //decrement number of running tasks
    this.runningTasks--;
    //dispatch next task
    console.log("releasing");
    this.dispatch();
  }

  //empties queue and resets the semaphore
  purge() {
    if (this.queue.length > 0) {
      for (let i = 0; i < this.queue.length; i++) {
        this.queue[i].reject(new Error("Task has been purged"));
      }
      //empty queue
      this.queue = [];
      //reset number of running tasks
      this.runningTasks = 0;
    }
  }
}

let sem = new Semaphore(2);

async function test(id) {
  try {
    //returns a promise
    await sem.enqueue();
    console.log(`enqueuing task ${id}`);
    setTimeout(() => {
      sem.release();
      console.log(`task ${id} releases the semaphore`);
    }, 2000);
  } catch (err) {
    console.error(id, err);
  }
}

test(1);
test(2);
test(3);
test(4);

setTimeout(() => {
  test(10);
  test(11);
  test(12);
}, 1500);

// setTimeout(() => {
//   test(20);
//   test(21);
//   test(22);
// }, 2700);

// setTimeout(() => {
//   sem.purge();
// }, 2000);
