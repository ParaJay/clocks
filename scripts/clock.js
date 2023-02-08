export class Clock {

	start() {
		this.init();
		this.running = true;
	}

	stop() {
		this.running = false;
	}

	update() {
		let date = new Date();

		this.hours = date.getHours();
		this.minutes = date.getMinutes();
		this.seconds = date.getSeconds();
	}

	init(){}
}

//TODO: render hours and mins between points a and b
export class StandardClock extends Clock {
	#x; #y; #radius;

	constructor() {	
		super();

		this.canvas = document.getElementById("canvas");
		this.context = this.canvas.getContext("2d");

		let w = this.canvas.width;
		let h = this.canvas.height;

		this.#x = w / 2;
		this.#y = h / 2;

		this.#radius = ((this.#x * 0.75) + (this.#y * 0.75)) / 2;

		this.context.lineWidth = 6;
		this.context.font = "16px arial";
	}

	init() {
		document.getElementById("pad").style.display = "none";
		document.getElementById("timeBtn").style.display = "none";
	}

	update() {
		this.clear();
		super.update();
		this.render();
	}

	updateTime() {
		let date = new Date();

		this.hours = date.getHours();
		this.minutes = date.getMinutes();
		this.seconds = date.getSeconds();
	}

	clear() {
		this.context.beginPath();
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.arc(this.#x, this.#y, this.#radius, Math.PI * 2, null);
		this.context.stroke();
	}

	render() {
		this.context.fillStyle = "black";

		this.#drawSeconds();
		this.#drawMinutes();
		this.#drawHours();
		this.#drawNumbers();

		for(let i = 1; i < 61; i++) {
			let rot = this.#getRotation(i, 60);

			let x = this.#getX(rot, 0.95);
			let y = this.#getY(rot, 0.95);

			let x2 = this.#getX(rot);
			let y2 = this.#getY(rot);

			this.context.beginPath();
			this.context.moveTo(this.#x + x, this.#y - y);
			this.context.lineTo(this.#x + x2, this.#y - y2);
			this.context.stroke();
		}

		console.log(this.hours + ":" + this.minutes + ":" + this.seconds);
		this.ms = new Date().getMilliseconds();
	}

	#getX(rot, mult = 1) {
		return (this.#radius * mult) * Math.sin(rot);
	}

	#getY(rot, mult = 1) {
		return (this.#radius * mult) * Math.cos(rot);
	}

	#getRotation(value, div) {
		return (Math.PI * 2) * (value / div);
	}

	#drawSeconds() {
		this.#drawLine(this.seconds, 60, 0.93);
	}

	#drawMinutes() {
		this.#drawLine(this.minutes, 60, 0.8);
	}

	#drawHours() {
		this.#drawLine(this.hours, 12, 0.6);
	}
	
	#drawLine(value, div, off=1) {
		let rot = this.#getRotation(value, div);
		let x = this.#getX(rot, off);
		let y = this.#getY(rot, off);

		//x=r∗sin(θ),y=r∗cos(θ)

		this.context.beginPath();
		this.context.moveTo(this.#x, this.#y);
		this.context.lineTo(this.#x + x, this.#y - y);
		this.context.stroke();
	}

	#drawNumbers() {
		for(let i = 1; i < 13; i++) {
			let rot = this.#getRotation(i, 12);
			let x = this.#getX(rot, 0.88);
			let y = this.#getY(rot, 0.88);

			this.context.beginPath();
			
			let metrics = this.context.measureText(i.toString());
			this.context.fillText(i.toString(), this.#x + x - (metrics.width / 2), (this.#y - y) + (rot));
			this.context.stroke();
		}
	}
}

export class DigitalClock extends Clock {
	constructor() {
		super();
	}

	init() {
		document.getElementById("canvas").style.display = "none";
	}

	update() {
		super.update();

		let h = this.timify(this.hours);
		let m = this.timify(this.minutes);
		let s = this.timify(this.seconds);
	
		let text = (h + ":" + m + ":" + s);
	
		document.getElementById("time").textContent = text;
	
		this.ms = new Date().getMilliseconds(); //ensures it sleeps till next second
	}
	
	timify(value) {
		value = value.toString();
	
		return value.length == 1 ? "0" + value : value;
	}
}

export async function start(clock) {
	clock.start();

	while(clock.running) {
		clock.update();
		
		await sleep(1000 - clock.ms);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}