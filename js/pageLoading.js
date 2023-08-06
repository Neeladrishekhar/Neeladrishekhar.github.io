(function () {
	function keyframe() {
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(43,48,59,0.65)";
		ctx.fillRect(0, 0, width, height);
		ctx.globalCompositeOperation = "lighter";
		var x = mouseX - preMouseX,
			y = mouseY - preMouseY;
		preMouseX = mouseX;
		preMouseY = mouseY;
		for (
			var d = 0.86 * width,
				l = 0.125 * width,
				m = 0.5 * width,
				t = Math.random,
				n = Math.abs,
				o = numParticles;
			o--;

		) {
			var h = particle[o],
				i = h.x,
				j = h.y,
				a = h.a,
				b = h.b,
				c = i - mouseX,
				k = j - mouseY,
				g = Math.sqrt(c * c + k * k) || 0.001,
				c = c / g,
				k = k / g;
			if (repel && g < m)
				var s = 14 * (1 - g / m),
					a = a + (c * s + 0.5 - t()),
					b = b + (k * s + 0.5 - t());
			g < d &&
				((s = 0.0014 * (1 - g / d) * width),
				(a = a - c * s),
				(b = b - k * s));
			g < l &&
				((c = 2.6e-4 * (1 - g / l) * width),
				(a = a + x * c),
				(b = b + y * c));
			a *= 0.96;
			b *= 0.96;
			c = n(a);
			k = n(b);
			g = 0.5 * (c + k);
			0.1 > c && (a *= 3 * t());
			0.1 > k && (b *= 3 * t());
			c = 0.45 * g;
			c = Math.max(Math.min(c, 3.5), 0.4);
			i += a;
			j += b;
			i > width
				? ((i = width), (a *= -1))
				: 0 > i && ((i = 0), (a *= -1));
			j > height
				? ((j = height), (b *= -1))
				: 0 > j && ((j = 0), (b *= -1));
			h.a = a;
			h.b = b;
			h.x = i;
			h.y = j;
			h.size = c;
			h.draw();
		}
	}
	function mousePos(evt) {
		evt = evt ? evt : window.event;
		var rect = canvas.getBoundingClientRect();
		mouseX = evt.clientX - rect.left;
		mouseY = evt.clientY - rect.top;
		attr();
		if (pulseId) {
			window.clearInterval(pulseId);
			pulseId = false;
		}
	}
	function rep() {
		repel = true;
		return false;
	}
	function attr() {
		repel = false;
		return false;
	}
	function pulse() {
		rep();
		setTimeout(attr, 100);
	}
	function initParticle() {
		this.color =
			"rgb(" +
			Math.floor(256 * Math.random()) +
			"," +
			Math.floor(256 * Math.random()) +
			"," +
			Math.floor(256 * Math.random()) +
			")";
		this.b = this.a = this.x = this.y = 0;
		this.size = 20;
		var $this = this;
		this.draw = function () {
			ctx.fillStyle = $this.color;
			ctx.beginPath();
			ctx.arc($this.x, $this.y, $this.size, 0, 2 * Math.PI, true);
			ctx.closePath();
			ctx.fill();
		};
	}
	var numParticles = 600,
		particle = [],
		width = window.innerWidth,
		height = window.innerHeight,
		repel = false,
		mouseX,
		mouseY,
		preMouseX,
		preMouseY,
		ctx,
		canvas,
		pulseId;
	function initLoader() {
		(preMouseX = mouseX = 0.5 * width),
			(preMouseY = mouseY = 0.5 * height),
			(canvas.onmousedown = rep);
		canvas.onmouseup = attr;
		canvas.onmousemove = mousePos;
		window.addEventListener("resize", toresize);
		setInterval(keyframe, 35);
		pulseId = setInterval(pulse, 5000);
	}
	function toresize() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		mouseX = 0.5 * width;
		mouseY = 0.5 * height;
	}
	// canvas = document.getElementById('pageLoadCanvas');
	canvas = document.querySelector("canvas.running.waterFlowCanvas");
	if (!canvas) {
		var repeatIntervalID = window.setInterval(function () {
			canvas = document.querySelector("canvas.running.waterFlowCanvas");
			if (!canvas) {
				// we want to try again
			} else {
				window.clearInterval(repeatIntervalID);
				setThisUp();
			}
		}, 100); // check for every 0.1 sec
	} else setThisUp();
	function setThisUp() {
		ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		for (var i = 0; i < numParticles; i++) {
			var temp = new initParticle();
			temp.x = 0.5 * width;
			temp.y = 0.5 * height;
			temp.a = 34 * Math.cos(i) * Math.random();
			temp.b = 34 * Math.sin(i) * Math.random();
			particle[i] = temp;
		}
		initLoader();
	}

	var loadAmount = 5;
	var nextLoad = Math.floor(Math.random() * 10);
	function percentLoadSet() {
		loadAmount += nextLoad;
		if (loadAmount > 100) loadAmount = 100;
		setLoadPercent(loadAmount.toString() + "%");
		if (loadAmount == 100 && doneLoad) {
			// slide out the page
			document.querySelector("header").style.transform =
				"translateY(-100%)";
			setTimeout(function () {
				document.querySelector("header").style.display = "none";
			}, 1500);
			document.querySelector("main").classList.remove("hideOver");
			canvas.classList.remove("running");
		} else {
			if (doneLoad) {
				nextLoad = Math.floor(Math.random() * 3);
				setTimeout(percentLoadSet, nextLoad * 20);
			} else {
				nextLoad = Math.floor(Math.random() * 10);
				setTimeout(percentLoadSet, nextLoad * 100);
			}
		}
	}
	setTimeout(percentLoadSet, nextLoad * 100);
})();

var doneLoad = false;
function setLoadPercent(per) {
	if (per == "done") {
		doneLoad = true;
		return;
	}
	document.getElementById("loadPercent").innerHTML = per;
	if (per == "100%") {
		doneLoad = true;
		return;
	}
}
