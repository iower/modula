document.addEventListener("DOMContentLoaded", () => {
	
	var module1;
	setTimeout(function() {
		module1 = new Module();
	}, 250);
	
	var module2;
	setTimeout(function() {
		module2 = new Module({x: 350, y: 300});
	}, 500);
	
	var module3;
	setTimeout(function() {
		module3 = new Module({x: 500, y: 500});
	}, 750);

	setTimeout(function() {
		const success = wires.add(module1.outs.stdout, module2.ins.stdin);
		console.log('wire', success);
	}, 1000);
	
	setTimeout(function() {
		const success = wires.add(module2.outs.stdout, module3.ins.stdin);
		console.log('wire', success);
	}, 1500);

	setTimeout(function() {
		module3.drag({x: 650, y: 500});
	}, 2000);
	
	setTimeout(function() {
		module2.drag({x: 500, y: 300});
	}, 2500);
	
	
});


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5); // repeat on resize



let modules = [];
let moduleId = 0;
let scene = {
	redraw: () => {
		console.log('>>> scene.redraw()');
		
		// clear scene
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, 800, 600);
		
		// draw modules
		
		for (let i = 0; i < modules.length; i++) {
			const module = modules[i];
			module.draw();
		}
		
		// draw wires
		wires.draw();
	},
}

const Module = function(params) {
	var params = params ? params : {};
	
	this.id = moduleId++;
	this.name = 'test module ' + this.id;
	
	this.x = params.x ? params.x : 200;
	this.y = params.y ? params.y : 200;
	
	this.width = 100;
	this.height = 50;
	
	this.drag = function(coords) {
		if (typeof coords.x == 'number' && typeof coords.y == 'number') {
			this.x = coords.x;
			this.y = coords.y;
			console.log(this.x, this.y);
			scene.redraw();
		} else {
			console.log('coords: ', coords);
			throw new Error('module drag: wrong coordinates');
		}
		
	};
	
	this.ins = {
		'stdin': {
			module: this,
			direction: 'in',
			name: 'soundInput1',
			type: 'sound',
			getX: () => {
				return this.x - this.width/2;
			},
			getY: () => {
				return this.y;
			}
		}
	};
	
	this.outs = {
		'stdout': {
			module: this,
			direction: 'out',
			name: 'soundOutput1',
			type: 'sound',
			getX: () => {
				console.log('this = ', this);
				return this.x + this.width/2;
			},
			getY: () => {
				return this.y;
			}
		}
	};
	
	function drawBorder(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	
	this.draw = function() {
		console.log('>>> Module.draw()');
		var leftPos = this.x - this.width / 2;
		var rightPos = this.x + this.width / 2;
		var topPos = this.y - this.height / 2;
		var bottomPos = this.y + this.height / 2;
		
		// draw inner color
		ctx.fillStyle = "#aabbaa88";
		ctx.fillRect(leftPos, topPos, this.width, this.height);
		
		// draw borders
		
		drawBorder(leftPos, topPos, rightPos, topPos);
		drawBorder(rightPos, topPos, rightPos, bottomPos);
		drawBorder(rightPos, bottomPos, leftPos, bottomPos);
		drawBorder(leftPos, bottomPos, leftPos, topPos);
		
		// draw ports
		const drawPort = (port) => {
			const x = port.getX();
			const y = port.getY();
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, 2*Math.PI);
			ctx.stroke();
		};
		for (let portname in this.ins) {
			const port = this.ins[portname];
			drawPort(port);
		}
		for (let portname in this.outs) {
			const port = this.outs[portname];
			drawPort(port);
		}
	};
	
	modules.push(this);
	scene.redraw();
}

const wires = {
	_set: [],
	
	add: (port1, port2) => {
		if (port1, port2) {
			wires._set.push({ends: [port1, port2]});
			scene.redraw();
			return true;
		} else {
			return false;
		}
	},
	
	get: () => {
		return wires._set;
	},
	
	cleanup: () => {
		for (let i = 0; i < wires._set.length; i++) {
			// todo <<<
		}
	},
	draw: () => {
		for (let i = 0; i < wires._set.length; i++) {
			let wire = wires._set[i];
			
			const port1 = wire.ends[0];
			const port2 = wire.ends[1];
			
			const x1 = port1.getX();
			const y1 = port1.getY();
			const x2 = port2.getX();
			const y2 = port2.getY();
			
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.closePath();
		}
	},
};



/* MOUSE EVENTS */


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener('mousemove', function(e) {
	var mousePos = getMousePos(this, e);
	//console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener('click', function(e) {
	var mousePos = getMousePos(this, e);
	console.log('click: ' + mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener('mousedown', function(e) {
	var mousePos = getMousePos(this, e);
	console.log('mousedown: ' + mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener('mouseup', function(e) {
	var mousePos = getMousePos(this, e);
	console.log('mouseup: ' + mousePos.x + ',' + mousePos.y);
}, false);

canvas.addEventListener('selectstart', function(e) {
	e.preventDefault();
	return false;
}, false);

canvas.oncontextmenu = function(e) {
	e.preventDefault();
};



