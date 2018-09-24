document.addEventListener("DOMContentLoaded", () => {
	
	
	setTimeout(function() {
		var module1 = new Module();
	}, 250);
	
	var module2;
	setTimeout(function() {
		module2 = new Module({x: 300, y: 300});
	}, 500);
	
	var module3;
	setTimeout(function() {
		module3 = new Module({x: 500, y: 500});
	}, 750);
	
	setTimeout(function() {
		module3.drag({x: 650, y: 500});
	}, 2000);
	
	setTimeout(function() {
		module2.drag({x: 500, y: 300});
	}, 4000);
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
		
		console.log(modules);
		// draw modules
		for (let i = 0; i < modules.length; i++) {
			const module = modules[i];
			module.draw();
		}
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
	
	this.inputs = [
		{
			name: 'soundInput1',
			type: 'sound',
		}
	];
	
	this.outputs = [
		{
			name: 'soundOutput1',
			type: 'sound',
		}
	];
	
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
	};
	
	modules.push(this);
	scene.redraw();
}

const wires = {
	set: [],
	
	add: (terminal1, terminal2) => {
		wires.set.push({
			terminals: [terminal1, terminal2],
		});
	},
	
	cleanup: () => {
		for (let i = 0; i < wires.set.length; i++) {
			// todo <<<
		}
	},
};



//wires.add(module1.outs.stdout, module1.ins.stdin);


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



