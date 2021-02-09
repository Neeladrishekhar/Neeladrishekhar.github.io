function imgIntroLocation() {
	var loc = document.querySelector("div.img-intro > div.location-card")
	var locIcon = document.querySelector("div.location > a.fa")
	if (loc.classList.contains('location-card-in')) {
		loc.classList.remove('location-card-in')
		locIcon.classList.remove('fa-arrow-left')
		locIcon.classList.add('fa-map-marker')
	} else {
		loc.classList.add('location-card-in')
		locIcon.classList.add('fa-arrow-left')
		locIcon.classList.remove('fa-map-marker')
	}
}

function inflateOverlay(expand) {
	var overlay = document.getElementById('overlay')
	var content = expand.parentElement.querySelector('div.name-time > div.detail');
	if (!content) content = expand.parentElement.querySelector('div.detail');
	if (!content) return
	overlay.style.display = 'flex'
	overlay.querySelector('section.content-holder > div.content').innerHTML = content.innerHTML;
}

function inflateCanvasOverlay(expand) {
	var overlay = document.getElementById('overlay')
	overlay.classList.add('forCanvas')
	var canvasContent = expand.parentElement.querySelector('template')
	if (!canvasContent) return

	var canvasHold = expand.parentElement.querySelector('canvas')
	if (canvasHold) {
		canvasHold.classList.remove("running")
	}

	overlay.style.display = 'flex'
	overlay.querySelector('section.content-holder > div.content').innerHTML = canvasContent.innerHTML;

	var overLayCanvas = overlay.querySelector('section.content-holder > div.content > div > div > canvas')
	if (!overLayCanvas) overLayCanvas = overlay.querySelector('section.content-holder > div.content > div > canvas')
	if (overLayCanvas) {
		overLayCanvas.classList.add('running')
		overLayCanvas.dataset.idStr = expand.parentElement.getAttribute('id')
		switch (overLayCanvas.dataset.idStr) {
			case 'clock':
				overLayCanvas.parentElement.style.width = '30rem'
				overLayCanvas.parentElement.style.height = '30rem'
				thatClockCanvas(false)
				break;
			case 'waterFlow':
				thatWaterFlowCanvas()
				break;
			case 'pingPong':
				thatPingPongCanvas()
				break
			default:
				break;
		}
	}
}

function deflateOverlay() {
	var overlay = document.getElementById('overlay')
	overlay.classList.remove('forCanvas')
	overlay.style.display = 'none'
}

function LRcontrol(ele, next=false) {
	var LRwrap = ele.parentElement.parentElement.querySelector('div.LR-wrap')
	var allSel = LRwrap.children
	var curSel = LRwrap.querySelector('div.look')
	const num = allSel.length
	const cur = Array.from(allSel).indexOf(curSel)
	var newCur = cur - 1
	if (next) newCur = cur + 1
	newCur = newCur % num
	if (newCur < 0) newCur = num + newCur

	curSel.classList.remove('look')
	allSel[newCur].classList.add('look')
	LRwrap.style.transform = 'translateX(-'+newCur+'00%)'
	var indexDiv = ele.parentElement.querySelector('div.info > div.indexing')
	var durSpan = ele.parentElement.querySelector('div.info > div.duration > span')
	indexDiv.innerHTML = (newCur+1).toString() + ' / ' + num
	durSpan.innerHTML = allSel[newCur].querySelector('div.duration').innerHTML
}

function warningForm(ele, infoS, inp=true) {
	if (inp) ele.classList.add('invalid')
	var info = ele.parentElement.querySelector('div.info')
	info.classList.add('warning')
	info.innerHTML = infoS
	setTimeout(function () {
		info.innerHTML = ''
		info.classList.remove('warning')
	}, 4000)
}

function sendMessage(btnEle) {
	var name = document.getElementById('msg_name')
	var mail = document.getElementById('msg_email')
	var mesg = document.getElementById('msg_msg')
	name.setAttribute("class", "")
	mail.setAttribute("class", "")
	mesg.setAttribute("class", "")

	if (name.value == '') {
		warningForm(name, 'No name given')
		return
	} else if (mail.value == '') {
		warningForm(mail, 'No email given')
		return
	} else if (mesg.value == '') {
		warningForm(mesg, 'No message given')
		return
	} else if (mail.value.indexOf('@') < 0 || mail.value.slice(mail.value.indexOf('@')).indexOf('.') < 1 || mail.value.slice(mail.value.indexOf('@')).indexOf('.')+1 >= mail.value.slice(mail.value.indexOf('@')).length) {
		warningForm(mail, 'Invalid Email address')
		return
	} else if (mesg.value.split(' ').length < 4) {
		warningForm(mesg, 'Message is too short')
		return
	}
	
	btnEle.parentElement.querySelector('div.loading').style.display = 'flex'
	var msgDb = db.ref('/webMsg')
	msgDb.once('value').then((snapshot) => {
		const subjects = snapshot.val() || {}
		const newMsgKey = Object.keys(subjects).length;
		var updates = {}
		
		updates['/'+newMsgKey] = [name.value, mail.value, mesg.value]
		msgDb.update(updates).then(function () {
			btnEle.parentElement.querySelector('div.loading').style.display = 'none'
			warningForm(btnEle, 'Message recieved', false)
			name.value = '';mail.value = '';mesg.value = '';
		}).catch(function (error) {
			btnEle.parentElement.querySelector('div.loading').style.display = 'none'
			warningForm(btnEle, 'Message could not be sent', false)
		})
	})
}

function twoDig(num) {
	var numStr = num.toString()
	if (numStr.length < 2) numStr = '0'+numStr
	return numStr
}

const sects = ['about', 'academics', 'achievements', 'resume', 'projects', 'interests', 'my canvas', 'contact']

function selectSect(sect) {
	var nav = document.querySelector('main > nav > ul > li.selected')
	var sec = document.querySelector('div#section-container > section.selected')
	nav.classList.remove('selected')
	sec.classList.remove('selected')
	
	nav = document.querySelectorAll('main > nav > ul > li')
	nav[sects.indexOf(sect)].classList.add('selected')
	sec = document.getElementById(sect)
	sec.classList.add('selected')
}

const whatAmI = ['programmer','designer','dreamer','leader','creator']
var whatAmIind = 1;

window.addEventListener('load', function (event) {
	var nav = document.querySelectorAll('main > nav > ul > li')
	for (let i = 0; i < nav.length; i++) {
		var liEle = nav[i].querySelector('a')
		liEle.href = "#"+sects[i]
		liEle.innerHTML = sects[i]
		nav[i].onclick = function() {
			selectSect(sects[i])
		}
		secEle = document.getElementById(sects[i])
		secEle.querySelector('div.indexHolder').innerHTML = '.'+twoDig(i+1)
		secEle.querySelector('h2').innerHTML = sects[i]
	}

	var LRholders = document.querySelectorAll('div.LR-holder')
	for (let i = 0; i < LRholders.length; i++) {
		const allSel = LRholders[i].querySelector('div.LR-wrap').children
		LRholders[i].querySelector('div.LR-control > div.info > div.indexing').innerHTML = '1 / '+allSel.length
		LRholders[i].querySelector('div.LR-control > div.info > div.duration > span').innerHTML = allSel[0].querySelector('div.duration').innerHTML
	}

	var skillBars = document.querySelectorAll('div.content > div.skill')
	for (let i = 0; i < skillBars.length; i++) {
		skillBars[i].querySelector('div.info > div.fillbar > div.bar').style.width = skillBars[i].querySelector('div.amount').innerHTML
	}

	var whatAmIEle = document.getElementById('whatAmI')
	setInterval(function() {
		whatAmIEle.classList.add('changing')
		setTimeout(function() {
			whatAmIEle.innerHTML = whatAmI[whatAmIind]
			whatAmIind += 1
			whatAmIind = whatAmIind%whatAmI.length
		}, 500)
		setTimeout(function() {
			whatAmIEle.classList.remove('changing')
		}, 1000)
	}, 5000)

	setLoadPercent('done')
}, false)