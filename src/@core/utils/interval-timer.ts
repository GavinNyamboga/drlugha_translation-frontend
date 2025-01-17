export class IntervalTimer {
	callbackStartTime;
	remainingTime;
	paused = false;
	timerId;
	callback;
	delay;

	constructor(callback, delay) {
		this.callback = callback;
		this.delay = delay;
	}

	pause() {
		if (!this.paused) {
			this.clear();
			this.remainingTime = new Date().getTime()- this.callbackStartTime;
			this.paused = true;
		}
	}

	resume() {
		if (this.paused) {
			if (this.remainingTime) {
				setTimeout(() => {
					this.run();
					this.paused = false;
					this.start();
				}, this.remainingTime);
			}else {
				this.paused = false;
				this.start();
			}
		}
	}

	clear() {
		clearInterval(this.timerId);
	}

	start() {
		this.clear();
		this.timerId = setInterval(() => {
			this.run();
		}, this.delay);
	}

	run() {
		this.callbackStartTime = new Date().getTime();
		this.callback();
	}
}
