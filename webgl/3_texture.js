var vertexShaderText = [
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mModl;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main() {',
'	fragColor = vertColor;',
'	gl_Position = mProj * mView * mModl * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText = [
'precision mediump float;',
'',
'varying vec3 fragColor;',
'',
'void main() {',
'	// gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n')

var InitDemo = function () {
	console.log('This is working')
	var canvas = document.getElementById('game-surface')
    var gl = canvas.getContext('webgl')
    if (!gl) {
    	console.log('WebGL not supported, falling back on experimental-webgl')
    	gl = canvas.getContext('experimental-webgl')
    }
    if (!gl) {alert('Your browser does not support WebGL')}

	// canvas.width = window.innerWidth
	// canvas.height = window.innerHeight
	// gl.viewport(0,0,window.innerWidth,window.innerHeight)
	
	gl.clearColor(0.75,0.85,0.8,1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.enable(gl.DEPTH_TEST)
	gl.enable(gl.CULL_FACE)
	gl.frontFace(gl.CCW) // counter clock wise vertex ordering
	gl.cullFace(gl.BACK)

	// create Shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER)
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

	gl.shaderSource(vertexShader, vertexShaderText)
	gl.shaderSource(fragmentShader, fragmentShaderText)

	gl.compileShader(vertexShader)
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return
	}
	gl.compileShader(fragmentShader)
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
		return
	}
	var program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program))
		return
	}
	// Only for debug releases as it can be slower
	// gl.validateProgram(program)
	// if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	// 	console.error('ERROR validating program!', gl.getProgramInfoLog(program))
	// 	return
	// }

	// create Buffers
	const vertexSize = 6, vertexPosOffset = 0, vertexColOffset = 3
	var boxVertices = [ 
	//	X, Y, Z 		R, G, B
		// Top
		-1.0, 1.0,-1.0,	0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,	0.5, 0.5, 0.5,
		 1.0, 1.0, 1.0,	0.5, 0.5, 0.5,
		 1.0, 1.0,-1.0, 0.5, 0.5, 0.5,
		// Left
		-1.0, 1.0, 1.0,	0.75, 0.25, 0.5,
		-1.0,-1.0, 1.0,	0.75, 0.25, 0.5,
		-1.0,-1.0,-1.0,	0.75, 0.25, 0.5,
		-1.0, 1.0,-1.0,	0.75, 0.25, 0.5,
		// Right
		 1.0, 1.0, 1.0,	0.25, 0.25, 0.75,
		 1.0,-1.0, 1.0,	0.25, 0.25, 0.75,
		 1.0,-1.0,-1.0,	0.25, 0.25, 0.75,
		 1.0, 1.0,-1.0,	0.25, 0.25, 0.75,
		// Front
		 1.0, 1.0, 1.0,	1.0, 0.0, 0.15,
		 1.0,-1.0, 1.0,	1.0, 0.0, 0.15,
		-1.0,-1.0, 1.0,	1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,	1.0, 0.0, 0.15,
		// Back
		 1.0, 1.0,-1.0,	0.0, 1.0, 0.15,
		 1.0,-1.0,-1.0,	0.0, 1.0, 0.15,
		-1.0,-1.0,-1.0,	0.0, 1.0, 0.15,
		-1.0, 1.0,-1.0,	0.0, 1.0, 0.15,
		// Bottom
		-1.0,-1.0,-1.0,	0.5, 0.5, 1.0,
		-1.0,-1.0, 1.0,	0.5, 0.5, 1.0,
		 1.0,-1.0, 1.0,	0.5, 0.5, 1.0,
		 1.0,-1.0,-1.0,	0.5, 0.5, 1.0,
	]
	var boxIndices = [
		// Top
		0, 1, 2,
		0, 2, 3,
		// Left
		5, 4, 6,
		6, 4, 7,
		// Right
		8, 9, 10,
		8, 10, 11,
		// Front
		13, 12, 14,
		15, 14, 12,
		// Back
		16, 17, 18,
		16, 18, 19,
		// Bottom
		21, 20, 22,
		22, 20, 23
	]
	var boxVertexBufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW)
	var boxIndexBufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW)

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
	gl.vertexAttribPointer( positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 
		vertexSize * Float32Array.BYTES_PER_ELEMENT, vertexPosOffset * Float32Array.BYTES_PER_ELEMENT)
	gl.vertexAttribPointer( colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 
		vertexSize * Float32Array.BYTES_PER_ELEMENT, vertexColOffset * Float32Array.BYTES_PER_ELEMENT)
	gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)

	// Tell OpenGL state machine which 'program' is active
	gl.useProgram(program)

	var matModlUniformLocation = gl.getUniformLocation(program, 'mModl')
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView')
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj')
	var modlMatrix = new Float32Array(16)
	var viewMatrix = new Float32Array(16)
	var projMatrix = new Float32Array(16)
	glMatrix.mat4.identity(modlMatrix)
	// glMatrix.mat4.identity(viewMatrix)
	glMatrix.mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]) // eyePos, eyeLook, up
	// glMatrix.mat4.identity(projMatrix)
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height,
		0.1, 1000.0) // field of view, aspect ratio, near, far
	gl.uniformMatrix4fv(matModlUniformLocation, gl.FALSE, modlMatrix)
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)

	// const identityMatrix = glMatrix.mat4.identity(new Float32Array(16))
	// main Render loop
	var angle = 0
	var loop = function () {
		deltaAngle = performance.now() / 1000 / 6 * 2 * Math.PI - angle
		angle += deltaAngle
		// glMatrix.mat4.rotate(modlMatrix, identityMatrix, angle, [0,1,0])
		glMatrix.mat4.rotate(modlMatrix, modlMatrix, deltaAngle/4, [1,0,0])
		glMatrix.mat4.rotate(modlMatrix, modlMatrix, deltaAngle, [0,1,0])
		gl.uniformMatrix4fv(matModlUniformLocation, gl.FALSE, modlMatrix)

		gl.clearColor(0.75,0.85,0.8,1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		// gl.drawArrays(gl.TRIANGLES, 0, 3)
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
		
		requestAnimationFrame(loop)
	}
	requestAnimationFrame(loop)
}