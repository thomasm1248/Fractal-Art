var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




var points = {
	"a": {
		drag: false,
		x: canvas.width * 0.45,
		y: canvas.height * 0.4
	},
	"b": {
		drag: false,
		x: canvas.width * 0.55,
		y: canvas.height * 0.4
	},
	"c": {
		drage: false,
		x: canvas.width / 2,
		y: canvas.height / 2
	}
};




// Super Detailed Style
var style = {
	level: 19,
	scale: 2,
	background: "transparent",
	alpha: 1,
	color: {
		"19": "black"
	}
};




function getDir(x, y) {
	return Math.atan2(y, x);
}

function getMag(x, y) {
	return Math.sqrt(x * x + y * y);
}

function convertVector(ax, ay, bx, by) {
	var dx = bx - ax;
	var dy = by - ay;
	var dir = getDir(dx, dy);
	var mag = getMag(dx, dy);
	
	return {
		dir: dir,
		mag: mag
	};
}




function drawFractal(superDetailed) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(superDetailed) {
		ctx.fillStyle = style.background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	var cx = canvas.width / 2;
	var cy = canvas.height / 2;
	var vectors = [
		convertVector(points['c'].x, points['c'].y, points['a'].x, points['a'].y),
		convertVector(points['c'].x, points['c'].y, points['b'].x, points['b'].y)
	];
	for(var i in vectors) {
		vectors[i].mag /= cy / 2;
		vectors[i].dir -= Math.PI * 1.5;
	}
	
	var startingLines = [
		{
			x: 0,
			y: 0,
			dir: Math.PI * 1.5,
			mag: cy / 2
		}
	];
	
	function drawStages(count, inputLines) {
		var newLines = [];
		for(var j in inputLines) {
			var x = inputLines[j].x;
			var y = inputLines[j].y;
			var dir = inputLines[j].dir;
			var mag = inputLines[j].mag;
			for(var k in vectors) {
				var newX = mag * vectors[k].mag * Math.cos(dir + vectors[k].dir) + x;
				var newY = mag * vectors[k].mag * Math.sin(dir + vectors[k].dir) + y;
				var newLine = convertVector(x, y, newX, newY);
				newLine.x = newX;
				newLine.y = newY;
				newLines.push(newLine);
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(newX, newY);
				if(superDetailed) {
					var color = style.color["" + count];
					if(color) ctx.strokeStyle = color;
				}
				ctx.lineWidth = count / (superDetailed ? 5 : 2);
				ctx.stroke();
			}
		}
		count--;
		if(count) drawStages(count, newLines);
	}
	
	if(superDetailed) ctx.globalAlpha = style.alpha;
	ctx.strokeStyle = "black";
	ctx.save();
	ctx.translate(points["c"].x, points["c"].y);
	ctx.scale(style.scale, style.scale);
	drawStages(superDetailed ? style.level : 9, startingLines);
	ctx.restore();
	ctx.globalAlpha = 1;
}
drawFractal(false);




window.addEventListener("mousemove", function(e) {
	var x = e.clientX;
	var y = e.clientY;
	
	var change = false;
	for(var i in points) {
		if(points[i].drag) {
			points[i].x = x;
			points[i].y = y;
			change = true;
		}
	}
	
	if(change) {
		drawFractal(false);
	}
}, false);

window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 49:
			points["a"].drag = true;
			break;
		case 50:
			points["b"].drag = true;
			break;
		case 51:
			points["c"].drag = true;
			break;
		case 32:
			drawFractal(true);
			break;
		case 83:
			var input = prompt("Style");
			input = input.split(" ");
			if(input[0] === "color") {
				style.color = {};
				for(var i = 2; i < input.length; i += 2) {
					style.color[input[i - 1]] = input[i];
				}
			} else {
				style[input[0]] = input[1];
			}
			drawFractal(false);
			break;
	}
}, false);

window.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 49:
			points["a"].drag = false;
			break;
		case 50:
			points["b"].drag = false;
			break;
		case 51:
			points["c"].drag = false;
			break;
	}
}, false);
