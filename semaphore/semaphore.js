class Semaphore {
  constructor(maxRunningRequests = 1) {
    this.maxRunningRequests = maxRunningRequests;
    this.currentRequests = [];
    this.runningRequests = 0;
  }

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
    const req = this.currentRequests.shift();
    const { resolve, reject, functionToCall, args } = req;
    this.runningRequests++;
    let action = functionToCall(...args);
    action
      .then((res) => resolve(res))
      .catch((err) => reject(err))
      .finally(() => {
        this.runningRequests--;
        this.runNext();
      });
  }
}

let sem = new Semaphore(2);

sem.callFunction(fetch, "https://www.google.com");
