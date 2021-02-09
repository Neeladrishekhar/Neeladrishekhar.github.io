function thatClockCanvas(beforeLoad=true) {
	var timeV = function () {
		function timeV(node, oldTime, newTime) {
			this.isChanging = false
			this.duration = 600
			this.timeNode = node
			this.timeF = node.querySelector('div.f')
			this.timeB = node.querySelector('div.b')
			this.setFtime(oldTime)
			this.setBtime(newTime)
		}
		timeV.prototype.setFtime = function (time) {
			this.timeF.dataset.nv = time
		}
		timeV.prototype.setBtime = function (time) {
			this.timeB.dataset.nv = time
		}
		timeV.prototype.down = function (oldNV, newNV) {
			var thisNV = this
			if (this.isChanging) {
				return false
			}
			this.isChanging = true
			this.setFtime(oldNV)
			this.setBtime(newNV)
			this.timeNode.classList.add('changing')
			setTimeout(function () {
				thisNV.timeNode.classList.remove('changing')
				thisNV.isChanging = false
				thisNV.setFtime(newNV)
			}, this.duration)
		}

		return timeV
	}()

	var timeBlocks = document.querySelectorAll("div.clock-time > div")
	const nowDate = new Date()
	var oldTime = (new Date(nowDate.getTime() - 1000)).toLocaleTimeString().split(':').join('')
	var newTime = nowDate.toLocaleTimeString().split(':').join('')

	var timeVs = Array.from(timeBlocks).map(function (timeBlock, i) {
		return new timeV(timeBlock, oldTime[i%6], newTime[i%6])
	})
	function changeTime(timeStr) {
		oldTime = newTime
		newTime = timeStr
		for (let i = 0; i < timeVs.length; ++i) {
			if (oldTime[i%6] === newTime[i%6]) continue
			timeVs[i].down(oldTime[i%6], newTime[i%6]);
		}
	}
	
	// var canvas = document.getElementById('clockCanvas')
	var canvas = document.querySelector('canvas.clockCanvas.running')
	var ctx = canvas.getContext('2d')
	var width, height

	if (beforeLoad)
		window.addEventListener('load', initiateClock)
	else
		initiateClock()
	function initiateClock() {
		// width = canvas.parentElement.offsetWidth
		// height = canvas.parentElement.offsetHeight
		width = canvas.parentElement.offsetWidth
		height = canvas.parentElement.offsetHeight
		canvas.width = width
		canvas.height = height
		ctx.strokeStyle = '#28d1fa'
		ctx.lineWidth = width/30
		ctx.lineCap = 'round'
		ctx.shadowBlur = width/32
		ctx.shadowColor = '#28d1fa'
		window.requestAnimationFrame(renderClock)
	}
	function renderClock() {
		const now = new Date(),
			today = now.toDateString(),
			time = now.toLocaleTimeString(),
			hrs = now.getHours(),
			min = now.getMinutes(),
			sec = now.getSeconds(),
			milSec = now.getMilliseconds()

		// Background
		gradient = ctx.createRadialGradient(
			width/2, height/2, width/60, 
			width/2, height/2, 3*width/4)
		gradient.addColorStop(0, '#09303a')
		gradient.addColorStop(1, 'black')
		ctx.fillStyle = gradient
		// ctx.fillStyle = '#333333'
		ctx.fillRect(0, 0, width, height)
		// Hours
		ctx.beginPath()
		ctx.arc(width/2, height/2, width/2.2, -.5*Math.PI, (hrs/12)*Math.PI - .5*Math.PI)
		ctx.stroke()
		// Minutes
		ctx.beginPath()
		ctx.arc(width/2, height/2, width/2.6, -.5*Math.PI, (min/30)*Math.PI - .5*Math.PI)
		ctx.stroke()
		// Seconds
		ctx.beginPath()
		ctx.arc(width/2, height/2, width/3.2, -.5*Math.PI, ((sec+(milSec/1000))/30)*Math.PI - .5*Math.PI)
		ctx.stroke()
		// Date
		ctx.font = (width/15).toString()+"px Arial"
		ctx.fillStyle = '#28d1fa'
		ctx.textAlign = 'center'
		ctx.fillText(today, width/2, (height/2)-(width/12))
		// Time
		ctx.font = (width/12).toString()+"px Arial"
		ctx.fillStyle = '#28d1fa'
		ctx.textAlign = 'center'
		// ctx.fillText(time, width/2, (height/2)+(width/12))
		var timeHere = time.split(':').join('')
		if (newTime !== timeHere) changeTime(timeHere)

		window.requestAnimationFrame(renderClock)
	}
}
thatClockCanvas()