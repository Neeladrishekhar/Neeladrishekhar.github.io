graph = {
	'0' : ['1'],
	'1' : ['2'],
	'2' : ['0'],
}

Graph = {
	unitPx: 16,
	svgID: 'graphSvg',
	availableColors: 7,
	meta: {
		nodes:[],
		maxWide: 32,
		maxHigh: 32,
		labels:{}
	},
	draggedNode: false,
	dragMeta: {offset:{x:0,y:0}},
	addNode: function(string='{|?|}', x=0, y=0) {
		function getMP(CTM, e) {
			if (e.touches) { e = e.touches[0]; }
			return {
				x:(e.clientX - CTM.e)/CTM.a,
				y:(e.clientY - CTM.f)/CTM.d
			}
		}
		function startDrag(e) {
			Graph.draggedNode = this
			Graph.dragMeta.offset = getMP(this.parentElement.getScreenCTM(), e)
			Graph.dragMeta.offset.x -= (Graph.meta[this.id].x + Graph.meta[this.id].tx)
			Graph.dragMeta.offset.y -= (Graph.meta[this.id].y + Graph.meta[this.id].ty)
			this.parentElement.appendChild(this)
		}
		function duringDrag(e) {
			if (Graph.draggedNode) {
				e.preventDefault()
				var bot = this.getElementsByTagName('rect')[0]
				var mp = getMP(this.parentElement.getScreenCTM(), e)
				var dragX = mp.x - Graph.meta[this.id].x - Graph.dragMeta.offset.x
				var dragY = mp.y - Graph.meta[this.id].y - Graph.dragMeta.offset.y
				Graph.draggedNode.setAttribute('transform', 'translate('+dragX+','+dragY+')')
				Graph.meta[this.id].tx = dragX
				Graph.meta[this.id].ty = dragY
				Graph.renderLinks()
			}
		}
		function endDrag(e) {
			Graph.draggedNode = false
			Graph.dragMeta.offset = {x:0,y:0}
			Graph.renderLinks(true)
		}
		var wide = Graph.unitPx*((string.length>1)?string.length:2)
		var high = Graph.unitPx*2

		var group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
		var emptySpace = Graph.meta.nodes.indexOf(-1)
		if (emptySpace > -1) group.id = emptySpace
		else group.id = Graph.meta.nodes.length
		group.setAttribute('class','draggable')
		group.addEventListener('mousedown', startDrag)
		group.addEventListener('mousemove', duringDrag)
		group.addEventListener('mouseup', endDrag)
		group.addEventListener('touchstart', startDrag)
		group.addEventListener('touchmove', duringDrag)
		group.addEventListener('touchend', endDrag)
		group.addEventListener('touchleave', endDrag)
		group.addEventListener('touchcancel', endDrag)
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
		rect.setAttribute('x',x)
		rect.setAttribute('y',y)
		rect.setAttribute('rx',((wide*0.2 > high*0.4)?(wide*0.2):(high*0.4)))
		rect.setAttribute('ry',high*0.4)
		rect.setAttribute('width',wide)
		Graph.meta.maxWide = (wide > Graph.meta.maxWide) ? wide : Graph.meta.maxWide
		Graph.meta.maxHigh = (high > Graph.meta.maxHigh) ? high : Graph.meta.maxHigh
		rect.setAttribute('height',high)
		var colorPi = Math.ceil(Math.random() * Graph.availableColors)
		rect.setAttribute('class', 'color'+colorPi)
		rect.setAttribute('style','stroke-width:'+(Graph.unitPx/4))
	
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		text.setAttribute('x',(x+(wide/2)))
		text.setAttribute('y',(y+(high/2)+2))
		// text.setAttribute('pointer-events','none')
		text.setAttribute('text-anchor','middle')
		text.setAttribute('dominant-baseline','central')
		text.innerHTML = string
		
		group.appendChild(rect)
		group.appendChild(text)
		document.getElementById(Graph.svgID).appendChild(group)
		Graph.meta.nodes[group.id] = group.id
		Graph.meta.labels[string] = group.id
		Graph.meta[group.id] = {x:x,y:y,w:wide,h:high,tx:0,ty:0,to:[],from:[]}
		return group.id
	},
	linkNodes: function (from, to) {
		for (let i = 0; i < from.length; i++) {
			const nodeFrom = from[i];
			if (!Graph.meta.nodes.includes(nodeFrom)) continue
			for (let j = 0; j < to.length; j++) {
				const nodeTo = to[j];
				if (!Graph.meta.nodes.includes(nodeTo)) continue
				if (!Graph.meta[nodeFrom].to.includes(nodeTo)) Graph.meta[nodeFrom].to.push(nodeTo)
				if (!Graph.meta[nodeTo].from.includes(nodeFrom)) Graph.meta[nodeTo].from.push(nodeFrom)
			}
		}
		Graph.renderLinks()
	},
	linkLabels: function (from, to) {
		for (let i = 0; i < from.length; i++) 
			from[i] = Graph.meta.labels[from[i]];
		for (let i = 0; i < to.length; i++) 
			to[i] = Graph.meta.labels[to[i]];
		Graph.linkNodes(from, to)
	},
	renderLinks: function (end=false) {
		for (let n = 0; n < Graph.meta.nodes.length; n++) {
			const node = Graph.meta.nodes[n];
			if (node < 0) continue
			for (let i=0; i < Graph.meta[node].to.length; ++i) {
				const nodeTo = Graph.meta[node].to[i];
				var path = document.getElementById(node+'_'+nodeTo)
				if (path) {
					const p = Graph.getPoints(node, nodeTo)
					if (p.length > 6) path.setAttribute('d','M '+p[0]+' '+p[1]+' C '+p[2]+' '+p[3]+', '+p[4]+' '+p[5]+', '+p[6]+' '+p[7])
					else path.setAttribute('d','M '+p[0]+' '+p[1]+' Q '+p[2]+' '+p[3]+' '+p[4]+' '+p[5])
					if(end) path.parentElement.appendChild(path)
				} else Graph.makePath(node, nodeTo)
			}
		}
	},
	getPoints: function (n1, n2) {
		const f = Graph.meta[n1], t = Graph.meta[n2];
		var cf ={x:(f.x+f.tx+(f.w/2)), y:(f.y+f.ty+(f.h/2))}
		var ct ={x:(t.x+t.tx+(t.w/2)), y:(t.y+t.ty+(t.h/2))}
		function affro(vec, vecN, wide, high) {
			if (vec.y > vec.x*high/wide) {
				if (vec.y > -1.0*vec.x*high/wide) {return {
					y:vecN.y + (high/2),
					x:vecN.x + (high/2)*vec.x/vec.y
				}} else {return {
					x:vecN.x - (wide/2),
					y:vecN.y - (wide/2)*vec.y/vec.x
				}}
			} else {
				if (vec.y < -1.0*vec.x*high/wide) {return {
					y:vecN.y - (high/2),
					x:vecN.x - (high/2)*vec.x/vec.y
				}} else {return {
					x:vecN.x + (wide/2),
					y:vecN.y + (wide/2)*vec.y/vec.x
				}}
			}
		}
		var ft = {x:ct.x-cf.x, y:ct.y-cf.y}
		if (Math.abs(ft.x) < Graph.meta.maxWide && Math.abs(ft.y) < Graph.meta.maxHigh) { // make Bezier curve instead
			const mm = 4
			if (ft.x > 0)
			return [cf.x, cf.y-(f.h/2), cf.x-(mm*Graph.unitPx), cf.y-(f.h/2)-(mm*Graph.unitPx), ct.x+(mm*Graph.unitPx), ct.y-(t.h/2)-(mm*Graph.unitPx), ct.x, ct.y-(t.h/2)]
			else
			return [cf.x, cf.y-(f.h/2), cf.x+(mm*Graph.unitPx), cf.y-(f.h/2)-(mm*Graph.unitPx), ct.x-(mm*Graph.unitPx), ct.y-(t.h/2)-(mm*Graph.unitPx), ct.x, ct.y-(t.h/2)]
		}
		cf = affro(ft, cf, f.w, f.h)
		ft.x *= -1; ft.y *= -1;
		ct = affro(ft, ct, t.w, t.h)
		return [cf.x, cf.y, cf.x, (cf.y+ct.y)/2, ct.x, ct.y]
	},
	makePath: function(nodeFrom, nodeTo) {
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.id = nodeFrom+'_'+nodeTo
		path.setAttribute('style','stroke:black;fill:transparent;opacity:.6;stroke-linecap:round;stroke-width:'+(Graph.unitPx/4))
		path.setAttribute('marker-end','url(#arrow)')
		const p = Graph.getPoints(nodeFrom, nodeTo)
		if (p.length > 6) path.setAttribute('d','M '+p[0]+' '+p[1]+' C '+p[2]+' '+p[3]+', '+p[4]+' '+p[5]+', '+p[6]+' '+p[7])
		else path.setAttribute('d','M '+p[0]+' '+p[1]+' Q '+p[2]+' '+p[3]+' '+p[4]+' '+p[5])
		document.getElementById(Graph.svgID).appendChild(path)
	},
	preProcess: function(base) {
		var keys = Object.keys(base)
		var baseToFrom = {}
		keys.forEach(k => {
			base[k].forEach((n,i) => { // remove duplicates
				var chk = base[k].indexOf(n, base[k].indexOf(n)+1)
				while(chk > -1) {
					base[k].splice(chk,1)
					chk = base[k].indexOf(n, base[k].indexOf(n)+1)
				}
			})
			if (baseToFrom[k]) baseToFrom[k].to = base[k]
			else baseToFrom[k] = {to:base[k],from:[]}
			base[k].forEach(n => { // setting froms
				if (baseToFrom[n]) baseToFrom[n].from.push(k)
				else baseToFrom[n] = {to:[],from:[k]}
			})
		})
		return baseToFrom
	},
	reArrange: function(base) {
		const wideness = document.getElementById(Graph.svgID).width.baseVal.value - Graph.meta.maxWide
		const highness = document.getElementById(Graph.svgID).height.baseVal.value - Graph.meta.maxHigh

		const n = Math.ceil(Math.sqrt(Graph.meta.nodes.length))
		var gapw = Math.floor(wideness*0.9/n)
		var gaph = Math.floor(highness/n)
		gapw = (gapw > 1.2*Graph.meta.maxWide) ? gapw : 1.2*Graph.meta.maxWide
		gaph = (gaph > 1.2*Graph.meta.maxHigh) ? gaph : 1.2*Graph.meta.maxHigh

		// sorted skewed grid positions
		const keys = Object.keys(base)
		var ents = Object.entries(base)
		ents.sort(function(a,b) {
			return b[1].to.length+b[1].from.length-a[1].to.length-a[1].from.length
		})
		function recr(index, array, state, x, y, rem, d, c) {
			const nextState = {'+x':'+y','+y':'-x','-x':'-y','-y':'+x'}
			array[index].push([x,y])
			switch (state) {
			case '+x':
				x+=1
				break;
			case '+y':
				y+=1
				break;
			case '-x':
				x-=1
				break;
			case '-y':
				y-=1
				break;
			default:
				break;
			}
			index += 1 // 1 1 2
			if(index === array.length) return
			rem -= 1
			if (rem === 0) {
				state = nextState[state]
				c -= 1
				if(c === 0) {
					c=2
					d += 1
				}
				rem = d
			}

			recr(index, array, state, x, y, rem, d, c)
		}
		recr(0, ents, '-x', 0, 0, 1, 1, 2)
		for (let i = 0; i < ents.length; i++) {
			const node = Graph.meta.labels[ents[i][0]];
			Graph.meta[node].tx = wideness/2
			Graph.meta[node].ty = highness/2 - 5*Graph.unitPx
			Graph.meta[node].tx += (ents[i][2][0] * gapw) + ((Math.random()-.5)*gapw/4)
			Graph.meta[node].ty += (ents[i][2][1] * gaph) + (ents[i][2][0] * -.3 * gaph) + ((Math.random()-.5)*gaph/4)
			document.getElementById(node).setAttribute('transform', 'translate('+Graph.meta[node].tx+','+Graph.meta[node].ty+')')
		}
		
		// Random positions
		// for (let i = 0; i < ents.length; i++) {
		// 	const node = Graph.meta.labels[ents[i][0]];
		// 	Graph.meta[node].tx = Graph.meta.maxWide/2
		// 	Graph.meta[node].ty = Graph.meta.maxHigh/2
		// 	Graph.meta[node].tx += Math.random() * wideness
		// 	Graph.meta[node].ty += Math.random() * highness
		// 	document.getElementById(node).setAttribute('transform', 'translate('+Graph.meta[node].tx+','+Graph.meta[node].ty+')')
		// }

		// Grid positions
		// for (let i = 0; i < Graph.meta.nodes.length; i++) {
		// 	const node = Graph.meta.nodes[i];
		// 	Graph.meta[node].tx = (i%n)*gapw
		// 	Graph.meta[node].ty = Math.floor(i/n)*gaph
		// 	document.getElementById(node).setAttribute('transform', 'translate('+Graph.meta[node].tx+','+Graph.meta[node].ty+')')
		// }
	}
}

window.onload = function() {
	if (primary) graph = primary
	// graph = {'0':[]}
	// for (let i = 0; i < 50; i++) {
	// 	if (i < 25) graph[i+''] = ['45']
	// 	else graph[i+''] = ['10']
	// }

	bypass()
	function graphINIT() {
		// little cleanup and preprocessing of the graph
		graph = Graph.preProcess(graph)
		
		for (const node of Object.keys(graph)) Graph.addNode(node)
		Graph.reArrange(graph)
		for (const [node, links] of Object.entries(graph)) Graph.linkLabels([node],links.to)
	}
	graphINIT()
	var str = '{'
	const keys = Object.keys(graph)
	keys.forEach(k => {
		str += '\n"' + k + '":\n  ' + JSON.stringify(graph[k].to)+','
	})
	if (str.length > 1) str = str.substring(0, str.length - 1)
	str += '\n}'
	var textAr = document.getElementById('graphData')
	textAr.value = str

	for (let i = 0; i < Graph.availableColors; i++) {
		document.getElementsByTagName('footer')[0].innerHTML += '<div class="color'+i+'"></div>'
	}

	textAr.addEventListener('input', function() {
		try {
			graph = JSON.parse(textAr.value)
			textAr.classList.remove('incorrect')
			var SVGnodes = document.querySelectorAll('svg#graphSvg > g')
			for (let i = 0; i < SVGnodes.length; i++) {
				SVGnodes[i].remove()
			}
			var SVGpaths = document.querySelectorAll('svg#graphSvg > path')
			for (let i = 0; i < SVGpaths.length; i++) {
				SVGpaths[i].remove()
			}
			Graph.meta = {
				nodes:[],
				maxWide: 32,
				maxHigh: 32,
				labels:{}
			}
			graphINIT()
		} catch (error) {
			textAr.classList.add('incorrect')
			return
		}
	})
}

function bypass() {
	var svgHere = document.getElementById('graphSvg')
	svgHere.addEventListener('mouseup', function() {
		Graph.draggedNode = false
		Graph.dragMeta.offset = {x:0,y:0}
	})
	svgHere.addEventListener('touchend', function() {
		Graph.draggedNode = false
		Graph.dragMeta.offset = {x:0,y:0}
	})
	svgHere.addEventListener('touchleave', function() {
		Graph.draggedNode = false
		Graph.dragMeta.offset = {x:0,y:0}
	})
	svgHere.addEventListener('touchcancel', function() {
		Graph.draggedNode = false
		Graph.dragMeta.offset = {x:0,y:0}
	})
}