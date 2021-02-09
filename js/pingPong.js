function thatPingPongCanvas() {
	const mathFPS = 60

	var canvas = document.querySelector('canvas.ping-pong.running')
	var modeSel = document.querySelector('.ping-pong-portriat.running')
	var ctx = canvas.getContext('2d'), width, height;
	var padW, padH, padM, UpadY, CpadY, Br, mouseY;
	var Uscore = 0, Cscore = 0, Bx, By, BxV, ByV;
	var canCcol, canUcol, pause = false, scoreCdisp = false, scoreUdisp = false, portrait = false;
	const S = 0.018; speedVec(true)
	var Clim = 5
	setupCanvas()
	window.addEventListener('resize', setupCanvas)
	modeSel.addEventListener('change', function() {
		if (modeSel.value == 'portrait') portrait = true
		else portrait = false
		setupCanvas(false)
	})

	function dRect(x, y, w, h, r, c) {
		if (portrait) {
			var temp = x;
			x = y; y = temp;
			temp = w;
			w = h; h = temp;
		}
		ctx.fillStyle = c
		// ctx.fillRect(x, y, w, h)
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
		ctx.fill()
	}
	function dCir(x, y, r, c) {
		if (portrait) {
			var temp = x;
			x = y; y = temp;
		}
		ctx.fillStyle = c
		ctx.beginPath()
		ctx.arc(x, y, r, 0, 2*Math.PI)
		ctx.closePath()
		ctx.fill()
	}
	function dText(t, x, y, s, c) {
		if (portrait) {
			var temp = x;
			x = y; y = temp;
		}
		ctx.fillStyle = c
		ctx.font = s.toString()+'px Courier New'
		ctx.textAlign = 'center'
		ctx.fillText(t.toString(), x, y)
	}
	function dNet(w=5, c) {
		var n = 7, p = .3, ys = height/n
		for (let i = 0; i < n; ++i) {
			dRect(width/2 - w/2, (i*ys) + (p*ys/2), w, ys - (p*ys), w/2, c)
		}

		if (portrait) {
			dText('Computer', width/2 - (height/16), height/8, height/32, 'white')
			dText('Player', width/2 + (height/16), height/8, height/32, 'white')
			// dText('Player', 3*width/4, height - (height/32), height/32, 'white')
		} else {
			dText('Computer', width/4, height - (height/32), height/32, 'white')
			dText('Player', 3*width/4, height - (height/32), height/32, 'white')
		}
	}
	function setupCanvas(modeAuto=true) {
		width = canvas.parentElement.offsetWidth,
		height = canvas.parentElement.offsetHeight
		if (modeAuto) {
			if (height > width) portrait = true
			else portrait = false
		}
		if (!portrait) {
			modeSel.value = 'landscape'
		}
		if (portrait) {
			if (width*2 > height) width = height/2
			else height = 2*width
		} else {
			if (height*2 > width) height = width/2
			else width = 2*height
		}
		canvas.width = width
		canvas.height = height
		if (portrait) {
			var temp = width;
			width = height; height = temp;
		}

		canvas.onmousemove = playerInp
		canvas.ontouchmove = playerInp
		function playerInp(evt) {
			evt = evt ? evt : window.event;
			var rect = canvas.getBoundingClientRect();
			// mouseX = evt.clientX - rect.left;
			if (portrait) {
				if (evt.clientX) mouseY = evt.clientX-rect.left
				else mouseY = evt.touches[0].clientX-rect.left
			} else {
				if (evt.clientY) mouseY = evt.clientY - rect.top
				else mouseY = evt.touches[0].clientY - rect.top
			}
		}
		padW = height/16
		padH = height/4
		padM = padW
		UpadY = height/2 - padH/2
		CpadY = UpadY
		Br = height/20
		mouseY = height/2
		Clim = height/100
	}
	function render() {
		ctx.clearRect(0, 0, width, height)
		dRect(0, 0, width, height, height/20, 'black')
		dNet(height/80, 'white')

		dRect(width-padM-padW, UpadY, padW, padH, height/50, 'white')
		dRect(padM, CpadY, padW, padH, height/50, 'white')
		
		dCir(Bx*width, By*height, Br, 'white')
		
		dText(Uscore, 3*width/4, height/8, height/8, 'white')
		dText(Cscore, width/4, height/8, height/8, 'white')
		
		if (scoreUdisp) dText('+1', 3*width/4, height/2, height/8, 'white')
		if (scoreCdisp) dText('+1', width/4, height/2, height/8, 'white')

		window.requestAnimationFrame(render)
	}
	function speedVec(C, scoreIt) {
		Bx = .25; By = .5
		var ang = Math.random()*Math.PI - (Math.PI/2)
		ang *= .75
		var fac = ((Math.PI/2)-Math.abs(ang))
		if (fac < 1) fac = 1
		BxV = (S/fac)*Math.cos(ang)
		ByV = (S/fac)*Math.sin(ang)

		canCcol = false; canUcol = !canCcol;
		if (C) {
			Bx = .75
			BxV *= -1
			canCcol = true; canUcol = !canCcol;
			if (scoreIt) Cscore += 1
		} else if (scoreIt) Uscore += 1
	}
	function update() {
		if (pause) return

		Bx += BxV; By += ByV;
		// User loss
		if (Bx*width > width-Br) {
			pause = true
			scoreCdisp = true
			window.setTimeout(function() {
				pause = false
				scoreCdisp = false
				speedVec(true, true)
			}, 500)
		}
		// Computer loss
		if (Bx*width < Br) {
			pause = true
			scoreUdisp = true
			window.setTimeout(function() {
				pause = false
				scoreUdisp = false
				speedVec(false, true)
			}, 500)
		}

		if (By*height + Br > height) ByV = -1*Math.abs(ByV)
		if (By*height - Br < 0) ByV = Math.abs(ByV)

		// function dist(x,y) {return Math.sqrt(x*x + y*y);}
		var facH = 0.75
		// Computer pad collision
		if (canCcol
			&& (Bx*width - Br) < (padM + padW) 
			&& (Bx*width + Br) > (padM + padW)
			&& (By*height - Br*facH) < (CpadY + padH)
			&& (By*height + Br*facH) > (CpadY)
			// && ((By*height < CpadY && dist(padM + padW - Bx*width, CpadY - By*height) < Br)
			// 	|| 
			// (By*height > CpadY + padH && dist(padM + padW - Bx*width, CpadY + padH - By*height) < Br)
			// 	||
			// By*height > CpadY && By*height < CpadY + padH)
		) {
			canCcol = false; canUcol = !canCcol;
			BxV *= -1
			ByV = S*.03*(By*height - (CpadY + (padH/2)))
		}

		// User pad collision
		if (canUcol
			&& (Bx*width + Br) > (width-padM-padW)
		&& (Bx*width - Br) < (width-padM-padW)
		&& (By*height - Br*facH) < (UpadY + padH)
		&& (By*height + Br*facH) > (UpadY)) {
			canUcol = false; canCcol = !canUcol;
			BxV *= -1
			ByV = S*.03*(By*height - (UpadY + (padH/2)))
		}

		// AI code
		var comMove = By*height - CpadY - (padH/2)
		if (comMove > Clim) comMove = Clim
		if (comMove < -Clim) comMove = -Clim
		CpadY += comMove
		if (CpadY < 0) CpadY = 0
		if (CpadY > height-padH) CpadY = height-padH

		UpadY = mouseY - (padH/2)
		if (UpadY < 0) UpadY = 0
		if (UpadY > height-padH) UpadY = height-padH
	}
	window.requestAnimationFrame(render)
	window.setInterval(update, 1000/mathFPS)
}