class Semaphore {
  constructor(maxRunningRequests = 1) {
    //limitator
    this.maxRunningRequests = maxRunningRequests;
    //queue of current requests
    this.currentRequests = [];
    //requests that are currently running
    this.runningRequests = 0;
  }

  /**
   * Adds a task to the currentRequest queue
   * @param {*} functionToCall
   * @param  {...any} args
   * @returns
   */
  callFunction(functionToCall, ...args) {
    return new Promise((resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        functionToCall,
        args,
      });
      this.runNext();
    });
  }

  runNext() {
    if (!this.currentRequests.length) return;
    //extract first request from the queue
    const req = this.currentRequests.shift();
    //destructure request properties into variables
    const { resolve, reject, functionToCall, args } = req;
    console.log(req);
    //increment number of running requests
    this.runningRequests++;
    //run request asyncronously

    let task = functionToCall;
    if (typeof task === "function") {
      task(...args)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => {
          this.runningRequests--;
          this.runNext();
        });
    }
  }

  fetch(url) {
    return fetch(url);
  }
}

let sem = new Semaphore(2);

sem.callFunction("fetch", "https://www.google.com");
sem.callFunction("fetch", "https://www.facebook.com");
sem.callFunction("fetch", "https://www.amazon.com");
sem.callFunction("fetch", "https://www.netflix.com");
